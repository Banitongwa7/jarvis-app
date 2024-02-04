import axios from 'axios';
const { apiKey } = require('../utils');

const client = axios.create({
    baseURL: 'https://api.openai.com/v1',
    headers: {
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${apiKey}`
    }
})

const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

export const apiCall = async (prompt, msg) => {
    try {
        const response = await client.post(chatGptEndpoint , {
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "user",
                    content: `Does this message want to generate an AI picture, image, art or anything similar? ${prompt} . Simply answer with a yes or no.`
                }
            ]
        })

        let isArt = response.data?.choices[0]?.message?.content;

        if(isArt.toLowerCase().includes('yes')) {
            return dalleApiCall(prompt, msg) || [];
        }else{
            return chatgptApiCall(prompt, msg) || [];
        }

    } catch (e) {
        console.error(e);
        return Promise.resolve({success: false, msg: e.message});
    }


    const chatgptApiCall = async (prompt, messages) => {
        try {
            const response = await client.post(chatGptEndpoint , {
                model: "gpt-3.5-turbo",
                messages
            })
            let answer = response.data?.choices[0]?.message?.content
            messages.push({role: 'assistant', content: answer.trim()})
            return Promise.resolve({success: true, data: messages});
        } catch (e) {
            console.error(e);
            return Promise.resolve({success: false, msg: e.message});
        }
    }
}


const dalleApiCall = async (prompt, messages) => {
    try {
        const imageResponse = await client.post(dalleEndpoint, {
            prompt: prompt,
            n: 1,
            size: '512x512',
        });
        let answer = imageResponse.data?.data[0]?.url
        messages.push({role: 'assistant', content: answer})
        return Promise.resolve({success: true, data: messages});
    } catch (e) {
        console.error(e);
        return Promise.resolve({success: false, msg: e.message});
    }
}
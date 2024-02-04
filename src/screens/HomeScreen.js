import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Features from "../components/Features";
import { dummyMessages } from "../utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Voice from "@react-native-voice/voice";
import { apiCall } from "../api/openAI";
import Tts from "react-native-tts";

export default function HomeScreen() {
  const [msg, setMsg] = useState([]);
  const [recording, setRecording] = useState(true);
  const [result, setResult] = useState("");
  const ScrollViewRef = useRef();
  const [loading, setLoading] = useState(false);

  const speechStartHandler = (e) => {
    console.log("speechStartHandler");
  };

  const speechEndHandler = (e) => {
    setRecording(false);
    console.log("speechEndHandler");
  };

  const speechErrorHandler = (e) => {
    console.log("speechErrorHandler");
  };

  const speechResultsHandler = (e) => {
    console.log("speechResultsHandler");
    const text = e.value[0];
    setResult(text);
  };

  const startRecording = async () => {
    try {
      Tts.stop();
      await Voice.start("en-US");
      setRecording(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      fetchResponse();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...msg];
      newMessages.push({ role: "user", content: result.trim() });
      setMsg([...newMessages]);
      updateScrollView();
      setLoading(true);
      apiCall(result.trim(), newMessages).then((res) => {
        setLoading(false);
        if (res.success) {
          setMsg([...res.data]);
          updateScrollView();
          setResult("");
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert("Error", res.msg);
        }
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      ScrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  const startTextToSpeech = (message) => {
    if(!message.content.includes('https')) {
      Tts.speak(message.content, {
        iosVoiceId: "com.apple.ttsbundle.Moira-compact",
        rate: 0.5,
      });
    }
  }

  const stopSpeaking = () => {
    Tts.stop();
    setRecording(false);
  }

  const clear = () => {
    setMsg([]);
    Tts.stop();
  }

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    // tts handler

    Tts.addEventListener("tts-start", (event) => console.log("start", event));
    Tts.addEventListener("tts-finish", (event) => console.log("finish", event));
    Tts.addEventListener("tts-cancel", (event) => console.log("cancel", event));
    Tts.addEventListener("tts-progress", (event) => console.log("progress", event));


    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        <View className="flex-row justify-center">
          <Image
            source={require("./../../assets/images/bot.png")}
            style={{ width: wp(25), height: hp(15) }}
            resizeMode="contain"
          />
        </View>

        {msg.length > 0 ? (
          <View className="space-y-2 flex-1">
            <Text
              style={{ fontSize: wp(5) }}
              className="text-gray-700 font-semibold ml-1"
            >
              Assistant
            </Text>
            <View
              style={{ height: hp(58) }}
              className="bg-neutral-200 rounded-3xl p-4"
            >
              <ScrollView
                ref={ScrollViewRef}
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}
              >
                {msg.map((item, index) =>
                  item.role == "assistant" ? (
                    item.content.includes("https") ? (
                      <View key={index} className="flex-row justify-start">
                        <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                          <Image
                            source={{ uri: item.content }}
                            className="rounded-2xl"
                            style={{ width: wp(60), height: hp(30) }}
                            resizeMode="contain"
                          />
                        </View>
                      </View>
                    ) : (
                      <View
                        key={index}
                        style={{ width: wp(70) }}
                        className="bg-emerald-100 rounded-xl p-2 rounded-tl-none"
                      >
                        <Text>{item.content}</Text>
                      </View>
                    )
                  ) : (
                    <View key={index} className="flex-row justify-end">
                      <View
                        style={{ width: wp(70) }}
                        className="bg-white rounded-xl p-2 rounded-tr-none"
                      >
                        <Text>{item.content}</Text>
                      </View>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}

        <View className="flex justify-center items-center">
          {loading ? (
            <Image
              source={require("./../../assets/images/loading.gif")}
              style={{ width: wp(40), height: hp(10) }}
            />
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Image
                className="rounded-full"
                source={require("./../../assets/images/voiceLoading.gif")}
                style={{ width: wp(40), height: hp(10) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Image
                className="rounded-full"
                source={require("./../../assets/images/recordingIcon.png")}
                style={{ width: wp(40), height: hp(10) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {msg.length > 0 && (
          <TouchableOpacity
            onPress={clear}
            className="bg-neutral-400 rounded-3xl p-2 absolute right-10 bottom-16"
          >
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        )}

        {msg.length > 0 && (
          <TouchableOpacity
            onPress={stopSpeaking}
            className="bg-red-400 rounded-3xl p-2 absolute left-10 bottom-16"
          >
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

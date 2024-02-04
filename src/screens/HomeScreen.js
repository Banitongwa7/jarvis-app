import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Features from "../components/Features";
import { dummyMessages } from "../utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function HomeScreen() {
  const [msg, setMsg] = useState(dummyMessages);
  const [recording, setRecording] = useState(true);
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
          {recording ? (
            <TouchableOpacity>
              <Image
                className="rounded-full"
                source={require("./../../assets/images/voiceLoading.gif")}
                style={{ width: wp(40), height: hp(10) }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
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
            onPress={() => setMsg([])}
            className="bg-neutral-400 rounded-3xl p-2 absolute right-10 bottom-16"
          >
            <Text className="text-white font-semibold">Clear</Text>
          </TouchableOpacity>
        )}

        {msg.length > 0 && (
          <TouchableOpacity
            onPress={() => setRecording(false)}
            className="bg-red-400 rounded-3xl p-2 absolute left-10 bottom-16"
          >
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
}

import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import React, { useState } from "react";
import Features from "../components/Features";
import { dummyMessages } from "../utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function HomeScreen() {
  const [msg, setMsg] = useState(dummyMessages);
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        <View className="flex-row justify-center">
          <Image
            source={require("./../../assets/images/bot.png")}
            style={{ width: wp(15), height: hp(15) }}
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
                            style={{ width: wp(60), height: hp(60) }}
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
      </SafeAreaView>
    </View>
  );
}

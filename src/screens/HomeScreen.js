import { View, Text, Image, SafeAreaView } from 'react-native'
import React, { useState } from 'react'

export default function HomeScreen() {
  const [msg, setMsg] = useState([]);
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
      <View className="flex-row justify-center">
        <Image source={require("./../../assets/images/bot.png")} style={{ width: wp(15), height: hp(15) }} />
      </View>


      </SafeAreaView>
    </View>
  )
}
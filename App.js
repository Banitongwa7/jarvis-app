import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, Text } from 'react-native';

export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-cyan-800">
      <Text className="text-white text-3xl font-bold">Hello friend !</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../assets/images/MainLogo.png";
import entryImg from "../assets/images/Frame.png";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={Logo} style={{ width: 350, height: 350 }} />
          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="p-2 my-2 bg-[#f49b33] text-black rounded-lg"
            >
              <Text className="text-lg font-semibold text-center">Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/home")}
              className="p-2 my-2 bg-[#2b2b2b] border border-[#f49b33] rounded-lg max-w-fit"
            >
              <Text className="text-lg text-[#f49b33] font-semibold text-center">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-center text-base font-semibold my-4 text-white">
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" /> or{" "}
              <View className="border-b-2 border-[#f49b33] p-2 mb-1 w-24" />
            </Text>
          </View>
          <TouchableOpacity
            className="flex flex-row justify-center items-center"
            onPress={() => router.push("/signin")}
          >
            <Text className="text-white font-semibold">Already a User? </Text>
            <Text className="text-base font-semibold underline text-[#f49b33]">
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
        <View className="felx-1">
          <Image source={entryImg} className="w-full" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

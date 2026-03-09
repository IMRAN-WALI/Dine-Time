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

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={Logo} style={{ width: 300, height: 300 }} />
          <View className="w-3/4">
            <TouchableOpacity
              onPress={() => router.push("/")}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

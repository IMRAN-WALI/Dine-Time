import { Image, ImageBackground, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/HomePageLogo.png";
import BackgroundImg from "../../assets/images/HomePageBackground.png";
import { BlurView } from "expo-blur";

const home = () => {
  return (
    <SafeAreaView style={{ backgroundColor: "#2b2b2b" }}>
      {/* Header Section */}
      <View className="flex items-center mt-4">
        <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg py-2 px-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-white text-lg font-semibold">
              Welcome To DineTime
            </Text>
            <Image source={Logo} className="w-24 h-12" resizeMode="contain" />
          </View>
        </View>
      </View>

      <ScrollView>
        <ImageBackground
          source={BackgroundImg}
          className="h-80 w-full mt-4 items-center justify-center"
          resizeMode="cover"
        >
          <BlurView
            intensity={100}
            tint="dark"
            className="px-6 py-4 shadow-lg w-full"
          >
            <Text className="text-center text-2xl font-bold text-white">
              Dine With Your Love Ones
            </Text>
            <Text className="text-center text-white text-lg mt-2 opacity-90">
              Experience the best dining moments
            </Text>
          </BlurView>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

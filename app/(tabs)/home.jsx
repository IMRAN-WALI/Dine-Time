import { useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/MainLogo.png";
import BackgroundImg from "../../assets/images/HomePageBackground.png";
import { BlurView } from "expo-blur";
import { restaurants } from "../../store/restaurants";

const Home = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [320, 0],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity className="mr-4">
      <Image
        resizeMode="cover"
        source={{ uri: item.image }}
        className="h-28 w-40 rounded-lg"
      />
      <Text className="text-white mt-1">{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "#2b2b2b", flex: 1 }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "#2b2b2b",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <View className="flex items-center">
          <View className="bg-[#5f5f5f] w-11/12 rounded-lg shadow-lg py-2 px-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-semibold">
                Welcome To DineTime
              </Text>
              <Image source={Logo} className="w-24 h-12" resizeMode="contain" />
            </View>
          </View>
        </View>
      </View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 70 }}
      >
        <Animated.View
          style={{
            height: imageHeight,
            opacity: imageOpacity,
            overflow: "hidden",
          }}
        >
          <ImageBackground
            source={BackgroundImg}
            resizeMode="cover"
            className="w-full items-center justify-center"
            style={{ height: 320 }}
          >
            <BlurView intensity={100} tint="dark" className="px-6 py-4 w-full">
              <Text className="text-center text-2xl font-bold text-white">
                Dine With Your Love Ones
              </Text>
              <Text className="text-center text-white text-lg mt-2 opacity-90">
                Experience the best dining moments
              </Text>
            </BlurView>
          </ImageBackground>
        </Animated.View>

        <View className="bg-[#2b2b2b] rounded-t-3xl -mt-8 pt-8">
          <View className="px-4 mt-4">
            <Text className="text-white text-xl font-bold mb-3">
              Popular Restaurants
            </Text>

            {restaurants?.length > 0 ? (
              <View style={{ height: 160 }}>
                <FlatList
                  data={restaurants}
                  renderItem={renderItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `popular-${index}`}
                />
              </View>
            ) : (
              <ActivityIndicator animating color="#fb9b33" />
            )}
          </View>

          <View className="px-4">
            <Text className="text-white text-xl font-bold mb-3">Near You</Text>

            {restaurants?.length > 0 ? (
              <View style={{ height: 160 }}>
                <FlatList
                  data={restaurants}
                  renderItem={renderItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `near-${index}`}
                />
              </View>
            ) : (
              <ActivityIndicator animating color="#fb9b33" />
            )}
          </View>

          <View className="px-4 mb-6">
            <Text className="text-white text-xl font-bold mb-3">
              Recommended
            </Text>

            {restaurants?.length > 0 ? (
              <View style={{ height: 160 }}>
                <FlatList
                  data={restaurants}
                  renderItem={renderItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `recommended-${index}`}
                />
              </View>
            ) : (
              <ActivityIndicator animating color="#fb9b33" />
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Home;
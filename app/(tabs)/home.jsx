import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../assets/images/MainLogo.png";
import BackgroundImg from "../../assets/images/HomePageBackground.png";
import { BlurView } from "expo-blur";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const getRestaurants = async () => {
    try {
      setLoading(true);

      const querySnapshot = await getDocs(collection(db, "restaurants"));

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRestaurants(data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

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
    <TouchableOpacity
      onPress={() => router.push(`/restaurent/${item.name}`)}
      className="bg-[#3f3f3f] rounded-2xl p-3 mr-4 w-56 shadow-lg"
    >
      <Image
        resizeMode="cover"
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        className="h-32 w-full rounded-xl"
      />

      <View className="mt-3">
        <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
          {item.name || "Restaurant Name"}
        </Text>

        <Text className="text-gray-300 text-xs mb-1" numberOfLines={1}>
          {item.address || "Address not available"}
        </Text>

        <View className="flex-row justify-between">
          <Text className="text-[#fb9b33] text-xs">
            Open: {item.opening || "N/A"}
          </Text>

          <Text className="text-[#fb9b33] text-xs">
            Close: {item.closing || "N/A"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{
          backgroundColor: "#2b2b2b",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fb9b33" size="large" />
        <Text className="text-white mt-4">Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b", flex: 1 },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "ios" && { paddingBottom: 20 },
      ]}
    >
      {/* HEADER */}
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
        <View className="items-center">
          <View className="bg-[#5f5f5f] w-11/12 rounded-lg py-2 px-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-semibold">
                Welcome To DineTime
              </Text>

              <Image source={Logo} className="w-24 h-12" resizeMode="contain" />
            </View>
          </View>
        </View>
      </View>

      {/* MAIN SCROLL */}
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 70, paddingBottom: 20 }}
      >
        {/* HERO IMAGE */}
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
            style={{ height: 320 }}
            className="w-full items-center justify-center"
          >
            <BlurView intensity={100} tint="dark" className="px-6 py-4 w-full">
              <Text className="text-center text-2xl font-bold text-white">
                Dine With Your Loved Ones
              </Text>

              <Text className="text-center text-white text-lg mt-2 opacity-90">
                Experience the best dining moments
              </Text>
            </BlurView>
          </ImageBackground>
        </Animated.View>

        {/* CONTENT */}
        <View className="bg-[#2b2b2b] rounded-t-3xl -mt-6 pt-6">
          {/* Popular */}
          <View className="px-4 mt-2">
            <Text className="text-white text-xl font-bold mb-3">
              Popular Restaurants
            </Text>

            <FlatList
              data={restaurants}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Near You */}
          <View className="px-4 mt-6">
            <Text className="text-white text-xl font-bold mb-3">Near You</Text>

            <FlatList
              data={restaurants}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Recommended */}
          <View className="px-4 mt-6 mb-4">
            <Text className="text-white text-xl font-bold mb-3">
              Recommended
            </Text>

            <FlatList
              data={restaurants}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default Home;

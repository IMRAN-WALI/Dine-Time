/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import {
  View,
  Text,
  Platform,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  Linking,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Restaurant() {
  const { restaurant } = useLocalSearchParams();
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);

  const handleNextImage = () => {
    const carouselLength = carouselData[0]?.images.length || 0;
    if (carouselLength === 0) return;

    const nextIndex = currentIndex + 1 < carouselLength ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  };

  const carouselItem = ({ item }) => (
    <View
      style={{ width: windowWidth - 2 }}
      className="h-64 relative round-[25px]"
    >
      <View
        style={{
          position: "absolute",
          top: "50%",
          backgroundColor: "rgba(0 , 0 , 0 , 0.6)",
          borderRadius: 50,
          padding: 5,
          zIndex: 10,
          right: "6%",
        }}
      >
        <Ionicons name="arrow-forward" size={24} color="black" />
      </View>
      <Image
        source={{ uri: item }}
        style={{
          opacity: 0.5,
          backgroundColor: "black",
          marginRight: 20,
          marginLeft: 5,
          borderRadius: 25,
        }}
        className="h-64"
      />
    </View>
  );

  const getRestaurantData = async () => {
    try {
      if (!restaurant) return;

      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant),
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant found");
        return;
      }

      for (const doc of restaurantSnapshot.docs) {
        const data = doc.data();
        setRestaurantData(data);

        // Carousel
        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", doc.id), // 🔹 Use doc.id
        );
        const carouselSnapshot = await getDocs(carouselQuery);
        const carouselImages = [];
        carouselSnapshot.forEach((carouselDoc) => {
          carouselImages.push(carouselDoc.data());
        });
        setCarouselData(carouselImages);

        // Slots
        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.id), // 🔹 Use doc.id
        );
        const slotsSnapshot = await getDocs(slotsQuery);
        const slots = [];
        slotsSnapshot.forEach((slotDoc) => {
          slots.push(slotDoc.data());
        });
        setSlotsData(slots[0]?.slot || []);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS == "android" && { paddingBottom: 1 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="h-full">
        <View className="flex-1 my-2 p-2">
          <Text className="text-xl text-[#f49b33] mr-2 font-semibold">
            {restaurant}
          </Text>
          <View className="border-b border-[#f49b33]" />
        </View>

        <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            style={{ borderRadius: 25 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

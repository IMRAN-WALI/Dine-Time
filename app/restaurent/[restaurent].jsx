/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
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
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Restaurant() {
  const params = useLocalSearchParams();
  const restaurent = params.restaurent || params.restaurants || params.name;
  const router = useRouter();
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [debug, setDebug] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  if (!restaurent) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
        <Text className="text-white text-lg">No restaurant selected</Text>
      </SafeAreaView>
    );
  }

  const carouselItem = ({ item }) => (
    <View style={{ width: windowWidth, alignItems: "center" }}>
      <Image
        source={{ uri: item }}
        style={{
          width: windowWidth - 32,
          height: 250,
          borderRadius: 25,
        }}
        resizeMode="cover"
      />
    </View>
  );

  const getRestaurantData = async () => {
    try {
      setLoading(true);
      setDebug("🔍 Finding restaurant...");

      const restaurantsQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurent),
      );
      const restaurantsSnapshot = await getDocs(restaurantsQuery);

      if (restaurantsSnapshot.empty) {
        setDebug("❌ No restaurant found");
        setLoading(false);
        return;
      }

      const restaurantDoc = restaurantsSnapshot.docs[0];
      const resId = restaurantDoc.id;
      const data = restaurantDoc.data();

      const restaurantNumber = resId.split("_")[1];

      setDebug(`✅ Restaurant: ${restaurent}, Number: ${restaurantNumber}`);
      setRestaurantData(data);

      const possibleFormats = [
        `/restaurants/restaurant_${restaurantNumber}`,
        `restaurants/restaurant_${restaurantNumber}`,
        `/restaurants/${resId}`,
        `restaurants/${resId}`,
      ];

      let images = [];
      let matchedFormat = "";

      const allCarouselSnapshot = await getDocs(collection(db, "carousel"));

      for (const format of possibleFormats) {
        const matchingDocs = [];
        allCarouselSnapshot.forEach((doc) => {
          const docData = doc.data();
          if (docData.res_id === format) {
            matchingDocs.push(docData);
          }
        });

        if (matchingDocs.length > 0) {
          matchedFormat = format;
          matchingDocs.forEach((docData) => {
            if (docData.images && Array.isArray(docData.images)) {
              images = [...images, ...docData.images];
            }
          });
          break;
        }
      }

      if (images.length === 0) {
        allCarouselSnapshot.forEach((doc) => {
          const docData = doc.data();
          if (doc.id.includes(`_${restaurantNumber}`) && docData.images) {
            if (Array.isArray(docData.images)) {
              images = [...images, ...docData.images];
            }
          }
        });
      }

      setDebug(
        `Format: ${matchedFormat || "Document ID match"}, Images: ${images.length}`,
      );
      setCarouselData(images);

      const slotsQuery = query(
        collection(db, "slots"),
        where("ref_id", "==", `/restaurants/${resId}`),
      );
      const slotsSnapshot = await getDocs(slotsQuery);

      let slots = [];
      slotsSnapshot.forEach((slotDoc) => {
        const slotData = slotDoc.data();
        if (Array.isArray(slotData.slot)) {
          slots = [...slots, ...slotData.slot];
        }
      });
      setSlotsData(slots);
    } catch (error) {
      console.log("❌ Error:", error);
      setDebug(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, [restaurent]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="text-white mt-4">{debug}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b", flex: 1 },
        Platform.OS == "android" && { paddingBottom: 1 },
        Platform.OS == "ios" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-3">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#f49b33" />
            </TouchableOpacity>
            <Text className="text-2xl text-[#f49b33] font-bold flex-1">
              {restaurent}
            </Text>
          </View>
          <View className="border-b border-[#f49b33] mt-2" />
        </View>

        {/* Carousel */}
        {carouselData.length > 0 ? (
          <View className="mb-2 relative">
            <FlatList
              ref={flatListRef}
              data={carouselData}
              renderItem={carouselItem}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={windowWidth}
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / windowWidth,
                );
                setActiveIndex(index);
              }}
            />

            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center items-center">
              <View className="flex-row bg-black/40 px-3 py-1 rounded-full">
                {carouselData.map((_, index) => {
                  // Sirf 5 dots show logic
                  if (index >= activeIndex - 2 && index <= activeIndex + 2) {
                    return (
                      <View
                        key={index}
                        className={`h-2 w-2 mx-1 rounded-full ${
                          activeIndex === index
                            ? "bg-white scale-125"
                            : "bg-gray-400"
                        }`}
                      />
                    );
                  }
                  return null;
                })}
              </View>
            </View>
          </View>
        ) : (
          <View className="mx-4 h-48 bg-gray-800 rounded-2xl justify-center items-center">
            <Ionicons name="images-outline" size={50} color="#666" />
            <Text className="text-gray-500 mt-2">No images in database</Text>
            <Text className="text-gray-600 text-xs mt-1">{debug}</Text>
          </View>
        )}

        {/* Restaurant Details */}
        {Object.keys(restaurantData).length > 0 && (
          <View className="mx-4 bg-gray-800 rounded-xl p-4 border-[#f49b33] border-2 mt-2">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={24} color="#f49b33" />
              <Text className="text-white text-xl font-bold ml-2">
                {restaurantData.name}
              </Text>
            </View>

            {restaurantData.address && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={18} color="#f49b33" />
                <Text className="text-gray-400 ml-2 flex-1 italic font-semibold">
                  {restaurantData.address}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between mt-3">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={18} color="#f49b33" />
                <Text className="text-gray-300 ml-1">
                  {restaurantData.opening} - {restaurantData.closing}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={18} color="#f49b33" />
                <Text className="text-gray-300 ml-1">
                  {restaurantData.seats} seats
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

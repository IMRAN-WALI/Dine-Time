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
  console.log("📥 Params:", params);

  const restaurent = params.restaurent || params.restaurants || params.name;

  const router = useRouter();
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [debug, setDebug] = useState("");

  if (!restaurent) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
        <Text className="text-white text-lg">No restaurant selected</Text>
      </SafeAreaView>
    );
  }

  const carouselItem = ({ item, index }) => (
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
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 32,
          backgroundColor: "rgba(0,0,0,0.7)",
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: 20,
        }}
      >
        <Text className="text-white font-semibold text-base">
          {restaurantData.name || restaurent} - View {index + 1}
        </Text>
      </View>
    </View>
  );

  const getRestaurantData = async () => {
    try {
      setLoading(true);
      setDebug("🔍 Finding restaurant...");

      // 1. Restaurant dhundo
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
      const resId = restaurantDoc.id; // "restaurants_1", "restaurants_2", etc.
      const data = restaurantDoc.data();

      // Extract restaurant number
      const restaurantNumber = resId.split("_")[1];

      setDebug(`✅ Restaurant: ${restaurent}, Number: ${restaurantNumber}`);
      setRestaurantData(data);

      // 2. Try all possible res_id formats
      const possibleFormats = [
        `/restaurants/restaurant_${restaurantNumber}`,
        `restaurants/restaurant_${restaurantNumber}`,
        `/restaurants/${resId}`,
        `restaurants/${resId}`,
        `/restaurants/restaurant_${restaurantNumber}`,
      ];

      let images = [];
      let matchedFormat = "";

      // 3. Get all carousel documents
      const allCarouselSnapshot = await getDocs(collection(db, "carousel"));

      // 4. Find matching documents by res_id
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

      // 5. If still no images, try by document ID pattern
      if (images.length === 0) {
        console.log("🔍 Trying by document ID pattern...");
        allCarouselSnapshot.forEach((doc) => {
          const docData = doc.data();
          // Check if document ID contains the restaurant number
          if (doc.id.includes(`_${restaurantNumber}`) && docData.images) {
            if (docData.images && Array.isArray(docData.images)) {
              images = [...images, ...docData.images];
            }
          }
        });
      }

      setDebug(
        `Format: ${matchedFormat || "Document ID match"}, Images: ${images.length}`,
      );
      setCarouselData(images);

      // 6. Slots data
      const slotsQuery = query(
        collection(db, "slots"),
        where("ref_id", "==", `/restaurants/${resId}`),
      );
      const slotsSnapshot = await getDocs(slotsQuery);

      let slots = [];
      slotsSnapshot.forEach((slotDoc) => {
        const slotData = slotDoc.data();
        if (slotData.slot && Array.isArray(slotData.slot)) {
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
        {/* Debug Info - Remove after fixing */}
        <View className="bg-gray-900 p-3 m-2 rounded-lg">
          <Text className="text-yellow-400">Debug: {debug}</Text>
          <Text className="text-white">
            Images found: {carouselData.length}
          </Text>
        </View>

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

        {/* Restaurant Details */}
        {Object.keys(restaurantData).length > 0 && (
          <View className="mx-4 mb-4 bg-gray-800 rounded-xl p-4">
            <View className="flex-row items-center">
              <Ionicons name="restaurant-outline" size={24} color="#f49b33" />
              <Text className="text-white text-xl font-bold ml-2">
                {restaurantData.name}
              </Text>
            </View>

            {restaurantData.address && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="location-outline" size={18} color="#9ca3af" />
                <Text className="text-gray-400 ml-2 flex-1">
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

        {/* Carousel */}
        {carouselData.length > 0 ? (
          <View className="mb-4">
            <Text className="text-white text-lg font-semibold px-4 mb-2">
              📸 Gallery ({carouselData.length} images)
            </Text>
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
            />
            {/* Pagination Dots */}
            {carouselData.length > 1 && (
              <View className="flex-row justify-center mt-2">
                {carouselData.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      index === 0 ? "bg-[#f49b33]" : "bg-gray-600"
                    }`}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View className="mx-4 h-48 bg-gray-800 rounded-2xl justify-center items-center">
            <Ionicons name="images-outline" size={50} color="#666" />
            <Text className="text-gray-500 mt-2">No images in database</Text>
            <Text className="text-gray-600 text-xs mt-1">{debug}</Text>
          </View>
        )}

        {/* Slots */}
        {slotsData.length > 0 && (
          <View className="px-4 mt-2 mb-6">
            <Text className="text-white text-lg font-semibold mb-3">
              ⏰ Available Slots ({slotsData.length})
            </Text>
            <View className="flex-row flex-wrap">
              {slotsData.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-[#f49b33] rounded-lg px-4 py-2 mr-2 mb-2"
                  onPress={() => alert(`Selected slot: ${slot}`)}
                >
                  <Text className="text-white font-semibold">{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

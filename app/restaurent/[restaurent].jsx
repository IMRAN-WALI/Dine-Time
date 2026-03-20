/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/DatePicker";
import FindSlots from "../../components/FindSlots";
import GuestPicker from "../../components/GuestPicker";
import { db } from "../../config/firebaseConfig";

export default function Restaurant() {
  const params = useLocalSearchParams();
  const restaurent = params.restaurent || params.restaurants || params.name;
  const router = useRouter();
  const flatListRef = useRef(null);
  const scrollViewRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;

  const [loading, setLoading] = useState(true);
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState([]);
  const [slotsData, setSlotsData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [debug, setDebug] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [date, setDate] = useState(new Date());

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

      setDebug(`✅ Restaurant: ${restaurent}`);
      setRestaurantData(data);

      // Carousel images (keep as is)
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

      setCarouselData(images);
      const slotsSnapshot = await getDocs(collection(db, "slots"));

      let slots = [];
      if (slotsSnapshot.size > 0) {
        const firstDoc = slotsSnapshot.docs[0];
        const slotData = firstDoc.data();

        if (slotData.slot && Array.isArray(slotData.slot)) {
          slots = slotData.slot;
        } else if (slotData.slots && Array.isArray(slotData.slots)) {
          slots = slotData.slots;
        }
      } else {
        console.log("No slots collection found");
      }

      setSlotsData(slots);

      if (slots.length > 0) {
        setDebug(`✅ Found ${slots.length} time slots`);
      } else {
        setDebug(`⚠️ No slots found in database`);
      }
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

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#2b2b2b] justify-center items-center">
        <ActivityIndicator size="large" color="#f49b33" />
        <Text className="text-white mt-4 px-4 text-center">{debug}</Text>
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
      className="flex-1"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
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
            <Text className="text-gray-500 mt-2">No images available</Text>
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

        {/* Date and Guest Selection */}
        <View className="mx-4 border-2 m-2 p-2 border-[#f49b33] rounded-xl">
          <View className="flex-1 flex-row m-2 p-2 justify-end items-center border-[#f49b33] rounded-xl border-2">
            <View className="flex-row flex-1">
              <Ionicons name="calendar" size={20} color="#f49b33" />
              <Text className="text-white mx-2 text-base">Booking Date</Text>
            </View>
            <DatePicker date={date} setDate={setDate} />
          </View>

          <View className="flex-1 flex-row h-14 bg-[#474747]  m-2 p-2 justify-end items-center border-[#f49b33] rounded-xl border-2">
            <View className="flex-row flex-1">
              <Ionicons name="people" size={20} color="#f49b33" />
              <Text className="text-white mx-2 text-base">
                Number of Guests
              </Text>
            </View>
            <GuestPicker
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>

        {/* Find Slots Component */}
        <View className="mx-4 mb-6">
          <View className="bg-[#1f1f1f] border-2 border-[#f49b33] rounded-2xl p-3">
            <Text className="text-[#f49b33] text-lg font-bold mb-2 text-center">
              Book Your Table
            </Text>
            <FindSlots
              restaurant={restaurent}
              date={date}
              selectedNumber={selectedNumber}
              slots={slotsData}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              scrollToBottom={scrollToBottom}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

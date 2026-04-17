/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const History = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const db = getFirestore();

  // Fetch user email
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        setUserEmail(email);
      } catch (e) {
        console.log("Email fetch error:", e);
      }
    };
    fetchUserEmail();
  }, []);

  // Fetch bookings
  const fetchBookings = async () => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    try {
      const bookingCollection = collection(db, "bookings");
      const bookingQuery = query(
        bookingCollection,
        where("email", "==", userEmail),
      );

      const bookingSnapshot = await getDocs(bookingQuery);
      const bookingList = bookingSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by date (newest first)
      bookingList.sort((a, b) => new Date(b.date) - new Date(a.date));

      setBookings(bookingList);
      console.log("Bookings fetched:", bookingList.length);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Could not fetch bookings. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto fetch when email is available
  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBookings();
  }, [userEmail]);

  // Card Component
  const BookingCard = ({ item }) => (
    <View className="mx-4 my-3 bg-[#1f1f1f] rounded-3xl overflow-hidden shadow-2xl border border-[#fb9b33]/20">
      {/* Orange Accent Bar */}
      <View className="h-1.5 bg-[#fb9b33]" />

      <View className="p-5">
        {/* Restaurant + Date */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-[#fb9b33] text-xl font-bold tracking-wide">
              {item?.restaurant || "Restaurant"}
            </Text>
            <Text className="text-white/70 text-sm mt-1">{item.date}</Text>
          </View>

          <View className="bg-[#fb9b33]/10 px-4 py-1 rounded-full">
            <Text className="text-[#fb9b33] text-xs font-semibold">
              {item.slot}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="space-y-3">
          <View className="flex-row items-center">
            <Ionicons name="people" size={20} color="#fb9b33" />
            <Text className="text-white ml-3 text-base">
              {item.guests} Guests
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="mail" size={20} color="#fb9b33" />
            <Text className="text-white/80 ml-3 text-sm flex-1">
              {item.email}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-black/30 px-5 py-3 flex-row justify-between items-center border-t border-white/10">
        <Text className="text-white/60 text-xs">
          Booking ID: {item.id.slice(0, 8)}...
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert("Details", "Booking details coming soon...")
          }
          className="bg-[#fb9b33] px-6 py-1.5 rounded-full"
        >
          <Text className="text-black font-semibold text-sm">View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <Text className="text-white text-lg">Loading your bookings...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      {/* Header */}
      <View className="px-6 pt-8 pb-6 bg-[#2b2b2b] border-b border-[#fb9b33]/20">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-4xl font-bold tracking-tighter">
              <Text className="text-white">Booking </Text>
              <Text className="text-[#fb9b33]">History</Text>
            </Text>
          </View>

          {/* Decorative Element */}
          <View className="w-16 h-16 bg-[#fb9b33]/10 rounded-2xl items-center justify-center border border-[#fb9b33]/30">
            <Ionicons name="time" size={32} color="#fb9b33" />
          </View>
        </View>

        <Text className="text-white/60 mt-3 text-base">
          {userEmail
            ? "All your past reservations at a glance"
            : "Sign in to view your booking history"}
        </Text>
      </View>

      {userEmail ? (
        bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingCard item={item} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#fb9b33"]}
                tintColor="#fb9b33"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-20">
                <Ionicons name="calendar-outline" size={60} color="#fb9b33" />
                <Text className="text-white text-xl mt-6 font-medium">
                  No bookings yet
                </Text>
                <Text className="text-white/60 text-center mt-2 px-10">
                  When you make a reservation, it will appear here.
                </Text>
              </View>
            }
          />
        ) : (
          // Empty state when logged in but no bookings
          <View className="flex-1 justify-center items-center px-10">
            <Ionicons name="calendar-outline" size={80} color="#fb9b33" />
            <Text className="text-white text-2xl mt-8 font-semibold">
              No Bookings Found
            </Text>
            <Text className="text-white/60 text-center mt-3 leading-6">
              You haven't made any reservations yet.{"\n"}Go ahead and book a
              table!
            </Text>
          </View>
        )
      ) : (
        // Not logged in
        <View className="flex-1 justify-center items-center px-8">
          <Ionicons name="lock-closed-outline" size={70} color="#fb9b33" />
          <Text className="text-white text-2xl font-semibold mt-8 text-center">
            Please sign in
          </Text>
          <Text className="text-white/60 text-center mt-3 mb-10">
            to view your booking history
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/signin")}
            className="w-full bg-[#fb9b33] py-4 rounded-2xl active:opacity-90"
          >
            <Text className="text-black text-lg font-bold text-center">
              Sign In Now
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;

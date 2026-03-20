import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // ← ADD THIS IMPORT
import { db } from "../config/firebaseConfig";
import validationSchema from "../utils/authSchema";

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
  scrollToBottom,
}) => {
  const router = useRouter(); // ← ADD THIS LINE
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const handlePress = () => {
    const newVisibility = !slotsVisible;
    setSlotsVisible(newVisibility);

    if (newVisibility && scrollToBottom && slots.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) {
      Alert.alert("Select a Slot", "Please select a time slot first");
      return;
    }

    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");

    if (userEmail) {
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
          bookingTime: new Date().toISOString(),
        });
        Alert.alert("Success", "🎉 Table booked successfully!");
        setSelectedSlot(null);
        setSlotsVisible(false);
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to book slot. Please try again.");
      }
    } else if (guestStatus === "true") {
      setFormVisible(true);
      setModalVisible(true);
    } else {
      Alert.alert(
        "Login Required",
        "Please login or continue as guest to book a table.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") },
        ],
      );
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setFormVisible(false);
  };

  const handleSlotPress = (slot) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
        bookingTime: new Date().toISOString(),
      });
      Alert.alert("Success", "🎉 Booking confirmed!");
      setModalVisible(false);
      setFormVisible(false);
      setSelectedSlot(null);
      setSlotsVisible(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to book. Please try again.");
    }
  };

  return (
    <View className="flex-1">
      {/* Buttons */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={handlePress}
          className="flex-1 bg-[#f49b33] rounded-xl py-3 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-center font-bold text-base">
            {slotsVisible ? "Hide Slots" : "Find Available Slots"}
          </Text>
        </TouchableOpacity>

        {selectedSlot && (
          <TouchableOpacity
            onPress={handleBooking}
            className="flex-1 bg-green-600 rounded-xl py-3 shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-bold text-base">
              Book for {selectedSlot}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slots Section */}
      {slotsVisible && (
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#f49b33] font-bold text-base">
              🕐 Available Time Slots
            </Text>
            <Text className="text-gray-400 text-xs">
              {slots?.length} slots available
            </Text>
          </View>

          <ScrollView
            className="bg-[#1f1f1f] rounded-xl max-h-48"
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ padding: 12 }}
          >
            <View className="flex-row flex-wrap">
              {slots && slots.length > 0 ? (
                slots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`m-1.5 px-5 py-2.5 rounded-lg ${
                      selectedSlot === slot ? "bg-green-600" : "bg-[#f49b33]"
                    }`}
                    onPress={() => handleSlotPress(slot)}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white font-bold text-center text-base">
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-8 w-full items-center">
                  <Ionicons name="time-outline" size={50} color="#f49b33" />
                  <Text className="text-gray-400 text-center mt-3 font-semibold">
                    No slots available
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-1">
                    Please check another date
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-[#1f1f1f] rounded-t-3xl p-6 pb-8">
            {formVisible && (
              <Formik
                initialValues={{ fullName: "", phoneNumber: "" }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <View className="flex-row justify-between items-center mb-6">
                      <Text className="text-[#f49b33] text-2xl font-bold">
                        Guest Details
                      </Text>
                      <TouchableOpacity onPress={handleCloseModal}>
                        <Ionicons
                          name="close-circle"
                          size={34}
                          color="#f49b33"
                        />
                      </TouchableOpacity>
                    </View>

                    <Text className="text-[#f49b33] mb-2 font-semibold text-base">
                      Full Name
                    </Text>
                    <TextInput
                      className="bg-[#2b2b2b] text-white rounded-xl px-4 py-3 mb-1 border border-gray-700"
                      placeholder="Enter your full name"
                      placeholderTextColor="#888"
                      onChangeText={handleChange("fullName")}
                      value={values.fullName}
                      onBlur={handleBlur("fullName")}
                    />
                    {touched.fullName && errors.fullName && (
                      <Text className="text-red-500 text-xs mb-3 ml-1">
                        {errors.fullName}
                      </Text>
                    )}

                    <Text className="text-[#f49b33] mb-2 font-semibold text-base mt-3">
                      Phone Number
                    </Text>
                    <TextInput
                      className="bg-[#2b2b2b] text-white rounded-xl px-4 py-3 mb-1 border border-gray-700"
                      placeholder="Enter your phone number"
                      placeholderTextColor="#888"
                      keyboardType="phone-pad"
                      onChangeText={handleChange("phoneNumber")}
                      value={values.phoneNumber}
                      onBlur={handleBlur("phoneNumber")}
                    />
                    {touched.phoneNumber && errors.phoneNumber && (
                      <Text className="text-red-500 text-xs mb-3 ml-1">
                        {errors.phoneNumber}
                      </Text>
                    )}

                    <TouchableOpacity
                      onPress={handleSubmit}
                      className="bg-[#f49b33] rounded-xl py-4 mt-8 shadow-lg"
                      activeOpacity={0.8}
                    >
                      <Text className="text-white text-center font-bold text-lg">
                        Confirm Booking
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;

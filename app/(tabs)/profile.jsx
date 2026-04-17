import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Profile = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const name = await AsyncStorage.getItem("userName");

        if (email) {
          setUserEmail(email);
          setUserName(name || "");
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log("Error loading user data:", error);
        setIsLoggedIn(false);
      }
    };

    loadUserData();
  }, []);

  const displayName = userName || userEmail.split("@")[0] || "Guest";

  const handleLogout = async () => {
    if (!isLoggedIn) {
      Alert.alert("Not Logged In", "You are already logged out.");
      return;
    }

    Alert.alert("Logout", "Do you really want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              "userEmail",
              "userName",
              "isGuest",
            ]);

            setUserEmail("");
            setUserName("");
            setIsLoggedIn(false);

            Alert.alert("Logged Out", "You have been successfully logged out.");
            router.replace("/signin");
          } catch (error) {
            console.log("Logout error:", error);
            Alert.alert("Error", "Something went wrong while logging out.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center pt-12 pb-10 bg-[#1f1f1f] rounded-b-3xl">
          <View className="relative">
            <View className="w-40 h-40 bg-gradient-to-br from-[#f49b33] to-[#e07c1f] rounded-full items-center justify-center border-[6px] border-[#f49b33] shadow-2xl">
              <Ionicons name="person" size={85} color="#f49b33" />
            </View>
          </View>

          <Text className="text-white text-4xl font-bold mt-6 tracking-wide">
            {displayName}
          </Text>

          <Text className="text-gray-400 text-lg mt-1 font-medium">
            {userEmail || "No email"}
          </Text>

          <View className="w-44 h-[4px] bg-[#f49b33] rounded-full mt-5" />
        </View>

        {/* Info Section */}
        <View className="mx-5 mt-5">
          <View className="bg-[#1f1f1f] rounded-2xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="mail-outline" size={24} color="#f49b33" />
              <View className="ml-4">
                <Text className="text-gray-400 text-sm">Email Address</Text>
                <Text className="text-white text-lg font-medium">
                  {userEmail || "Not available"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#f49b33" />
              <View className="ml-4">
                <Text className="text-gray-400 text-sm">Full Name</Text>
                <Text className="text-white text-lg font-medium">
                  {displayName}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-[#f49b33] text-xl font-bold mb-4 px-1">
            Account Settings
          </Text>

          <TouchableOpacity className="bg-[#1f1f1f] rounded-2xl p-5 flex-row items-center mb-3">
            <Ionicons name="settings-outline" size={26} color="#f49b33" />
            <Text className="text-white text-lg font-medium ml-4 flex-1">
              Edit Profile
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#1f1f1f] rounded-2xl p-5 flex-row items-center mb-3">
            <Ionicons name="heart-outline" size={26} color="#f49b33" />
            <Text className="text-white text-lg font-medium ml-4 flex-1">
              Favorites
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#1f1f1f] rounded-2xl p-5 flex-row items-center mb-8">
            <Ionicons name="help-circle-outline" size={26} color="#f49b33" />
            <Text className="text-white text-lg font-medium ml-4 flex-1">
              Help & Support
            </Text>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          {/* Logout Button - Disabled if not logged in */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={!isLoggedIn}
            className={`py-4 rounded-2xl flex-row items-center justify-center ${
              isLoggedIn ? "bg-[#f49b33]" : "bg-[#f49b33]"
            }`}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={26} color="white" />
            <Text className="text-white text-xl font-bold ml-3">
              {isLoggedIn ? "Logout" : "Already Logged Out"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unescaped-entities */
import { Formik } from "formik";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import entryImg from "../../assets/images/Frame.png";
import Logo from "../../assets/images/MainLogo.png";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (values) => {
    const { email, password } = values;
    console.log("✅ handleSignin called with:", { email, password });
    setLoading(true);

    try {
      console.log("🔥 Calling Firebase signIn...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Firebase signin successful!");

      // 🔥🔥 Save User Data to AsyncStorage
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userName", email.split("@")[0]); // Default naam (email ka pehla part)
      await AsyncStorage.setItem("isGuest", "false");

      console.log("✅ Email & Name saved to AsyncStorage:", email);

      Alert.alert("Success", "Signed in successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/home"),
        },
      ]);
    } catch (error) {
      console.error("❌ Signin Error:", error.code, error.message);
      let errorMessage = "Invalid email or password";
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage =
          "Too many failed attempts. Please wait a while and try again.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={Logo} style={{ width: 150, height: 150 }} />
          <Text className="text-3xl text-center text-white font-bold mb-4">
            Welcome Back!
          </Text>
          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSignin}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="w-full">
                  <Text className="text-[#f49b33] text-lg font-semibold mt-4 mb-2">
                    Email
                  </Text>
                  <View className="flex-row items-center border border-white rounded-lg px-3">
                    <Ionicons name="mail-outline" size={20} color="#f49b33" />
                    <TextInput
                      className="flex-1 h-12 text-white ml-2"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      keyboardType="email-address"
                      placeholder="Enter your email"
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      editable={!loading}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </Text>
                  )}

                  <Text className="text-[#f49b33] text-lg font-semibold mt-4 mb-2">
                    Password
                  </Text>
                  <View className="flex-row items-center border border-white rounded-lg px-3">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#f49b33"
                    />
                    <TextInput
                      className="flex-1 h-12 text-white ml-2"
                      value={values.password}
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#888"
                      editable={!loading}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="p-2"
                      disabled={loading}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={22}
                        color="#f49b33"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.password}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={() => router.push("/forgot-password")}
                    className="self-end mt-2"
                    disabled={loading}
                  >
                    <Text className="text-[#f49b33] text-sm">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="py-3 my-6 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-lg font-bold text-center text-black">
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center">
                    <Text className="text-white">Don't have an account? </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/signup")}
                      disabled={loading}
                    >
                      <Text className="text-[#f49b33] font-semibold underline">
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>

        <View className="flex-1 justify-end">
          <Image source={entryImg} className="w-full" resizeMode="contain" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;

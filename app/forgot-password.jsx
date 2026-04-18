/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-unescaped-entities */
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Yup from "yup";
import Logo from "../assets/images/MainLogo.png";
import { auth } from "../config/firebaseConfig";
import entryImg from "../assets/images/Frame.png";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is Required")
    .email("Invalid Email Format"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (values) => {
    const { email } = values;
    console.log("✅ handleResetPassword called with:", { email });
    setLoading(true);

    try {
      console.log("🔥 Calling Firebase sendPasswordResetEmail...");
      await sendPasswordResetEmail(auth, email);
      console.log("✅ Password reset email sent!");

      Alert.alert("Success", "Password reset email sent! Check your inbox.", [
        {
          text: "OK",
          onPress: () => router.replace("/signin"),
        },
      ]);
    } catch (error) {
      console.error("❌ Reset Password Error:", error.code, error.message);
      let errorMessage = "Failed to send reset email";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please wait and try again.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Reset Failed", errorMessage);
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
            Forgot Password?
          </Text>
          <Text className="text-center text-white mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>
          <View className="w-5/6">
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema}
              onSubmit={handleResetPassword}
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

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="py-3 my-6 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-lg font-bold text-center text-black">
                      {loading ? "Sending..." : "Send Reset Email"}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center">
                    <Text className="text-white">Remember your password? </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/signin")}
                      disabled={loading}
                    >
                      <Text className="text-[#f49b33] font-semibold underline">
                        Sign In
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

export default ForgotPassword;

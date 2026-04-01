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
import validationSchema from "../../utils/authSchema";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

// Firebase Imports
import { auth, db } from "../../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignup = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/signin") },
      ]);
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Signup Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="m-2 flex justify-center items-center">
          <Image source={Logo} style={{ width: 100, height: 100 }} />
          <Text className="text-3xl text-center text-white font-bold">
            Let's Get Started
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "", confirmPassword: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignup}
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
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email}
                    </Text>
                  )}

                  <Text className="text-[#f49b33] text-lg font-semibold mt-2 mb-2">
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
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="p-2"
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

                  <Text className="text-[#f49b33] text-lg font-semibold mt-2 mb-2">
                    Confirm Password
                  </Text>
                  <View className="flex-row items-center border border-white rounded-lg px-3">
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#f49b33"
                    />
                    <TextInput
                      className="flex-1 h-12 text-white ml-2"
                      value={values.confirmPassword}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      secureTextEntry={!showConfirmPassword}
                      placeholder="Confirm your password"
                      placeholderTextColor="#888"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="p-2"
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={22}
                        color="#f49b33"
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text className="text-red-500 text-xs mt-1 ml-1">
                      {errors.confirmPassword}
                    </Text>
                  )}

                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className="py-3 my-6 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-lg font-bold text-center text-black">
                      {loading ? "Creating Account..." : "Sign Up"}
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center">
                    <Text className="text-white">
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity onPress={() => router.push("/signin")}>
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

export default Signup;

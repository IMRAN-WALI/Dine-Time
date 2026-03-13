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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import entryImg from "../../assets/images/Frame.png";
import Logo from "../../assets/images/MainLogo.png";
import validationSchema from "../../utils/authSchema";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignin = (values) => {
    // Handle signin logic here
    console.log("Signin values:", values);
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
              validationSchema={validationSchema}
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

                  {/* Forgot Password Link */}
                  <TouchableOpacity
                    onPress={() => router.push("/forgot-password")}
                    className="self-end mt-2"
                  >
                    <Text className="text-[#f49b33] text-sm">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSubmit}
                    className="py-3 my-6 bg-[#f49b33] rounded-lg"
                  >
                    <Text className="text-lg font-bold text-center text-black">
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center">
                    <Text className="text-white">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.push("/signup")}>
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

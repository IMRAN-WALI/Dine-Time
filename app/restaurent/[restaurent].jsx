/* eslint-disable no-unused-vars */
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Restaurant = () => {
  const { restaurent } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <Text>{restaurent}</Text>
    </SafeAreaView>
  );
};

export default Restaurant;

import { collection, doc, setDoc } from "firebase/firestore";
import { slots } from "../store/restaurants";
import { db } from "./firebaseConfig";

const restaurantData = slots;
const uploadData = async () => {
  try {
    for (let i = 0; i < restaurantData.length; i++) {
      const restaurants = restaurantData[i];
      const docref = doc(collection(db, "slots"), `slots_${i + 1}`);
      await setDoc(docref, restaurants);
    }
    console.log("Data Uploaded");
  } catch (e) {
    console.log("Error", e);
  }
};

export default uploadData;

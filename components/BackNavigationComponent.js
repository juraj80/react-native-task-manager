import { BackHandler, TouchableOpacity, View, Text } from "react-native";
// import Icons from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BackNavigationComponent = (props) => {
  const navigation = useNavigation();

  const handleBackButtonClick = () => {
    navigation.goBack(null);
    return true;
  };

  return (
    <View>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={handleBackButtonClick}
      >
        <Ionicons
          name="ios-chevron-back"
          size={30}
          color="#fff"
          style={{ marginLeft: "3%" }}
        />
        <Text style={{ fontSize: 20, color: "#fff" }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackNavigationComponent;

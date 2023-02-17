import { BackHandler, TouchableOpacity, View, Text } from "react-native";
// import Icons from "react-native-vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BackNavigationComponent = (props) => {
  try {
    const navigation = useNavigation();

    const handleBackButtonClick = () => {
      navigation.goBack(null);
      return true;
    };

    return (
      <View testID="back-navigation-view">
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={handleBackButtonClick}
          testID="back-navigation-button"
        >
          <Ionicons
            name="ios-chevron-back"
            size={30}
            color={props.color}
            style={{ marginLeft: "3%" }}
            testID="back-navigation-icon"
          />
          <Text
            style={{
              fontSize: 20,
              color: props.color,
              fontFamily: "Lato-Bold",
            }}
            testID="back-navigation-text"
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  } catch (error) {
    return (
      <View>
        <Text>An error occurred</Text>
      </View>
    );
  }
};

export default BackNavigationComponent;

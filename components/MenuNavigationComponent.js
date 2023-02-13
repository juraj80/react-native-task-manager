import { BackHandler, TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MenuNavigationComponent = (props) => {
  try {
    const navigation = useNavigation();

    const handleMenuButtonClick = () => {
      console.log("handleBackbutton clicked");
      navigation.toggleDrawer();
      return true;
    };

    return (
      <View>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={handleMenuButtonClick}
        >
          <Feather
            name="menu"
            size={30}
            color="#fff"
            // style={{ marginLeft: "3%" }}
          />
        </TouchableOpacity>
      </View>
    );
  } catch (error) {
    <View>
      <Text>An error occurred</Text>
    </View>;
  }
};

export default MenuNavigationComponent;

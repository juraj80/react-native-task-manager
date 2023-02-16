import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MyAppText = (props) => {
  return (
    <View>
      <Text style={{ fontFamily: "IndieFlower-Regular" }}>
        {props.children}
      </Text>
    </View>
  );
};

export default MyAppText;

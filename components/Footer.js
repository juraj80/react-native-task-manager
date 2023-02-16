import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";

import React, { useRef } from "react";

const Footer = (props) => {
  return (
    <View style={[styles.btnBackground, { backgroundColor: props.bgColor }]}>
      <TouchableOpacity
        style={[styles.plusBtn, { backgroundColor: props.btnColor }]}
        onPress={props.onPress}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnBackground: {
    width: 68,
    height: 68,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  plusBtn: {
    // backgroundColor: "#4682B4",
    width: 60,
    height: 60,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 30,
    color: "white",
  },
});

export default Footer;

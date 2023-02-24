import React from "react";
import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// const { width } = Dimensions.get("window");

const CustomWidthButton = ({ onPress, title, width }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={[styles.button, { width: width }]}
      >
        <Text style={styles.title}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#42a5f5",
    padding: 15,
    borderRadius: 5,
    // width: width - 40,
    marginHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CustomWidthButton;

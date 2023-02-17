import React from "react";
import { StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const FullWidthButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#42a5f5",
    padding: 10,
    borderRadius: 5,
    width: width - 40,
    marginHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default FullWidthButton;

import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";

import { Feather } from "@expo/vector-icons";

const CustomSearchBar = (props) => {
  return (
    <View style={styles.searchBar}>
      <Feather name="search" size={20} color="black" style={styles.iconStyle} />
      <TextInput
        style={styles.textStyle}
        placeholder="Search"
        onChangeText={props.onChangeText}
        value={props.value}
      />
    </View>
  );
};

export default CustomSearchBar;

const styles = StyleSheet.create({
  searchBar: {
    padding: 10,
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#d9dbda",
    borderRadius: 10,
    alignItems: "center",
  },
  iconStyle: {
    marginLeft: 1,
    marginRight: 4,
  },
  textStyle: {
    fontSize: 15,
  },
});

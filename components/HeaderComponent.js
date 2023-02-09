import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MenuNavigationComponent from "./MenuNavigationComponent";
import BackNavigationComponent from "./BackNavigationComponent";

export default function HeaderComponent(props) {
  let content;
  if (props.menu) {
    content = <MenuNavigationComponent />;
  } else if (props.back) {
    content = <BackNavigationComponent />;
  }
  return (
    <View style={styles.headerSection}>
      <View style={styles.backArrowComponent}>{content}</View>
      <Text style={styles.screenTitle}>{props.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  backArrowComponent: {
    position: "absolute",
    left: "0%",
    top: "8%",
  },
  screenTitle: {
    fontSize: 34,
    fontWeight: "bold",
    // color: "#4169E1",
    color: "white",
    fontFamily: "IndieFlower-Regular",
  },
});

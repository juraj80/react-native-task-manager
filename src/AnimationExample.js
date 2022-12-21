import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";

export function AnimationExample() {
  const opacityAnimation = useRef(new Animated.Value(0.5)).current;

  const opacityStyle = { opacity: opacityAnimation };

  const animateElement = () => {
    Animated.timing(opacityAnimation, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      console.log("OA", opacityAnimation);
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => animateElement()}>
        <Animated.View style={[styles.box, opacityStyle]}></Animated.View>
      </TouchableWithoutFeedback>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    backgroundColor: "orange",
    height: 200,
    width: 200,
    opacity: 0.5,
  },
});

export default AnimationExample;

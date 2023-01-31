import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Text,
} from "react-native";
// import AnimatedCheckbox from "react-native-checkbox-reanimated";

import React, { useRef, useState } from "react";

const TaskCompleted = (props) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {});
  };

  return (
    <View style={styles.itemRow}>
      <View style={styles.leftAlign}>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            props.showTaskDetail(props.item);
          }}
        >
          <Text
            style={[
              props.item.completed ? styles.checkedItem : "",
              styles.itemText,
            ]}
            numberOfLines={1}
          >
            {props.item.heading.length < 35
              ? `${props.item.heading}`
              : `${props.item.heading.substring(0, 32)}...`}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.rightAlign}>
        {props.item.marked && (
          <Pressable
            onPress={() => {
              props.deleteTask(props.item);
            }}
            style={styles.cancel}
          ></Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    // backgroundColor: "rgba(173, 216, 230, 0.5)",
    // backgroundColor: "#6495ED",
    backgroundColor: "#efeff0",
    // borderColor: "black",
    // borderWidth: 1,
    borderRadius: 5,
    opacity: 1,
  },
  leftAlign: {
    flexDirection: "row",
    // backgroundColor: "green",
    flex: 7,
    // alignItems: "flex-start",
    // justifyContent: "flex-start",
  },
  rightAlign: {
    flex: 1,
    // flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",
  },

  itemText: { color: "black" },
  dragItem: {
    padding: 5,
  },
  itemStyle: {
    padding: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
  cancel: {
    width: 20,
    height: 20,
    backgroundColor: "red",
  },
});

export default TaskCompleted;

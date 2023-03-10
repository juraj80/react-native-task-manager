import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Text,
} from "react-native";
// import AnimatedCheckbox from "react-native-checkbox-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
          <Text style={styles.itemText} numberOfLines={1}>
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
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="black"
            />
          </Pressable>
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
    backgroundColor: "#efeff0",
    borderRadius: 5,
    opacity: 1,
  },
  leftAlign: {
    flexDirection: "row",
    flex: 7,
  },
  rightAlign: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: { color: "black" },
  itemStyle: {
    padding: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  cancel: {
    padding: 5,
  },
});

export default TaskCompleted;

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";

import React, { useRef } from "react";

const Task = (props) => {
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
      <Pressable
        onPress={() => {
          fadeOut();

          props.handleChange(props.item.id);
        }}
        style={styles.checkbox}
      >
        <AnimatedCheckbox
          checked={props.item.completed}
          highlightColor="white"
          checkmarkColor="green"
          boxOutlineColor="black"
        />
      </Pressable>
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => {
          props.showTaskDetail(props.item);
        }}
        onLongPress={() => {
          props.setModalVisible(!props.modalVisible);
          props.setSelectedTask(props.item);
        }}
      >
        <Animated.Text
          style={[
            props.item.completed ? styles.checkedItem : "",
            styles.itemText,
          ]}
          numberOfLines={1}
        >
          {props.item.heading.length < 35
            ? `${props.item.heading}`
            : `${props.item.heading.substring(0, 32)}...`}
        </Animated.Text>
      </TouchableOpacity>
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
  itemText: { color: "black" },
  dragItem: {
    padding: 5,
  },
  itemStyle: {
    padding: 5,
    backgroundColor: "red",
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
});

export default Task;

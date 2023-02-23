import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Text,
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MyAppText from "../components/MyAppText";

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
      <View style={styles.leftAlign}>
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
          onLongPress={() => props.handleDelete(props.item.id)}
          // onLongPress={() => {
          //   props.setModalVisible(!props.modalVisible);
          //   props.setSelectedTask(props.item);
          // }}
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
              size={20}
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
    borderWidth: 1,
    borderColor: "#454545",
    opacity: 1,
  },
  itemText: { color: "black", fontSize: 17, fontFamily: "Lato-Light" },
  itemStyle: {
    padding: 5,
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
  cancel: {
    // width: 20,
    // height: 20,
    padding: 5,
  },
  rightAlign: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  leftAlign: {
    flexDirection: "row",
    flex: 7,
  },
});

export default Task;

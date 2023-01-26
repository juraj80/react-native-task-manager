import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  TextInput,
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";

import { firebase } from "../firebaseConfig";

import React, { useRef, useState } from "react";

const SubTask = (props) => {
  const [subTaskHeader, setSubTaskHeader] = useState(props.item.text);

  const subTasksRef = firebase.firestore().collection("tasks");

  //   database.collection('users').doc(uid).update({
  //     savedSearches: firebase.firestore.FieldValue.arrayUnion(data)
  // });

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {});
  };

  const addSubTask = async () => {
    console.log("addSubTask called ");

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      id: props.item.id,
      text: subTaskHeader,
      completed: props.item.completed,
    };

    console.log("UPDATE DATA", data);
    console.log("Subtask updated: ", data, " for taskId: ", props.taskId);

    subTasksRef
      .doc(props.taskId)
      .update({ subtasks: firebase.firestore.FieldValue.arrayUnion(data) })
      // .then(() => {
      //   //setNoteHeader("");
      //   // release Keyboard
      //   Keyboard.dismiss();
      // })
      .then(() => {
        console.log("Subtask updated: ", data, " for taskId: ", props.taskId);
      })
      .catch((error) => {
        alert(error);
      });
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
        {console.log(
          "Subtask item: ",
          props.item,
          "for taskId: ",
          props.taskId
        )}
        <AnimatedCheckbox
          checked={props.item.completed}
          highlightColor="#ffffff"
          checkmarkColor="#000000"
          boxOutlineColor="#000000"
        />
      </Pressable>
      {/* <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => {
          // props.showTaskDetail(props.item);
        }}
        onLongPress={() => {
          // props.setModalVisible(!props.modalVisible);
          // props.setSelectedTask(props.item);
        }}
      > */}
      {/* <Animated.Text
          style={[
            props.item.completed ? styles.checkedItem : "",
            styles.itemText,
          ]}
          numberOfLines={1}
        >
          {props.item.text.length < 35
            ? `${props.item.text}`
            : `${props.item.text.substring(0, 32)}...`}
        </Animated.Text> */}

      <TextInput
        value={subTaskHeader}
        onChangeText={setSubTaskHeader}
        returnKeyType={"next"}
        onSubmitEditing={() => addSubTask()}
        placeholder={subTaskHeader}
        placeholderTextColor="black"
        style={{ color: "black", fontSize: 20, marginLeft: 5 }}
        spellCheck={false}
        selectionColor="#000"
      />
      {/* </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "rgba(173, 216, 230, 0.5)",
    // backgroundColor: "#6495ED",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7,
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
});

export default SubTask;

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  TextInput,
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { firebase } from "../firebaseConfig";

import React, { useRef, useState } from "react";

const SubTask = (props) => {
  const [subTaskHeader, setSubTaskHeader] = useState(props.item.text);

  // const subTasksRef = firebase.firestore().collection("tasks");

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

  // callback that runs on the subtask textinput submit
  const addSubTask = async () => {
    if (subTaskHeader) {
      const updated_subtasks = props.allSubTasks.map((obj) => {
        if (obj.id == props.item.id) {
          obj.text = subTaskHeader;
        }
        return obj;
      });
      props.setAllSubTasks(updated_subtasks);
    }
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
          // defaultValue="Add Step"
          returnKeyType={"next"}
          onSubmitEditing={() => addSubTask()}
          placeholder={"Add Sub Task"}
          placeholderTextColor="lightgray"
          style={{ color: "black", fontSize: 20, marginLeft: 5 }}
          spellCheck={false}
          selectionColor="#000"
          autoFocus={true}
        />
      </View>

      {/* </TouchableOpacity> */}

      <View style={styles.rightAlign}>
        {props.item.marked && (
          <Pressable
            onPress={() => {
              props.deleteSubTask(props.item);
            }}
            // style={styles.cancel}
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
    padding: 10,
    backgroundColor: "#f3f1ef",
    borderColor: "#95a5a6",
    borderWidth: 1,
    borderRadius: 7,
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
  cancel: {
    width: 20,
    height: 20,
    backgroundColor: "red",
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
});

export default SubTask;

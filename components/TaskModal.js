import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width
// Start of MyModal component

// const MyModal = ({ item, setNote }) => {
const TaskModal = ({
  task,
  setTask,
  isVisible,
  setIsVisible,
  updateTask,
  saveTask,
  // createTask,
  deleteTask,
  showDatePicker,
  showDateTimePicker,
  showIntervalPicker,
}) => {
  const [textValue, setTextValue] = useState("");

  const onFormSubmitted = () => {
    const new_obj = { ...task, heading: textValue };
    setTask(new_obj);
  };

  const inputHandler = (enteredText) => {
    const new_obj = { ...task, heading: enteredText };
    setTask(new_obj);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        // setModalVisible(!modalVisible);
        setIsVisible(!isVisible);
      }}
    >
      <TouchableWithoutFeedback
        // onPress={() => setModalVisible(!modalVisible)}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        {/* <View style={styles.centeredView}> */}
        <View style={styles.modalView}>
          {/* <Text style={styles.modalText}> {selectedNote.heading}</Text> */}
          <View
            style={{
              borderBottomColor: "grey",
              borderBottomWidth: 1,
              alignSelf: "stretch",
            }}
          />
          <View style={styles.textInputSection}>
            <TextInput
              value={task.heading}
              onChangeText={(text) => {
                inputHandler(text);
              }}
              placeholder={"Add Task"}
              onEndEditing={() => onFormSubmitted()}
              style={{ color: "ccc", fontSize: 22 }}
              spellCheck={false}
              multiline={true}
              autofocus
              selectionColor="#aaa"
            />
          </View>
          <View
            style={{
              borderBottomColor: "grey",
              borderBottomWidth: 1,
              alignSelf: "stretch",
            }}
          />

          {/* <Pressable
                  style={[styles.buttonModal, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable> */}

          <View style={styles.modalBtnSection}>
            <Pressable
              // style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              style={styles.iconWrap}
              onPress={() => {
                showDatePicker();
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
              <MaterialCommunityIcons
                name="calendar-cursor"
                size={34}
                color="black"
              />
              <Text style={styles.textStyle}>Set Due Date</Text>
            </Pressable>
            <Pressable
              style={styles.iconWrap}
              // style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              onPress={() => {
                showDateTimePicker();
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
              <MaterialCommunityIcons name="reminder" size={34} color="black" />
              <Text style={styles.textStyle}>Reminder</Text>
            </Pressable>
            {/* {task.heading && (
              <Pressable
                style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
                onPress={() => {
                  deleteTask(task);
                  // setModalVisible(!modalVisible);
                  setIsVisible(!isVisible);
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            )} */}

            <Pressable
              // style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              style={styles.iconWrap}
              onPress={() => {
                showIntervalPicker();
                setIsVisible(!isVisible);
              }}
            >
              <MaterialCommunityIcons name="repeat" size={34} color="black" />
              <Text style={styles.textStyle}>Repeat</Text>
            </Pressable>
            <Pressable
              style={styles.iconWrap}
              onPress={() => {
                if (task.id) {
                  updateTask(task.heading);
                } else {
                  saveTask(task.heading);
                }
              }}
            >
              <Feather name="arrow-up-circle" size={34} color="black" />
              <Text style={styles.textStyle}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// End of MyModal component

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 25,
    width: width,
    height: height / 3,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInputSection: {
    flex: 3,
  },
  modalBtnSection: {
    flexDirection: "row",
    paddingVertical: 10,
    // justifyContent: "space-between",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textStyle: {
    color: "black",
    // fontWeight: "bold",
    textAlign: "center",
  },
  buttonModal: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 10,
    width: width / 4.8,
    // backgroundColor: "rgb(102, 204, 153)",
    borderWidth: 1,
    opacity: 0.7,
  },
  iconWrap: {
    flex: 1,
    backgroundColor: "lightgrey",
    margin: 3,
    alignItems: "center",
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
export default TaskModal;

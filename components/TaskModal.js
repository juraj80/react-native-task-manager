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
}) => {
  const [textValue, setTextValue] = useState("");

  const onFormSubmitted = () => {
    console.log("onFormSubmitted called", textValue);
    const new_obj = { ...task, heading: textValue };
    setTask(new_obj);
  };

  //   useEffect(() => {
  //     setTextValue(note.heading);
  //   }, []);

  const inputHandler = (enteredText) => {
    console.log(enteredText);
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
              style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              onPress={() => {
                showDatePicker();
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
              <Text style={styles.textStyle}>Set Due Date</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              onPress={() => {
                showDateTimePicker();
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
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
              style={[styles.buttonModal, styles.buttonClose, styles.shadow]}
              onPress={() => {
                console.log(task.heading);
                if (task.id) {
                  updateTask(task.heading);
                } else {
                  console.log("Need to create new TASK");
                  saveTask(task.heading);
                }
              }}
            >
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
  container: {
    flex: 1,
    backgroundColor: "#4682B4",
    opacity: 0.8,
  },
  headerSection: {
    flex: 1,
    alignItems: "left",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  screenWrapper: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // flexDirection: "column",
  },
  mainSection: {
    flex: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  bottomRow: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 70,
    zIndex: -99,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "lightgrey",
  },
  item: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 6,
    borderRadius: 15,
  },
  title: {
    fontSize: 12,
  },
  btnWhiteBackground: {
    backgroundColor: "red",
    width: 63,
    height: 63,
    borderRadius: 45,

    justifyContent: "center",
    alignItems: "center",
  },
  btnGreyBackground: {
    position: "absolute",
    right: -15,
    backgroundColor: "lightgrey",
    width: 75,
    height: 75,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  plusBtn: {
    backgroundColor: "rgba(173, 173, 173, 0.9)",
    width: 60,
    height: 60,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 30,
    color: "white",
  },
  itemStyle: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
  },
  itemText: {
    marginLeft: 5,
    color: "white",
    fontSize: 15,
  },
  centeredView: {
    // flex: 1,
    position: "absolute",
    bottom: 0,
    // alignSelf: "stretch",
    // width: width,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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

  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    borderColor: "black",
    // borderWidth: 1,
  },
});
export default TaskModal;

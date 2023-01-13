import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width
// Start of MyModal component

// const MyModal = ({ item, setNote }) => {
const TaskModal = ({
  note,
  setNote,
  isVisible,
  setIsVisible,
  updateNote,
  saveNote,
}) => {
  const [textValue, setTextValue] = useState("");

  const onFormSubmitted = () => {
    console.log("onFormSubmitted called");
    const new_obj = { ...selectedNote, heading: textValue };
    setNote(new_obj);
  };

  //   useEffect(() => {
  //     setTextValue(note.heading);
  //   }, []);

  const inputHandler = (enteredText) => {
    console.log(enteredText);
    const new_obj = { ...note, heading: enteredText };
    setNote(new_obj);
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
      {console.log("received props NOTE", note)}
      {console.log("textValue", textValue)}

      <TouchableWithoutFeedback
        // onPress={() => setModalVisible(!modalVisible)}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.centeredView}>
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
              value={note.heading}
              onChangeText={(text) => {
                inputHandler(text);
              }}
              placeholder={"Add Note"}
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
              style={[styles.buttonModal, styles.buttonClose]}
              onPress={() => {
                createTask(note);
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
              <Text style={styles.textStyle}>Create Task</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, styles.buttonClose]}
              onPress={() => {
                deleteNote(note);
                // setModalVisible(!modalVisible);
                setIsVisible(!isVisible);
              }}
            >
              <Text style={styles.textStyle}>Delete</Text>
            </Pressable>
            <Pressable
              style={[styles.buttonModal, styles.buttonClose]}
              onPress={() => {
                console.log(note.heading);
                if (note.id) {
                  updateNote(note.heading);
                } else {
                  console.log("Need to create new Note");
                  saveNote(note.heading);
                }
              }}
            >
              <Text style={styles.textStyle}>Update</Text>
            </Pressable>
          </View>
        </View>
      </View>
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
    alignItems: "center",
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
    backgroundColor: "white",
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
    alignItems: "center",
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
    flex: 1,
    flexDirection: "row",
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
    // color: "red",
    // fontWeight: "bold",
    textAlign: "center",
  },
  buttonModal: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    borderColor: "black",
    borderWidth: 1,
  },
});
export default TaskModal;

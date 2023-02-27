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
  Platform,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width
// Start of MyModal component

const NoteModal = ({
  note,
  setNote,
  isVisible,
  setIsVisible,
  updateNote,
  saveNote,
  createTask,
  deleteNote,
}) => {
  const [textValue, setTextValue] = useState("");

  const onFormSubmitted = () => {
    const new_obj = { ...selectedNote, heading: textValue };
    setNote(new_obj);
  };

  const inputHandler = (enteredText) => {
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
        setIsVisible(!isVisible);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(!isVisible)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
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

          <View style={styles.modalBtnSection}>
            <Pressable
              style={styles.iconWrap}
              onPress={() => {
                createTask(note);
                setIsVisible(!isVisible);
              }}
            >
              <MaterialIcons name="add-task" size={34} color="black" />

              <Text style={styles.textStyle}>Promote To Task</Text>
            </Pressable>
            {note.heading && (
              <Pressable
                style={styles.iconWrap}
                onPress={() => {
                  deleteNote(note);
                  setIsVisible(!isVisible);
                }}
              >
                <MaterialIcons name="delete-outline" size={34} color="black" />
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
            )}

            <Pressable
              style={styles.iconWrap}
              onPress={() => {
                if (note.id) {
                  updateNote(note.heading);
                } else {
                  saveNote(note.heading);
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
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  iconWrap: {
    flex: 1,
    backgroundColor: "lightgrey",
    margin: 3,
    alignItems: "center",
  },
});
export default NoteModal;

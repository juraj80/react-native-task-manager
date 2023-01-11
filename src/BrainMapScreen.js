import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/core";
import { getOuterBindingIdentifiers, isTemplateElement } from "@babel/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { firebase } from "../firebaseConfig";
import { setUserProperties } from "@firebase/analytics";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width

const BrainMapScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [selectedNote, setSelectedNote] = useState({});
  const [modalEntry, setModalEntry] = useState({});
  const [allNotes, setAllNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const notesRef = firebase.firestore().collection("notes");

  async function fetchData() {
    notesRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { heading, text, createdAt } = doc.data();
        users.push({
          id: doc.id,
          heading,
          text,
          createdAt,
        });
      });
      setAllNotes(users);
    });
  }

  const deleteNoteFromDB = async (id) => {
    notesRef
      .doc(id)
      .delete()
      // .then(() => {
      //   //setNoteHeader("");
      //   // release Keyboard
      //   Keyboard.dismiss();
      // })
      .then(() => {})
      .catch((error) => {
        alert(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const inputHandler = (enteredText) => {
    console.log(enteredText);
    console.log(selectedNote);
    const new_obj = { ...selectedNote, heading: enteredText };
    setSelectedNote(new_obj);
  };

  // const MyModal = ({ item, setNote }) => {
  const MyModal = () => {
    const [textValue, setTextValue] = useState(selectedNote.heading);

    const onFormSubmitted = () => {
      console.log("onFormSubmitted called");
      const new_obj = { ...selectedNote, heading: textValue };
      setSelectedNote(new_obj);
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(!modalVisible)}
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
                value={textValue}
                onChangeText={(text) => {
                  setTextValue(text);
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
                  createTask(selectedNote);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Create Task</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => {
                  deleteNote(selectedNote);
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </Pressable>
              <Pressable
                style={[styles.buttonModal, styles.buttonClose]}
                onPress={() => {
                  updateNote(textValue);
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

  const renderNote = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => createNote(item)}
        // onLongPress={() => createTask(item)}
        onLongPress={() => {
          setModalVisible(!modalVisible);
          setSelectedNote(item);
        }}
      >
        {/* <MaterialCommunityIcons name="note-outline" size={18} color="black" /> */}

        <Text numberOfLines={1} style={styles.itemText}>
          {item.heading}
        </Text>
        {/* <Text>{item.text}</Text> */}
      </TouchableOpacity>
    );
  };

  const createTask = (item) => {
    navigation.navigate("Create Task", item.heading);
  };

  const updateNote = (text) => {
    console.log("updateNote called with " + text);
    const new_obj = { ...selectedNote, heading: text };
    setSelectedNote(new_obj);
    console.log("befor update", allNotes);

    const updated_notes = allNotes.map((note) => {
      if (note.id == selectedNote.id) {
        return { note, heading: text };
      }
      return note;
    });
    console.log("update", updated_notes);
    setAllNotes(updated_notes);

    setModalVisible(!modalVisible);
  };

  const deleteNote = (item) => {
    console.log(item.id);
    filtered = allNotes.filter((note) => note.id != item.id);
    setAllNotes(filtered);
    deleteNoteFromDB(item.id);
  };

  const createNote = (item) => {
    navigation.navigate("Note Detail", item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Notes</Text>
        </View>
        <View style={styles.mainSection}>
          <FlatList
            style={{ height: "100%" }}
            data={allNotes}
            numColumns={1}
            renderItem={renderNote}
          ></FlatList>
        </View>
        {/* <MyModal item={selectedNote} setNote={setSelectedNote} /> */}
        <MyModal />

        <View style={styles.bottomSection}>
          <View style={styles.btnGreyBackground}>
            <View style={styles.btnWhiteBackground}>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => navigation.navigate("Create Note")}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}></View>
    </View>
  );
};

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
export default BrainMapScreen;

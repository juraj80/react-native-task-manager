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
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import NoteModal from "../components/NoteModal";
import Footer from "../components/Footer";
// import MyModal from "../components/MyModal";
import { useFocusEffect } from "@react-navigation/core";
import { getOuterBindingIdentifiers, isTemplateElement } from "@babel/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { firebase } from "../firebaseConfig";

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
    // console.log(enteredText);
    // console.log(selectedNote);
    const new_obj = { ...selectedNote, heading: enteredText };
    setSelectedNote(new_obj);
  };

  const renderNote = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => showNoteDetail(item)}
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
    navigation.navigate("My Actions", { heading: item.heading });
  };

  const updateNote = (text) => {
    const new_obj = { ...selectedNote, heading: text };
    setSelectedNote(new_obj);
    // console.log("befor update: ", allNotes);

    const updated_notes = allNotes.map((note) => {
      if (note.id == selectedNote.id) {
        return { note, heading: text };
      }
      return note;
    });
    // console.log("updated notes: ", updated_notes);
    setAllNotes(updated_notes);

    setModalVisible(!modalVisible);
  };

  const saveNote = async (text) => {
    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: text,
      createdAt: timestamp,
    };
    notesRef
      .add(data)
      .then(() => {
        setSelectedNote({});
        // release Keyboard
        //Keyboard.dismiss();
      })
      .then(() => {
        setModalVisible(!modalVisible);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const deleteNote = (item) => {
    // console.log(item.id);
    let filtered = allNotes.filter((note) => note.id != item.id);
    setAllNotes(filtered);
    deleteNoteFromDB(item.id);
  };

  const showNoteDetail = (item) => {
    navigation.navigate("Note Detail", item);
  };

  // creates a new Note on the plus button press
  const createNote = () => {
    setSelectedNote({});
    setModalVisible(!modalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>My Scribbles</Text>
        </View>
        <View style={styles.mainSection}>
          <FlatList
            style={{ height: "100%" }}
            data={allNotes}
            numColumns={1}
            renderItem={renderNote}
          ></FlatList>
        </View>

        <NoteModal
          note={selectedNote}
          setNote={setSelectedNote}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          updateNote={updateNote}
          saveNote={saveNote}
          createTask={createTask}
          deleteNote={deleteNote}
        />

        <View style={styles.bottomSection}>
          {/* <View style={styles.btnGreyBackground}>
            <View style={styles.btnWhiteBackground}>
              <TouchableOpacity
                style={styles.plusBtn}
                // onPress={() => navigation.navigate("Create Note")}
                onPress={() => createNote()}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          <Footer onPress={createNote} bgColor={"#4682B4"} />
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
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    fontFamily: "IndieFlower-Regular",
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
    alignItems: "center",
    // backgroundColor: "red",
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
  // buttonModal: {
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   elevation: 2,
  //   marginHorizontal: 20,
  //   marginTop: 10,
  // },

  buttonModal: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 10,
    width: width / 4.8,
    backgroundColor: "rgb(102, 204, 153)",
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

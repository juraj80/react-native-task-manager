import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import NoteModal from "../components/NoteModal";
import Footer from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";

import { firebase } from "../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";
import CustomSearchBar from "../components/CustomSearchBar";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width

console.disableYellowBox = true;

const BrainMapScreen = ({ navigation }) => {
  const [selectedNote, setSelectedNote] = useState({});
  const [allNotes, setAllNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredNotes, setFilteredNotes] = useState([]);

  const notesRef = firebase.firestore().collection("notes");

  async function fetchData() {
    notesRef.onSnapshot((querySnapshot) => {
      const notes = [];
      querySnapshot.forEach((doc) => {
        const { heading, text, createdAt } = doc.data();
        notes.push({
          id: doc.id,
          heading,
          text,
          createdAt,
        });
      });
      setAllNotes(notes);
      setFilteredNotes(notes);
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

        <Text style={styles.itemText}>{item.heading}</Text>
        {/* <Text>{item.text}</Text> */}
      </TouchableOpacity>
    );
  };

  const showSearchBar = () => {
    setSearchBarVisibility(!searchBarVisibility);
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
    navigation.navigate("Scribble Detail", item);
  };

  // creates a new Note on the plus button press
  const createNote = () => {
    setSelectedNote({});
    setModalVisible(!modalVisible);
  };

  const searchFunction = (text) => {
    if (text) {
      const updatedData = allNotes.filter((item) => {
        const itemData = item.heading.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredNotes(updatedData);
      setSearchValue(text);
    } else {
      setFilteredNotes(allNotes);
      setSearchValue(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        {!searchBarVisibility ? (
          <>
            <HeaderComponent
              title={"My Scribbles"}
              menu={true}
              color={"#000"}
            />
            <TouchableOpacity
              onPress={showSearchBar}
              style={styles.searchBarStyle}
            >
              <Ionicons name="search-outline" size={32} color="black" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.searchBarSection}>
              <CustomSearchBar
                onChangeText={(text) => searchFunction(text)}
                value={searchValue}
                color={"white"}
              ></CustomSearchBar>
            </View>
            <TouchableOpacity
              onPress={showSearchBar}
              style={styles.searchBarStyle}
            >
              <Ionicons name="arrow-back-outline" size={32} color="black" />
            </TouchableOpacity>
          </>
        )}
        <View style={styles.mainSection}>
          <FlatList
            style={{ height: "100%" }}
            data={filteredNotes}
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
          <Footer
            onPress={createNote}
            bgColor={"lightgrey"}
            btnColor={"#4682B4"}
          />
        </View>
      </View>

      <View style={styles.bottomRow}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#4682B4",
    backgroundColor: "lightgrey",
    opacity: 0.8,
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 10,
    // flexDirection: "column",
  },
  mainSection: {
    flex: 5,
  },

  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomRow: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 70,
    zIndex: -99,
    backgroundColor: "#4682B4",
  },
  plusText: {
    fontSize: 30,
    color: "white",
  },
  itemStyle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderColor: "black",
    borderRadius: 10,
  },
  itemText: {
    marginLeft: 5,
    color: "#000",
    fontSize: 17,
    fontFamily: "Lato-Light",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  searchBarSection: { marginTop: 70, marginBottom: 30 },
  searchBarStyle: {
    position: "absolute",
    top: 70,
    right: 20,
  },
});
export default BrainMapScreen;

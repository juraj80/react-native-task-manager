import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Platform,
  Button,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";

const NoteDetail = ({ route, navigation }) => {
  const [noteId, setNoteId] = useState(route.params.id);
  const [noteHeader, setNoteHeader] = useState(route.params.heading);
  const [noteDetail, setNoteDetail] = useState(route.params.text || null);

  const notesRef = firebase.firestore().collection("notes");

  const updateNote = async () => {
    console.log("updateNote called");
    if (noteHeader && noteHeader.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: noteHeader,
        detail: noteDetail,
        createdAt: timestamp,
      };
      console.log(data);
      notesRef
        .doc(noteId)
        .update(data)
        // .then(() => {
        //   //setNoteHeader("");
        //   // release Keyboard
        //   Keyboard.dismiss();
        // })
        .then(() => {
          navigation.navigate("Notes");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  // const renderTask = ({ item }) => (
  //   <TouchableOpacity style={styles.itemStyle}>
  //     <Text>{item.heading}</Text>
  //     <Text>{item.text}</Text>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <TextInput
          value={noteHeader}
          onChangeText={setNoteHeader}
          placeholder={noteHeader}
          placeholderTextColor="black"
          style={{ color: "ccc", fontSize: 22 }}
          spellCheck={false}
          multiline={true}
          autoFocus
          selectionColor="#000"
        />
        <TextInput
          value={noteDetail}
          onChangeText={setNoteDetail}
          placeholder={noteDetail}
          style={{ color: "ccc", fontSize: 22 }}
          spellCheck={false}
          multiline={true}
          autoFocus
          selectionColor="#000"
          style={styles.mainSection}
        />
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.plusBtn} onPress={() => updateNote()}>
            <Text style={styles.plusText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    // flexDirection: "column",
  },
  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  mainSection: {
    flex: 3,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

  plusBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 72,
    borderRadius: 4,
    elevation: 4,
    backgroundColor: "green",
  },
  plusText: {
    fontSize: 30,
    color: "white",
  },
  itemStyle: {
    padding: 5,
    backgroundColor: "yellow",
  },
});

export default NoteDetail;

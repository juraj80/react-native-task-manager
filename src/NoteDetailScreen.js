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
import FullWidthButton from "../components/FullWidthButton";

const NoteDetail = ({ route, navigation }) => {
  const [noteId, setNoteId] = useState(route.params.id);
  const [noteHeader, setNoteHeader] = useState(route.params.heading);
  const [noteDetail, setNoteDetail] = useState(route.params.text || null);

  const notesRef = firebase.firestore().collection("notes");

  const updateNote = async () => {
    if (noteHeader && noteHeader.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: noteHeader,
        detail: noteDetail,
        createdAt: timestamp,
      };
      notesRef
        .doc(noteId)
        .update(data)
        .then(() => {
          navigation.navigate("My Scribbles");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

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
          style={[styles.mainSection, { color: "ccc", fontSize: 22 }]}
          spellCheck={false}
          multiline={true}
          autoFocus
          selectionColor="#000"
        />
        <View style={styles.bottomSection}>
          <FullWidthButton title={"Save"} onPress={() => updateNote()} />
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
});

export default NoteDetail;

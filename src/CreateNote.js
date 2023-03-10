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

const CreateNote = ({ navigation }) => {
  const [note, setNote] = useState("");
  const notesRef = firebase.firestore().collection("notes");

  const saveNote = async () => {
    if (note && note.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: note,
        createdAt: timestamp,
      };
      notesRef
        .add(data)
        .then(() => {
          setNote("");
          // release Keyboard
          Keyboard.dismiss();
        })
        .then(() => {
          navigation.navigate("Notes");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={{ color: "ccc", fontSize: 22 }}
        spellCheck={false}
        multiline={true}
        autoFocus
        selectionColor="#aaa"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottom}
      >
        <Button
          style={styles.button}
          onPress={saveNote}
          color="#841584"
          title="Create Note"
          accessibilityLabel="Learn more about this purple button"
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 20,
    width: Dimensions.get("window").width,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  button: {
    marginBottom: 30,
  },
});
export default CreateNote;

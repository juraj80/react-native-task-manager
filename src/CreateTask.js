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

const CreateTask = ({ route, navigation }) => {
  const [taskHeader, setTaskHeader] = useState(route.params.taskDetails);
  const [taskDetail, setTaskDetail] = useState("");
  const tasksRef = firebase.firestore().collection("tasks");

  const saveTask = async () => {
    // if (taskHeader && taskHeader.length > 0) {
    console.log("f saveTask called");

    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: taskHeader,
      text: taskDetail,
      createdAt: timestamp,
    };

    tasksRef
      .add(data)
      .then(() => {
        setTaskHeader("");
        setTaskDetail("");
        // release Keyboard
        Keyboard.dismiss();
      })
      .then(() => {
        navigation.navigate("TaskList");
      })
      .catch((error) => {
        alert(error);
      });
    // }
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={taskHeader}
        onChangeText={setTaskHeader}
        placeholder={taskHeader}
        placeholderTextColor="black"
        style={{ color: "ccc", fontSize: 22 }}
        autoFocus
        selectionColor="#fff"
      />
      <TextInput
        value={taskDetail}
        onChangeText={setTaskDetail}
        placeholder="Add Details"
        style={{ color: "ccc", fontSize: 22 }}
        multiline={true}
        autoFocus
        selectionColor="#fff"
        style={styles.mainSection}
      />
      {/* <Text>TaskHeader: {JSON.stringify(taskDetails)}</Text> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottom}
      >
        <Button
          style={styles.button}
          onPress={saveTask}
          color="#841584"
          title="Create Task"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          style={styles.button}
          onPress={() => navigation.navigate("TaskList")}
          color="#841584"
          title="Back"
          accessibilityLabel="Learn more about this purple button"
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fcd",
    padding: 30,
    paddingTop: 20,
    width: Dimensions.get("window").width,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  headerSection: {
    flex: 1,
    backgroundColor: "yellow",
  },
  mainSection: {
    flex: 9,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 30,
  },
});
export default CreateTask;

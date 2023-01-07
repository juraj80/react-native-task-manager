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
  LogBox,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const TaskDetail = ({ route, navigation }) => {
  const [task, setTask] = useState("");
  const [taskId, setTaskId] = useState(route.params.id);
  const [taskHeader, setTaskHeader] = useState(route.params.heading);
  const [taskText, setTaskText] = useState(route.params.text);

  const tasksRef = firebase.firestore().collection("tasks");

  // async function fetchData() {
  //   tasksRef.onSnapshot((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       const { heading, text } = doc.data();
  //       // console.log({
  //       //   id: doc.id,
  //       //   heading,
  //       //   text,
  //       // });
  //     });
  //     //   setTask();
  //   });
  // }

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const updateTask = async () => {
    console.log("updateTask called");
    if (taskHeader && taskHeader.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: taskHeader,
        text: taskText,
        updatedAt: timestamp,
      };
      console.log(data);
      tasksRef
        .doc(taskId)
        .update(data)
        // .then(() => {
        //   //setNoteHeader("");
        //   // release Keyboard
        //   Keyboard.dismiss();
        // })
        .then(() => {
          navigation.navigate("Tasks");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity style={styles.itemStyle}>
      <Text>{item.heading}</Text>
      <Text>{item.text}</Text>
    </TouchableOpacity>
  );

  //   const createTask = (item) => {
  //     navigation.navigate("CreateTask", { taskDetails: "Add Header" });
  //   };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <TextInput
          value={taskHeader}
          onChangeText={setTaskHeader}
          placeholder={taskHeader}
          placeholderTextColor="black"
          style={{ color: "ccc", fontSize: 22 }}
          spellCheck={false}
          autoFocus
          selectionColor="#aaa"
        />
        <TextInput
          value={taskText}
          onChangeText={setTaskText}
          placeholder={taskText}
          style={{ color: "ccc", fontSize: 22 }}
          spellCheck={false}
          multiline={true}
          autoFocus
          selectionColor="#aaa"
          style={styles.mainSection}
        />
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.plusBtn} onPress={() => updateTask()}>
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
    paddingTop: 20,
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
  title: {
    fontSize: 12,
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

export default TaskDetail;

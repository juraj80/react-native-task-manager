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

const TaskDetail = ({ route, navigation }) => {
  const [task, setTask] = useState("");
  const [taskHeader, setTaskHeader] = useState(route.params.heading);
  const [taskDetail, setTaskDetail] = useState(route.params.text);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const { heading, text } = doc.data();
        // console.log({
        //   id: doc.id,
        //   heading,
        //   text,
        // });
      });
      //   setTask();
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

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
        placeholder={taskDetail}
        style={{ color: "ccc", fontSize: 22 }}
        multiline={true}
        autoFocus
        selectionColor="#fff"
        style={styles.mainSection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
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
    backgroundColor: "green",
    width: 80,
    height: 80,

    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
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

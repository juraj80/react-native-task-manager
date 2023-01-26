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

import { v4 as uuid } from "uuid";

import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";
import SubTask from "../components/SubTask";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const TaskDetail = ({ route, navigation }) => {
  let subTasksArr = [
    { id: "1", completed: false, text: "Subtask text1" },
    { id: "2", completed: false, text: "Subtask text2" },
    { id: "3", completed: false, text: "Subtask text3" },
  ];

  const [task, setTask] = useState("");
  const [taskId, setTaskId] = useState(route.params.id);
  const [taskHeader, setTaskHeader] = useState(route.params.heading);
  const [taskText, setTaskText] = useState(route.params.text);

  const [subTaskText, setSubTaskText] = useState("");
  const [allSubTasks, setAllSubTasks] = useState([]);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef
      .doc(taskId)
      .get()
      .then((querySnapshot) => {
        const subTasks = querySnapshot.data().subtasks;
        // querySnapshot.forEach((doc) => {
        //   console.log("FETCHED SUBTASK ARRAY", doc.data());
        //   const { text, completed } = doc.data();
        //   // console.log({
        //   //   id: doc.id,
        //   //   heading,
        //   //   text,
        //   // });
        // });
        if (subTasks) {
          setAllSubTasks(subTasks);
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const updateTask = async () => {
    console.log("updateTask called");
    if (taskHeader && taskHeader.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: taskHeader,
        text: taskText,
        updatedAt: timestamp,
        subtasks: subTasksArr,
      };
      console.log("UPDATED DATA: ", data);
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

  const renderSubTask = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={styles.dragItem}
      >
        <SubTask
          item={item}
          taskId={taskId}
          subTaskText={subTaskText}
          setSubTaskText={setSubTaskText}
          handleChange={handleChange}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  const createSubTask = () => {
    console.log("Create SubTask pressed!");
    setAllSubTasks([
      ...allSubTasks,
      { id: getId(), completed: false, text: subTaskText },
    ]);
    setSubTaskText("");
  };

  const getId = () => {
    return uuid();
  };

  // handler for completed subtasks
  const handleChange = (id) => {
    let temp = allSubTasks.map((item) => {
      if (id === item.id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setAllSubTasks(temp);

    const completed = temp.filter((el) => el.completed);

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllSubTasks(temp);
      // console.log("timelineData", timelineData);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <View style={styles.headerSection}>
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
        </View>
        <View style={styles.subTasksSection}>
          <DraggableFlatList
            // style={{ height: "90%", flexGrow: 0 }}
            data={allSubTasks}
            onDragEnd={({ data }) => setAllSubTasks(data)}
            keyExtractor={(subtask, index) => {
              return subtask.id, index.toString();
            }}
            renderItem={renderSubTask}
          ></DraggableFlatList>
        </View>
        <View style={styles.addSubTaskSection}>
          <TouchableOpacity onPress={createSubTask}>
            <Text style={styles.addSubTaskBtn}>+ Add SubTask</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calendarSection}></View>
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
    // backgroundColor: "red",
    // flexDirection: "column",
  },
  headerSection: {
    flex: 1,
    // alignItems: "center",
  },
  mainSection: {
    flex: 1,
  },

  subTasksSection: {
    flex: 0,
    backgroundColor: "yellow",
  },
  calendarSection: {
    flex: 3,
    backgroundColor: "blue",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
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
  dragItem: {
    padding: 5,
  },
  addSubTaskSection: {
    flex: 0.3,
    backgroundColor: "pink",
    padding: 2,
    margin: 5,
    justifyContent: "center",
    // backgroundColor: "rgba(173, 216, 230, 0.5)",
    // backgroundColor: "#6495ED",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7,
  },
  addSubTaskBtn: { color: "black", fontSize: 20, marginLeft: 5 },
});

export default TaskDetail;

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import TaskCompleted from "../components/TaskCompleted";
import Task from "../components/Task";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";

// import AnimatedCheckbox from "react-native-checkbox-reanimated";

const DayDetail = ({ route, navigation, props }) => {
  // const taskHeading = route.params.heading;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const tasksRef = firebase.firestore().collection("tasks");

  const day = route.params?.toISOString().split("T")[0];

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const { heading, text, completed, subtasks, repeat, tasklist } =
          doc.data();
        const dueDate = doc.data().dueDateAt?.toDate();
        const reminderAt = doc.data().reminderAt?.toDate();

        if (dueDate && dueDate.toISOString().split("T")[0] == day) {
          tasks.push({
            id: doc.id,
            heading,
            text,
            completed,
            dueDateAt: dueDate,
            reminderAt: reminderAt,
            repeat,
            tasklist,
            subtasks,
            marked: false,
          });
        }
      });
      setAllTasks(tasks);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [allTasks]);

  const deleteTaskFromDB = async (id) => {
    tasksRef
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert("Task Message", "Task was deleted", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      })
      .then(() => {})
      .catch((error) => {
        alert(error);
      });
  };

  // handler for completed tasks
  const handleChange = (id) => {
    let temp = allTasks.map((item) => {
      if (id === item.id) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setAllTasks(temp);

    const completed = temp.filter((el) => el.completed);
    const date = completed[0].dueDateAt?.getDate();

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllTasks(temp);
    }, 2000);
  };

  // callback that is passed to the flatlist component that renders the task item
  const renderTask = ({ item, drag, isActive }) => (
    <>
      <TouchableOpacity
        onLongPress={() => handleDelete(item.id)}
        style={styles.dragItem}
      >
        <Task
          item={item}
          showTaskDetail={showTaskDetail}
          deleteTask={deleteTask}
          handleChange={handleChange}
        />
      </TouchableOpacity>
    </>
  );

  const deleteTask = (item) => {
    let filtered = allTasks.filter((task) => task.id != item.id);
    setAllTasks(filtered);
    deleteTaskFromDB(item.id);
  };

  const showTaskDetail = (item) => {
    navigation.navigate("Task Detail", item);
  };

  const handleDelete = (id) => {
    let temp = allTasks.map((item) => {
      if (id === item.id) {
        return { ...item, marked: !item.marked };
      }
      return item;
    });
    setAllTasks(temp);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <HeaderComponent title={"Tasks"} back={true} />
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>{day}</Text>
        </View>
        <View style={styles.mainSection}>
          <FlatList
            style={{ height: "100%" }}
            data={allTasks}
            renderItem={renderTask}
          ></FlatList>
        </View>
      </View>

      {/* <View style={styles.bottomRow}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(50, 24, 3,0.3)",
  },

  screenWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  subHeader: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
  },
  subHeaderText: {
    color: "black",
    fontSize: 20,
    fontFamily: "Lato-Regular",
  },

  dragItem: {
    padding: 5,
  },

  mainSection: {
    flex: 15,
    paddingVertical: 20,
  },
});

export default DayDetail;

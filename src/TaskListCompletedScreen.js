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

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";

const TaskListCompleted = ({ route, navigation }) => {
  try {
    const taskHeading = route.params.heading;
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allTasks, setAllTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const tasksRef = firebase.firestore().collection("tasks");

    async function fetchData() {
      // console.log("TaskList fetchData called");

      tasksRef.onSnapshot((querySnapshot) => {
        const tasks = [];
        const data = {};
        querySnapshot.forEach((doc) => {
          const { heading, text, completed, subtasks } = doc.data();
          const dueDate = doc.data().dueDateAt.toDate();
          const reminderAt = doc.data().reminderAt.toDate();

          if (completed) {
            tasks.push({
              id: doc.id,
              heading,
              text,
              completed,
              dueDateAt: dueDate,
              reminderAt: reminderAt,
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
      const date = completed[0].dueDateAt.getDate();

      // console.log("timeTemp", timelineDataTemp);

      const timeout = setTimeout(() => {
        temp = temp.filter((el) => !el.completed);
        setAllTasks(temp);
        // console.log("timelineData", timelineData);
      }, 2000);
    };

    // callback that is passed to the flatlist component that renders the task item
    const renderTask = ({ item, drag, isActive }) => (
      <>
        <TouchableOpacity
          onLongPress={() => handleDelete(item.id)}
          // disabled={isActive}
          style={styles.dragItem}
        >
          <TaskCompleted
            item={item}
            showTaskDetail={showTaskDetail}
            deleteTask={deleteTask}
          />
        </TouchableOpacity>
      </>
    );

    const deleteTask = (item) => {
      console.log("Delete Task func called", item.id);
      let filtered = allTasks.filter((task) => task.id != item.id);
      setAllTasks(filtered);
      deleteTaskFromDB(item.id);
    };

    const showTaskDetail = (item) => {
      console.log("item", item);
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
          <HeaderComponent title={"Finished To-Dos"} menu={true} />
          <View style={styles.mainSection}>
            <FlatList
              style={{ height: "100%" }}
              data={allTasks}
              renderItem={renderTask}
            ></FlatList>
          </View>
        </View>

        <View style={styles.bottomRow}></View>
      </View>
    );
  } catch (error) {
    return (
      <View>
        <Text>An error occurred</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(102, 204, 153,1)",
  },

  screenWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  dragItem: {
    padding: 5,
  },

  mainSection: {
    flex: 9,
    padding: 0,
  },

  bottomRow: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 70,
    zIndex: -99,
    backgroundColor: "lightgrey",
  },
});

export default TaskListCompleted;

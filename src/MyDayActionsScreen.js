import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import TaskCompleted from "../components/TaskCompleted";

import Task from "../components/Task";

import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";

import { formatUTCDate } from "./helpers/helpers";

// import AnimatedCheckbox from "react-native-checkbox-reanimated";

// const image = { uri: "https://reactjs.org/logo-og.png" };

const image = require("../assets/background.png");

const MyDayActions = ({ route, navigation, props }) => {
  const taskHeading = route.params.heading;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeTasks, setCompleteTasks] = useState([]);

  const today = formatUTCDate(new Date());

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const {
          id,
          heading,
          text,
          completed,
          subtasks,
          repeat,
          tasklist,
          attachments,
        } = doc.data();
        const dueDate = doc.data().dueDateAt?.toDate();
        const reminderAt = doc.data().reminderAt?.toDate();
        if (tasklist == 1 && !completed) {
          tasks.push({
            id,
            heading,
            text,
            completed,
            dueDateAt: dueDate,
            repeat,
            tasklist,
            reminderAt: reminderAt,
            subtasks,
            attachments,
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

  // may cause issues with re-rendering of component
  useEffect(() => {
    updateCompletedInDB(completeTasks);
  }, [completeTasks]);

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

  const updateCompletedInDB = (tasks) => {
    tasks.forEach((item) => {
      if (item.completed) {
        updateTaskDB(item);
      }
    });
  };

  const updateTaskDB = async (task) => {
    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    // update the task in DB based on the id field
    tasksRef
      .where("id", "==", task.id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.update(task); //not doc.update({foo: "bar"})
        });
      })
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
    setCompleteTasks(completed);

    const date = completed[0].dueDateAt?.getDate();

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllTasks(temp);
    }, 1000);
  };

  const renderTask = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={styles.dragItem}
    >
      <Task
        item={item}
        showTaskDetail={showTaskDetail}
        handleDelete={handleDelete}
        deleteTask={deleteTask}
        handleChange={handleChange}
      />
    </TouchableOpacity>
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
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.screenWrapper}>
          <HeaderComponent title={"My Day"} menu={true} color={"#454545"} />
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>{today}</Text>
          </View>
          <View style={styles.mainSection}>
            <FlatList
              style={{ height: "100%" }}
              data={allTasks}
              renderItem={renderTask}
            ></FlatList>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(102, 104, 3,1)",
  },
  image: {
    flex: 1,
    width: "100%",
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
    color: "#454545",
    fontSize: 20,
  },

  dragItem: {
    padding: 5,
  },

  mainSection: {
    flex: 15,
    paddingTop: 50,
  },
});

export default MyDayActions;

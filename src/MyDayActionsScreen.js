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

import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";

// import AnimatedCheckbox from "react-native-checkbox-reanimated";

const MyDayActions = ({ route, navigation, props }) => {
  const taskHeading = route.params.heading;
  const today = new Date().toISOString().split("T")[0];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allTasks, setAllTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [completeTasks, setCompleteTasks] = useState([]);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    // console.log("TaskList fetchData called");

    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const { id, heading, text, completed, subtasks, repeat, tasklist } =
          doc.data();
        const dueDate = doc.data().dueDateAt.toDate();
        const reminderAt = doc.data().reminderAt.toDate();
        console.log("Tasklist: ", tasklist);
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
    console.log("useEffect -> completeTask has been updated to DB");
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
    console.log("updateInDB called with task", task);
    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    // update the task in DB based on the id field
    tasksRef
      .where("id", "==", task.id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          // console.log(doc.id, " => ", doc.data());
          doc.ref.update(task); //not doc.update({foo: "bar"})
        });
      })
      .then(() => {
        console.log("Task: ", task, " was succesfully updated in the DB");
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

    const date = completed[0].dueDateAt.getDate();

    // console.log("timeTemp", timelineDataTemp);

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllTasks(temp);
      // console.log("timelineData", timelineData);
    }, 1000);
  };

  // callback that is passed to the flatlist component that renders the task item
  // const renderTask = ({ item, drag, isActive }) => (
  //   <>
  //     <TouchableOpacity
  //       onLongPress={() => handleDelete(item.id)}
  //       // disabled={isActive}
  //       style={styles.dragItem}
  //     >
  //       <TaskCompleted
  //         item={item}
  //         showTaskDetail={showTaskDetail}
  //         deleteTask={deleteTask}
  //       />
  //     </TouchableOpacity>
  //   </>
  // );

  const renderTask = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      disabled={isActive}
      style={styles.dragItem}
    >
      <Task
        item={item}
        showTaskDetail={showTaskDetail}
        // setModalVisible={setModalVisible}
        // modalVisible={modalVisible}
        // setSelectedTask={setSelectedTask}
        handleDelete={handleDelete}
        deleteTask={deleteTask}
        handleChange={handleChange}
      />
    </TouchableOpacity>
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
        <HeaderComponent title={"My Day"} menu={true} color={"#fff"} />
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
      {console.log("complete tasks", completeTasks)}
      {/* <View style={styles.bottomRow}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(102, 104, 3,1)",
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
    color: "white",
    fontSize: 20,
  },

  dragItem: {
    padding: 5,
  },

  mainSection: {
    flex: 15,
    padding: 0,
  },

  // bottomRow: {
  //   position: "absolute",
  //   width: "100%",
  //   bottom: 0,
  //   height: 70,
  //   zIndex: -99,
  //   backgroundColor: "lightgrey",
  // },
});

export default MyDayActions;

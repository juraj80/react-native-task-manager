import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
  Alert,
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect } from "@react-navigation/native";

// import { HorizontalTimeline } from "react-native-horizontal-timeline";
import HorizontalTimeline from "../components/CustomTimeline";
import TaskModal from "../components/TaskModal";
import TaskCompleted from "../components/TaskCompleted";
import Footer from "../components/Footer";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";

const TaskListCompleted = ({ route, navigation }) => {
  const taskHeading = route.params.heading;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [noteTask, setNoteTask] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  // const [timelineData, setTimelineData] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDueDate, setTaskDueDate] = useState(new Date(1900, 1, 1));
  const [taskReminderDate, setTaskReminderDate] = useState(
    new Date(1900, 1, 1)
  );

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    console.log("TaskList fetchData called");

    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const { heading, text, completed, subtasks } = doc.data();
        const dueDate = doc.data().dueDateAt.toDate();
        const reminderAt = doc.data().reminderAt.toDate();
        const date = dueDate.getDate();

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

        // Object.assign(data, {
        //   [date]: { id: doc.id, marked: true, info: heading },
        // });
      });

      // console.log("setAllTasks called ", tasks);
      setAllTasks(tasks);
      // setTimelineData(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // console.log("useEffect -> allTask has been updated to: ", allTasks);
  }, [allTasks]);

  useEffect(() => {
    isDueToday();
  });

  // set timer to check each task reminder date every second
  useEffect(() => {
    let secTimer = setInterval(() => {
      sendReminderNotification();
    }, 60000);
    return () => clearInterval(secTimer);
  });

  const sendReminderNotification = () => {
    let currentDateTime = new Date().toISOString().slice(0, 16);
    // console.log("displaying now", currentDateTime);

    // console.log("displaying allTasks from sendReminderNotif ", allTasks);
    allTasks.forEach((obj) => {
      if (
        obj.reminderAt instanceof Date &&
        obj.reminderAt.toISOString().slice(0, 16) === currentDateTime
      ) {
        console.log(
          "Alert For reminder: ",
          obj.reminderAt.toISOString(),
          " from object: ",
          obj
        );
      }
    });
  };

  // check if any of the stored task is due today
  const isDueToday = () => {
    let today = currentDate.toISOString().split("T")[0];
    allTasks.forEach((obj) => {
      if (
        obj.dueDateAt instanceof Date &&
        obj.dueDateAt.toISOString().split("T")[0] === today
      ) {
        console.log("Alert For this day: ", today, "from object: ", obj);
        Alert.alert("Reminder", "Task: " + obj.heading + "is due today");
        // TODO: Need to send notificiations to the user with the message
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      // console.log("scrren is focused" + JSON.stringify(taskHeading));
      if (taskHeading) {
        setNoteTask(taskHeading);
        // console.log("selectedTask: ", selectedTask);
        setSelectedTask({ heading: taskHeading });
        setModalVisible(true);
        navigation.setParams({ heading: null });
      }
    }, [taskHeading])
  );

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
    // console.log("completed", completed[0].dueDateAt.getDate());
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
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          setSelectedTask={setSelectedTask}
          handleChange={handleChange}
          deleteTask={deleteTask}
          // handleDelete={handleDelete}
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
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Completed Tasks</Text>
        </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#66CC99",
    backgroundColor: "rgba(102, 204, 153,1)",
  },
  timeline: {
    // height: 70,
    flex: 1,
    marginBottom: 10,
    // backgroundColor: "lightgray",
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    // flexDirection: "column",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#4169E1",
    color: "white",
  },
  dragItem: {
    padding: 5,
  },

  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  mainSection: {
    flex: 9,
    padding: 0,
  },

  bottomRow: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 70,
    zIndex: -99,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#4169E1",
    backgroundColor: "lightgrey",

    // borderWidth: 1,
    // borderColor: "black",
  },

  bottomSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
});

export default TaskListCompleted;

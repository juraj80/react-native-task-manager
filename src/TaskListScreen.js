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

import { LinearGradient } from "react-native-svg";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFocusEffect } from "@react-navigation/native";

// import { HorizontalTimeline } from "react-native-horizontal-timeline";
import HorizontalTimeline from "../components/CustomTimeline";
import TaskModal from "../components/TaskModal";
import Task from "../components/Task";
import Footer from "../components/Footer";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import * as Notifications from "expo-notifications";

import { v4 as uuid } from "uuid";
import MenuNavigationComponent from "../components/MenuNavigationComponent";
import HeaderComponent from "../components/HeaderComponent";

const TaskList = ({ route, navigation }) => {
  try {
    const taskHeading = route.params.heading;
    const [currentDate, setCurrentDate] = useState(new Date());
    const today = new Date();
    const [noteTask, setNoteTask] = useState("");
    const [allTasks, setAllTasks] = useState([]);
    const [completeTasks, setCompleteTasks] = useState([]);
    const [timelineData, setTimelineData] = useState({});
    const [selectedTask, setSelectedTask] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [taskDueDate, setTaskDueDate] = useState(null);
    const [taskReminderDate, setTaskReminderDate] = useState(null);

    const [showAlert, setShowAlert] = useState(true);
    const [taskCompletionDate, setTaskCompletionDate] = useState(null);

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDateTimePickerVisible, setDateTimePickerVisibility] =
      useState(false);

    const tasksRef = firebase.firestore().collection("tasks");

    async function fetchData() {
      // console.log("TaskList fetchData called");

      tasksRef.onSnapshot((querySnapshot) => {
        const tasks = [];
        const completeTasks = [];
        const data = {};

        querySnapshot.forEach((doc) => {
          const { id, heading, text, completed, subtasks, repeat } = doc.data();
          const dueDate = doc.data().dueDateAt?.toDate();
          const reminderAt = doc.data().reminderAt?.toDate();
          const completedAt = doc.data().completedAt;

          const date = dueDate?.getDate();

          const task = {
            id: id, //doc.id
            heading,
            text,
            completed,
            completedAt: completedAt,
            dueDateAt: dueDate,
            repeat,
            reminderAt: reminderAt,
            subtasks,
          };

          completed ? completeTasks.push(task) : tasks.push(task);

          if (dueDate && isWithinCurrentMonth(dueDate)) {
            Object.assign(data, {
              [date]: {
                id: id,
                marked: !task.completed,
                info: heading,
                dueDate,
                completed,
                repeat,
              }, //doc.id
            });
          }
        });

        console.log("setAllTasks called ", tasks);
        setAllTasks(tasks);
        setCompleteTasks(completeTasks);
        setTimelineData(data);
      });
    }

    useEffect(() => {
      fetchData();
    }, []);

    const isWithinCurrentMonth = (date) => {
      if (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return true;
      } else {
        return false;
      }
    };

    // may cause issues with re-rendering of component
    useEffect(() => {
      updateCompletedInDB(completeTasks);
      // console.log("useEffect -> allTask has been updated to: ", allTasks);
    }, [completeTasks]);

    useEffect(() => {
      isDueToday();
    }, []);

    // set timer to check each task reminder date every second
    useEffect(() => {
      let secTimer = setInterval(() => {
        sendReminderNotification();
      }, 60000);
      return () => clearInterval(secTimer);
    });

    const updateCompletedInDB = (tasks) => {
      tasks.forEach((item) => {
        if (item.completed) {
          updateTaskDB(item);
        }
      });
    };

    const sendReminderNotification = () => {
      let currentDateTime = new Date().toISOString().slice(0, 16);

      // check each task if it has reminder set to current day
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
          Alert.alert(
            "Reminder",
            "Task: " + obj.heading + " is due today",
            [
              {
                text: "View",
                onPress: () => showTaskDetail(obj),
              },
              {
                text: "OK",
                onPress: () => console.log("Ok was pressed"),
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel was pressed"),
                style: "cancel",
              },
            ],
            {
              cancelable: true,
              onDismiss: () => {
                // Alert.alert(
                //   "This alert was dismissed by tapping outside of the alert dialog."
                // );
              },
            }
          );

          //notification message
          const message = {
            autoDismiss: false,
            color: "#AEDE2D",
            title: "Task Due! 📬",
            body: `The task: ${obj.heading} is due today! `,
            data: { data: "goes here" },
          };

          triggerNotifications(message);
          // TODO: Need to send notificiations to the user with the message
        }
      });
    };

    const triggerNotifications = async (message) => {
      await Notifications.scheduleNotificationAsync({
        content: message,
        trigger: { seconds: 1 },
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

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const showDateTimePicker = () => {
      setDateTimePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
      setTimeout(() => setModalVisible(!modalVisible), 1000);
    };

    const hideDateTimePicker = () => {
      setDateTimePickerVisibility(false);
      setTimeout(() => setModalVisible(!modalVisible), 1000);
    };

    const handleConfirm = (date) => {
      setTaskDueDate(date);
      hideDatePicker();
      setTimeout(() => setModalVisible(!modalVisible), 1000);
    };

    const handleReminderConfirm = (datetime) => {
      setTaskReminderDate(datetime);
      hideDateTimePicker();
      setTimeout(() => setModalVisible(!modalVisible), 1000);
    };

    // handler for completed tasks
    const handleChange = (id) => {
      console.log("HandleChange f called");
      let temp = allTasks.map((item) => {
        if (id === item.id) {
          return {
            ...item,
            completed: !item.completed,
            completedAt: new Date(),
          };
        }
        return item;
      });

      // console.log("Updated completion date in array: ", temp);
      setAllTasks(temp);

      const completed = temp.filter((el) => el.completed);
      setCompleteTasks(completed);

      // console.log("completed tasks array ", completed);
      const date = completed[0].dueDateAt.getDate();

      // sets the data array of tasks for the timeline component
      let timelineDataTemp = { ...timelineData };

      // need to take to account the tasks that has completed flag
      // console.log("timeTemp", timelineDataTemp);
      delete timelineDataTemp[date];
      setTimelineData(timelineDataTemp);

      const timeout = setTimeout(() => {
        temp = temp.filter((el) => !el.completed);
        setAllTasks(temp);
      }, 1000);
    };

    // callback that is passed to the flatlist component that renders the task item
    const renderTask = ({ item, drag, isActive }) => (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={styles.dragItem}
        >
          <Task
            item={item}
            showTaskDetail={showTaskDetail}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            setSelectedTask={setSelectedTask}
            handleChange={handleChange}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );

    // updates existing task in firestore db when pressing Save in the Task modal
    //TODO: do wee need update triggered from the modal?
    const updateTask = (text) => {
      console.log("Update task called");
      const new_obj = {
        ...selectedTask,
        heading: text,
        dueDateAt: taskDueDate,
        reminderAt: taskReminderDate,
        completedAt: taskCompletionDate,
        text: "",
      };
      // console.log("new_obj: ", new_obj);
      setSelectedTask(new_obj);

      updateTaskDB(new_obj);

      // updates the state of all tasks
      const updated_tasks = allTasks.map((task) => {
        if (task.id == selectedTask.id) {
          return {
            ...task,
            heading: text,
            dueDateAt: taskDueDate,
            reminderAt: taskReminderDate,
            completedAt: taskCompletionDate,
          };
        }
        return task;
      });

      setAllTasks(updated_tasks);

      setModalVisible(!modalVisible);
    };

    const updateTaskDB = async (task) => {
      // console.log("updateInDB called with task", task);
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

    // save a new task to the firestore db from the modal
    const saveTask = async (text) => {
      console.log("saveTask f called");
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();

      const data = {
        heading: text,
        id: uuid(),
        createdAt: timestamp,
        dueDateAt: taskDueDate,
        reminderAt: taskReminderDate,
        completed: false,
        completedAt: taskCompletionDate,
        subtasks: [],
        repeat: 0,
        text: "",
      };
      tasksRef
        .add(data)
        .then(() => {
          setSelectedTask({});
          setTaskDueDate(new Date(1900, 1, 1));
          setTaskReminderDate(new Date(1900, 1, 1));
          setTaskCompletionDate(null);
        })
        .then(() => {
          setModalVisible(!modalVisible);
        })
        .catch((error) => {
          alert(error);
        });
    };

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

    const createTask = () => {
      console.log("Create Task pressed");
      setSelectedTask({});
      setModalVisible(!modalVisible);
    };
    const renderDayTasks = (dayObj) => {
      console.log(dayObj);
      console.log("renderDayTasks pressed: ", dayObj);
      if (dayObj.dueDate) {
        navigation.navigate("Day Detail", dayObj.dueDate);
      } else {
        navigation.navigate("My Day");
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.screenWrapper}>
          <HeaderComponent menu={true} title={"My Actions"} color={"#fff"} />
          <View style={styles.timeline}>
            <HorizontalTimeline
              date={new Date().toISOString()}
              data={timelineData}
              onPress={(item) => renderDayTasks(item)}
            />
            <View
              style={{
                borderBottomColor: "#abb7b7",
                borderBottomWidth: 2,
              }}
            />
          </View>

          <View style={styles.mainSection}>
            <DraggableFlatList
              style={{ height: "100%" }}
              data={allTasks}
              onDragEnd={({ data }) => setAllTasks(data)}
              keyExtractor={(task, index) => {
                return task.id, index.toString();
              }}
              renderItem={renderTask}
            ></DraggableFlatList>
          </View>

          <View style={styles.bottomSection}>
            <Footer
              onPress={createTask}
              bgColor={"#66CC99"}
              btnColor={"lightgrey"}
            />
          </View>
        </View>
        <View style={styles.bottomRow}></View>

        <TaskModal
          task={selectedTask}
          setTask={setSelectedTask}
          isVisible={modalVisible}
          setIsVisible={setModalVisible}
          updateTask={updateTask}
          saveTask={saveTask}
          showDatePicker={showDatePicker}
          showDateTimePicker={showDateTimePicker}
          // createTask={createTask}
          deleteTask={deleteTask}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          isVisible={isDateTimePickerVisible}
          mode="datetime"
          onConfirm={handleReminderConfirm}
          onCancel={hideDateTimePicker}
        />
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

  dragItem: {
    padding: 5,
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

    backgroundColor: "lightgrey",
  },

  bottomSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
});

export default TaskList;

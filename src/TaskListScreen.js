import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
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

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";
import * as Notifications from "expo-notifications";

import { v4 as uuid } from "uuid";
import MenuNavigationComponent from "../components/MenuNavigationComponent";
import HeaderComponent from "../components/HeaderComponent";
import ReminderIntervalModal from "../components/ReminderIntervalModal";
import CustomSearchBar from "../components/CustomSearchBar";

const TaskList = ({ route, navigation }) => {
  // try {
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

  const [searchBarVisibility, setSearchBarVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const [isIntervalModalVisible, setIsIntervalModalVisible] = useState(false);
  const [taskRepeatData, setTaskRepeatData] = useState({ repeat: 0 });

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const completeTasks = [];
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
        const completedAt = doc.data().completedAt;

        const task = {
          id: id, //doc.id
          heading,
          text,
          completed,
          completedAt: completedAt,
          dueDateAt: dueDate,
          repeat,
          tasklist,
          reminderAt: reminderAt,
          subtasks,
          attachments,
          marked: false,
        };

        completed ? completeTasks.push(task) : tasks.push(task);

        if (dueDate && isWithinCurrentMonth(dueDate)) {
          const date = dueDate?.getDate();
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

      setAllTasks(tasks);
      setFilteredTasks(tasks);
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
      if (taskHeading) {
        setNoteTask(taskHeading);
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

  const showSearchBar = () => {
    setSearchBarVisibility(!searchBarVisibility);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };

  const showIntervalPicker = () => {
    setIsIntervalModalVisible(true);
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

    setAllTasks(temp);

    const completed = temp.filter((el) => el.completed);
    setCompleteTasks(completed);

    const date = completed[0].dueDateAt?.getDate();
    // sets the data array of tasks for the timeline component
    let timelineDataTemp = { ...timelineData };

    // need to take to account the tasks that has completed flag

    if (date) {
      delete timelineDataTemp[date];
      setTimelineData(timelineDataTemp);
    }

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
          handleDelete={handleDelete}
          deleteTask={deleteTask}
          handleChange={handleChange}
        />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  // updates existing task in firestore db when pressing Save in the Task modal
  //TODO: do wee need update triggered from the modal?
  const updateTask = (text) => {
    const new_obj = {
      ...selectedTask,
      heading: text,
      dueDateAt: taskDueDate,
      reminderAt: taskReminderDate,
      completedAt: taskCompletionDate,
      text: "",
    };
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

  // save a new task to the firestore db from the modal
  const saveTask = async (text) => {
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
      repeat: taskRepeatData.repeat,
      tasklist: 0,
      text: "",
      attachments: [],
    };
    tasksRef
      .add(data)
      .then(() => {
        setSelectedTask({});
        setTaskDueDate(null);
        setTaskReminderDate(null);
        setTaskCompletionDate(null);
      })
      .then(() => {
        setModalVisible(!modalVisible);
      })
      .catch((error) => {
        alert(error);
      });
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

  const deleteTask = (item) => {
    let filtered = allTasks.filter((task) => task.id != item.id);
    setAllTasks(filtered);
    deleteTaskFromDB(item.id);
  };

  const showTaskDetail = (item) => {
    navigation.navigate("Task Detail", item);
  };

  const createTask = () => {
    setSelectedTask({});
    setModalVisible(!modalVisible);
  };
  const renderDayTasks = (dayObj) => {
    if (dayObj.dueDate) {
      navigation.navigate("Day Detail", dayObj.dueDate);
    } else {
      navigation.navigate("My Day");
    }
  };

  const searchFunction = (text) => {
    if (text) {
      const updatedData = allTasks.filter((item) => {
        const itemData = item.heading.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredTasks(updatedData);
      setSearchValue(text);
    } else {
      setFilteredTasks(allTasks);
      setSearchValue(text);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        {!searchBarVisibility ? (
          <>
            <HeaderComponent menu={true} title={"My Actions"} color={"#fff"} />
            <TouchableOpacity
              onPress={showSearchBar}
              style={styles.searchBarStyle}
            >
              <Ionicons name="search-outline" size={32} color="white" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.searchBarSection}>
              <CustomSearchBar
                onChangeText={(text) => searchFunction(text)}
                value={searchValue}
                color={"#d9dbda"}
              ></CustomSearchBar>
            </View>
            <TouchableOpacity
              onPress={showSearchBar}
              style={styles.searchBarStyle}
            >
              <Ionicons name="arrow-back-outline" size={32} color="white" />
            </TouchableOpacity>
          </>
        )}

        {!searchBarVisibility ? (
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
        ) : null}

        <View style={styles.mainSection}>
          <DraggableFlatList
            style={{ height: "100%" }}
            data={filteredTasks}
            onDragEnd={({ data }) => setFilteredTasks(data)}
            keyExtractor={(task, index) => {
              return task.id, index.toString();
            }}
            renderItem={renderTask}
          ></DraggableFlatList>
        </View>

        <View style={styles.bottomSection}>
          <Footer
            onPress={createTask}
            bgColor={"#45454599"}
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
        showIntervalPicker={showIntervalPicker}
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
      <ReminderIntervalModal
        isVisible={isIntervalModalVisible}
        setIsVisible={setIsIntervalModalVisible}
        taskRepeatData={taskRepeatData}
        setTaskRepeatData={setTaskRepeatData}
        setParentModalVisible={setModalVisible}
      />
    </View>
  );
  // } catch (error) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", alignContent: "center" }}>
  //       <Text>An error occurred: {error}</Text>
  //     </View>
  //   );
  // }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#454545",
  },
  searchBarStyle: {
    position: "absolute",
    top: 70,
    right: 20,
  },

  timeline: {
    flex: 1,
    marginBottom: 10,
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
  bottomSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarSection: { marginTop: 70, marginBottom: 30 },
});

export default TaskList;

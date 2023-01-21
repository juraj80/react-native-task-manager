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

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";

const TaskList = ({ route, navigation }) => {
  const taskHeading = route.params.heading;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [noteTask, setNoteTask] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [timelineData, setTimelineData] = useState({});
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
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const { heading, text, completed } = doc.data();

        const dueDate = doc.data().dueDateAt.toDate();
        const reminderAt = doc.data().reminderAt.toDate();
        const date = dueDate.getDate();
        tasks.push({
          id: doc.id,
          heading,
          text,
          completed,
          dueDateAt: dueDate.toISOString(),
          reminderAt: reminderAt.toISOString(),
        });

        Object.assign(data, {
          [date]: { id: doc.id, marked: true, info: heading },
        });
      });
      setAllTasks(tasks);
      setTimelineData(data);
      // console.log("setTimelineData called");
      // console.log(data);
      //console.log(tasks);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    isDueToday();
  }, []);

  // set timer to check each task reminder date every second
  useEffect(() => {
    let secTimer = setInterval(() => {
      sendReminderNotification();
    }, 60000);
    return () => clearInterval(secTimer);
  }, []);

  const sendReminderNotification = () => {
    let currentDateTime = new Date().toISOString().slice(0, 16);
    console.log("displaying now", currentDateTime);
    console.log("");
    console.log("ALL TASKS:", allTasks);
    allTasks.forEach((obj) => {
      // console.log(obj.reminderAt.toISOString().slice(0, 16));
      // console.log(obj.reminderAt.slice(0, 16));
      // console.log(typeof obj.reminderAt);
      if (
        obj.reminderAt instanceof Date &&
        obj.reminderAt.slice(0, 16) === currentDateTime
      ) {
        console.log("Alert For reminder: ", now, "from object: ", obj);
      }
    });
  };

  // check if any of the stored task is due today
  const isDueToday = () => {
    let today = currentDate.toISOString().split("T")[0];
    allTasks.forEach((obj) => {
      if (
        obj.dueDate instanceof Date &&
        obj.dueDateAt.split("T")[0] === today
      ) {
        console.log("Alert For this day: ", today, "from object: ", obj);
        Alert.alert("Reminder", "Task: " + obj.heading + "is due today");
        // TODO: Need to send notificiations to the user with the message
      }
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("scrren is focused" + JSON.stringify(taskHeading));
      if (taskHeading) {
        setNoteTask(taskHeading);
        console.log("selectedTask: ", selectedTask);
        setSelectedTask({ heading: taskHeading });
        setModalVisible(true);
        navigation.setParams({ heading: null });
      }
    }, [taskHeading])
  );

  // to make focused screen refreshed when navigation is used
  // useEffect(() => {
  //   const focusHandler = navigation.addListener("focus", () => {

  //     navigation.setParams({ heading: null });
  //   });

  //   return focusHandler;
  // }, [navigation]);

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
      //   //setNoteHeader("");
      //   // release Keyboard
      //   Keyboard.dismiss();
      // })
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
    let temp = allTasks.map((product) => {
      if (id === product.id) {
        return { ...product, completed: !product.completed };
      }
      return product;
    });
    // temp = temp.filter((el) => !el.checked);
    // console.log("TEMP", temp);
    setAllTasks(temp);

    const completed = temp.filter((el) => el.completed);
    // console.log("completed", completed[0].dueDateAt.getDate());
    const date = completed[0].dueDateAt.getDate();
    let timelineDataTemp = { ...timelineData };

    // console.log("timeTemp", timelineDataTemp);
    delete timelineDataTemp[date];
    setTimelineData(timelineDataTemp);

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllTasks(temp);
      // console.log("timelineData", timelineData);
    }, 2000);
  };

  // const removeTask = () => {
  //   let temp = allTasks.filter((el) => !el.completed);
  //   console.log("TEMP", temp);
  //   setAllTasks(temp);
  // };

  // const handleCheckboxPress = () => {
  //   setChecked((prev) => {
  //     return !prev;
  //   });
  // };

  const Task = ({ item }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const fadeOut = () => {
      // Will change fadeAnim value to 0 in 3 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {});
    };
    const opacityStyle = { opacity: fadeAnim };

    return (
      <View style={styles.itemRow}>
        <Pressable
          onPress={() => {
            fadeOut();

            handleChange(item.id);
          }}
          style={styles.checkbox}
        >
          <AnimatedCheckbox
            checked={item.completed}
            highlightColor="#ffffff"
            checkmarkColor="#000000"
            boxOutlineColor="#000000"
          />
        </Pressable>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            showTaskDetail(item);
          }}
          onLongPress={() => {
            console.log("long press");
            setModalVisible(!modalVisible);
            setSelectedTask(item);
          }}
        >
          <Animated.Text
            style={[
              item.completed ? styles.checkedItem : "",
              opacityStyle,
              styles.itemText,
            ]}
            // style={opacityStyle}
            numberOfLines={1}
          >
            {item.heading.length < 35
              ? `${item.heading}`
              : `${item.heading.substring(0, 32)}...`}
          </Animated.Text>
          {/* <Text>{item.text}</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  // callback that is passed to the flatlist component that renders the task item
  const renderTask = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={styles.dragItem}
      >
        <Task item={item} />
      </TouchableOpacity>
    </ScaleDecorator>
  );

  const updateTask = (text) => {
    console.log("Update task called");
    // updates the state of the selected task
    console.log("taskDueDate: ", taskDueDate);
    console.log("reminderDate: ", taskReminderDate);
    const new_obj = {
      ...selectedTask,
      heading: text,
      dueDateAt: taskDueDate.toISOString(),
      reminderAt: taskReminderDate.toISOString(),
    };
    console.log("new_obj: ", new_obj);
    setSelectedTask(new_obj);

    // updates the state of all tasks
    const updated_tasks = allTasks.map((task) => {
      if (task.id == selectedTask.id) {
        return {
          ...task,
          heading: text,
          dueDateAt: taskDueDate.toISOString(),
          reminderAt: taskReminderDate.toISOString(),
        };
      }
      return task;
    });
    setAllTasks(updated_tasks);

    setModalVisible(!modalVisible);
  };

  // save a new task to the firestore db
  const saveTask = async (text) => {
    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: text,
      createdAt: timestamp,
      dueDateAt: taskDueDate,
      reminderAt: taskReminderDate,
      completed: false,
    };
    tasksRef
      .add(data)
      .then(() => {
        setSelectedTask({});
        setTaskDueDate(undefined);
        setTaskReminderDate(undefined);
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
    // navigation.navigate("Create Task");
    setSelectedTask({});
    setModalVisible(!modalVisible);
  };

  const createTaskFromNote = (text) => {
    console.log(
      "createTaskFromNote called with heading " + JSON.stringify(text)
    );
    // navigation.setParams({ heading: "NEJDE TO" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Tasks</Text>
        </View>
        <View style={styles.timeline}>
          <HorizontalTimeline
            date={new Date().toISOString()}
            data={timelineData}
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
            // numColumns={1}
            renderItem={renderTask}
          ></DraggableFlatList>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.btnWhiteBackground}>
            <TouchableOpacity style={styles.plusBtn} onPress={createTask}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* {console.log("ROUTE PARAMS line 351:" + JSON.stringify(taskHeading))} */}
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

      <View style={styles.bottomRow}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  timeline: {
    height: 50,
    marginBottom: 10,
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    // flexDirection: "column",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    // color: "#4169E1",
    color: "black",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "rgba(173, 216, 230, 0.5)",
    // backgroundColor: "#6495ED",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7,
  },
  itemText: { color: "black" },
  dragItem: {
    padding: 5,
  },

  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  mainSection: {
    flex: 9,
    padding: 5,
  },
  bottomSection: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomRow: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 50,
    zIndex: -99,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#4169E1",
    borderWidth: 1,
    borderColor: "black",
  },

  btnWhiteBackground: {
    backgroundColor: "white",
    width: 63,
    height: 63,
    borderRadius: 45,

    justifyContent: "center",
    alignItems: "center",
  },
  btnGreyBackground: {
    position: "absolute",
    right: -15,
    backgroundColor: "lightgrey",
    width: 75,
    height: 75,
    borderRadius: 50,
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
    // backgroundColor: "#4169E1",
    borderColor: "black",
    borderWidth: 1,
    width: 60,
    height: 60,

    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 30,
    color: "black",
  },
  itemStyle: {
    padding: 5,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
});

export default TaskList;

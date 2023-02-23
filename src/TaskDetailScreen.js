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
  Flatlist,
  LogBox,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { v4 as uuid } from "uuid";

import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";
import SubTask from "../components/SubTask";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HeaderComponent from "../components/HeaderComponent";
import FullWidthButton from "../components/FullWidthButton";
import ReminderIntervalModal from "../components/ReminderIntervalModal";
import { formatUTCDate } from "./helpers/helpers.js";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const TaskDetail = ({ route, navigation }) => {
  console.log("Task Detail received props: ", route.params);
  // try {
  const [task, setTask] = useState("");
  const [taskId, setTaskId] = useState(route.params.id);
  const [taskHeader, setTaskHeader] = useState(route.params.heading);
  const [taskText, setTaskText] = useState(route.params.text);

  const [subTaskText, setSubTaskText] = useState("");
  const [allSubTasks, setAllSubTasks] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const [isIntervalModalVisible, setIsIntervalModalVisible] = useState(false);

  const [taskDueDate, setTaskDueDate] = useState(route.params.dueDateAt);
  const [taskReminderDate, setTaskReminderDate] = useState(
    route.params.reminderAt
  );

  const [taskRepeatData, setTaskRepeatData] = useState(route.params.repeat);

  const [taskList, setTaskList] = useState(route.params.tasklist);

  const tasksRef = firebase.firestore().collection("tasks");

  TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

  async function fetchData() {
    console.log("TaskDetail fetchData called with taskId ", taskId);

    tasksRef
      .where("id", "==", taskId)
      .get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const subTasks = doc.data()?.subtasks;

          if (subTasks) {
            setAllSubTasks(subTasks);
          }
        }
      })
      .then(() => {
        console.log("Task: ", task, " was succesfully fetched from the DB");
      })
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // callback that saves the task detail in the DB when the SAVE button is pressed
  const updateTask = async () => {
    if (taskHeader && taskHeader.length > 0) {
      // get the timestamp
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: taskHeader,
        text: taskText,
        dueDateAt: taskDueDate,
        reminderAt: taskReminderDate,
        updatedAt: timestamp,
        subtasks: allSubTasks,
        repeat: taskRepeatData,
        tasklist: taskList,
      };
      tasksRef
        .where("id", "==", taskId)
        .get()
        .then((query) => {
          query.docs.forEach((doc) => {
            const docRef = firebase.firestore().collection("tasks").doc(doc.id);
            docRef.update(data);
          });
        })
        .then(() => {
          navigation.navigate("My Actions");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const renderSubTask = ({ item, drag, isActive }) => (
    <TouchableOpacity
      // onLongPress={drag}
      // onPress={() => deleteSubTask(item)}
      onLongPress={() => handleDelete(item.id)}
      disabled={isActive}
      style={styles.dragItem}
    >
      <SubTask
        item={item}
        taskId={taskId}
        allSubTasks={allSubTasks}
        setAllSubTasks={setAllSubTasks}
        subTaskText={subTaskText}
        setSubTaskText={setSubTaskText}
        handleChange={handleChange}
        handleDelete={handleDelete}
        deleteSubTask={deleteSubTask}
      />
    </TouchableOpacity>
  );

  // callback called when the +AddSubTask button is pressed
  const createSubTask = () => {
    console.log("Create SubTask pressed! ", subTaskText);
    setAllSubTasks([
      ...allSubTasks,
      { id: getId(), completed: false, text: subTaskText, marked: false },
    ]);
    setSubTaskText("");
  };

  const getId = () => {
    return uuid();
  };

  const deleteSubTask = (item) => {
    console.log("Delete SubTask func called", item);
    let filtered = allSubTasks.filter((task) => task.id != item.id);
    console.log("filtered: ", filtered);
    setAllSubTasks(filtered);
    // deleteTaskFromDB(item.id);
  };

  const handleDelete = (id) => {
    let temp = allSubTasks.map((item) => {
      if (id === item.id) {
        return { ...item, marked: !item.marked };
      }
      return item;
    });
    setAllSubTasks(temp);
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
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const addToMyDay = () => {
    taskList == 0 ? setTaskList(1) : setTaskList(0);
  };

  const handleConfirm = (date) => {
    setTaskDueDate(date);
    hideDatePicker();
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const handleReminderConfirm = (datetime) => {
    setTaskReminderDate(datetime);
    hideDateTimePicker();
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const getRepeatData = (num) => {
    if (num == 1) {
      return "Daily";
    } else if (num == 2) {
      return "Weekly";
    } else if (num == 3) {
      return "Monthly";
    } else {
      return "Yearly";
    }
  };

  return (
    <LinearGradient
      colors={["#ff9478", "white"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.screenWrapper}>
          <HeaderComponent title={"My Task"} back={true} />
          <View style={styles.inputSection}>
            <TextInput
              value={taskHeader}
              onChangeText={setTaskHeader}
              placeholder={taskHeader}
              placeholderTextColor="black"
              style={{ color: "ccc", fontSize: 22, fontFamily: "Lato-Light" }}
              spellCheck={false}
              autoFocus
              selectionColor="#000"
            />
            {/* {console.log(
                "Task detail Screen rendered with the  subtask : ",
                allSubTasks
              )} */}

            <TextInput
              value={taskText}
              onChangeText={setTaskText}
              placeholder={taskText}
              style={{ color: "ccc", fontSize: 22, fontFamily: "Lato-Light" }}
              spellCheck={false}
              multiline={true}
              autoFocus
              selectionColor="#000"
              style={styles.mainSection}
            />
          </View>
          <View style={styles.subTasksSection}>
            {/* <DraggableFlatList
            // style={{ height: "90%", flexGrow: 0 }}
            data={allSubTasks}
            onDragEnd={({ data }) => setAllSubTasks(data)}
            keyExtractor={(subtask, index) => {
              return subtask.id, index.toString();
            }}
            renderItem={renderSubTask}
          ></DraggableFlatList> */}
            <FlatList
              // style={{ height: "100%" }}
              data={allSubTasks}
              numColumns={1}
              renderItem={renderSubTask}
            ></FlatList>
          </View>
          <View style={styles.addBtnContainer}>
            <TouchableOpacity onPress={createSubTask}>
              <Text style={styles.btnTextStyle}>+ Add Subtask</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarSection}>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.btnRowContainer}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="calendar-cursor"
                  size={30}
                  color="black"
                />
              </View>
              {/* <Text>Due: {formatUTCDate(route.params.dueDateAt)}</Text> */}
              {/* <Text>Due: {formatUTCDate(taskDueDate)}</Text> */}

              {taskDueDate ? (
                <Text>Due: {formatUTCDate(taskDueDate)}</Text>
              ) : (
                <Text>Set Due Date</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showDateTimePicker}
              style={styles.btnRowContainer}
            >
              {/* <LinearGradient
                  colors={["#4c669f", "#3b5998", "#192f6a"]}
                  style={styles.calendarBtnContainer}
                >
                  <Text style={styles.btnTextStyle}>Reminder</Text>
                </LinearGradient> */}
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name="reminder"
                  size={30}
                  color="black"
                />
              </View>
              {taskReminderDate ? (
                <Text>Remind me at: {formatUTCDate(taskReminderDate)}</Text>
              ) : (
                <Text>Set Reminder</Text>
              )}

              {/* <Text>Remind me at: {formatUTCDate(taskReminderDate)}</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showIntervalPicker}
              style={styles.btnRowContainer}
            >
              {/* <LinearGradient
                  colors={["#4c669f", "#3b5998", "#192f6a"]}
                  style={styles.calendarBtnContainer}
                >
                  <Text style={styles.btnTextStyle}>Repeat</Text>
                </LinearGradient> */}
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="repeat" size={30} color="black" />
              </View>
              {taskRepeatData.repeat > 0 ? (
                <Text>Repeat: {getRepeatData(taskRepeatData.repeat)}</Text>
              ) : (
                <Text>Repeat</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addToMyDay}
              style={styles.btnRowContainer}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="star" size={30} color="black" />
              </View>
              <Text>Add to My Day</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.attachmentsSection}>
            {/* <Text>Attachments</Text> */}
          </View>
          <View style={styles.bottomSection}>
            {/* <TouchableOpacity
              style={styles.plusBtn}
              onPress={() => updateTask()}
            >
              <Text style={styles.plusText}>Save</Text>
            </TouchableOpacity> */}
            <FullWidthButton title={"Save"} onPress={() => updateTask()} />
          </View>
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
          />
        </View>
      </View>
    </LinearGradient>
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
    // backgroundColor: "#ff9478",
  },
  screenWrapper: {
    flex: 5,
    paddingTop: 60,
    paddingHorizontal: 10,
  },

  inputSection: {
    flex: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  mainSection: {
    flex: 5,
  },

  subTasksSection: {
    flex: 0,
    // backgroundColor: "yellow",
  },
  calendarSection: {
    flex: 2,
    marginVertical: 20,
    // backgroundColor: "blue",
  },
  attachmentsSection: { flex: 2 },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
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
    paddingHorizontal: 12,
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
  addBtnContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
    justifyContent: "center",
    borderColor: "#95a5a6",
    backgroundColor: "#95a5a6",

    borderWidth: 1,
    borderRadius: 7,
  },
  calendarBtnContainer: {
    elevation: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#42a5f5",

    borderRadius: 7,
  },
  btnTextStyle: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  btnRowContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
    flexDirection: "row",
  },
  iconContainer: {
    paddingRight: 10,
  },
});

export default TaskDetail;

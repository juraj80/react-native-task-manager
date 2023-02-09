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

import { v4 as uuid } from "uuid";

// import DraggableFlatList, {
//   ScaleDecorator,
// } from "react-native-draggable-flatlist";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";
import SubTask from "../components/SubTask";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import Icons from "react-native-vector-icons/MaterialIcons";
// import { Ionicons } from "@expo/vector-icons";
// import BackNavigationComponent from "../components/BackNavigationComponent";
import HeaderComponent from "../components/HeaderComponent";

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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const [taskDueDate, setTaskDueDate] = useState(new Date(1900, 1, 1));
  const [taskReminderDate, setTaskReminderDate] = useState(
    new Date(1900, 1, 1)
  );

  const tasksRef = firebase.firestore().collection("tasks");

  TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

  async function fetchData() {
    tasksRef
      .doc(taskId)
      .get()
      .then((querySnapshot) => {
        const subTasks = querySnapshot.data()?.subtasks;
        if (subTasks) {
          setAllSubTasks(subTasks);
        }
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // callback that saves the task detail in the DB when the SAVE button is pressed
  const updateTask = async () => {
    console.log("updateTask called");
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
          navigation.navigate("My Actions");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  // const renderTask = ({ item }) => (
  //   <TouchableOpacity style={styles.itemStyle}>
  //     <Text>{item.heading}</Text>
  //     <Text>{item.text}</Text>
  //   </TouchableOpacity>
  // );

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

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
    // setTimeout(() => setModalVisible(!modalVisible), 1000);
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

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <HeaderComponent title={"My Task"} back={true} />
        <View style={styles.inputSection}>
          <TextInput
            value={taskHeader}
            onChangeText={setTaskHeader}
            placeholder={taskHeader}
            placeholderTextColor="black"
            style={{ color: "ccc", fontSize: 22 }}
            spellCheck={false}
            autoFocus
            selectionColor="#000"
          />
          {console.log(
            "Task detail Screen rendered with the  subtask : ",
            allSubTasks
          )}

          <TextInput
            value={taskText}
            onChangeText={setTaskText}
            placeholder={taskText}
            style={{ color: "ccc", fontSize: 22 }}
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
            <Text style={styles.btnTextStyle}>+ Add SubTask</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calendarSection}>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.calendarBtnContainer}
          >
            <Text style={styles.btnTextStyle}>Set Due Date</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={showDateTimePicker}
            style={styles.calendarBtnContainer}
          >
            <Text style={styles.btnTextStyle}>Reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.calendarBtnContainer}>
            <Text style={styles.btnTextStyle}>Repeat</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.attachmentsSection}>
          {/* <Text>Attachments</Text> */}
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.plusBtn} onPress={() => updateTask()}>
            <Text style={styles.plusText}>Save</Text>
          </TouchableOpacity>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff9478",
  },
  screenWrapper: {
    flex: 5,
    paddingTop: 60,
    paddingHorizontal: 10,
  },

  inputSection: { flex: 2 },
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
    // backgroundColor: "green",
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
    borderColor: "#95a5a6",
    backgroundColor: "#95a5a6",

    borderWidth: 1,
    borderRadius: 7,
  },
  btnTextStyle: { color: "white", fontSize: 20, marginLeft: 5 },
});

export default TaskDetail;

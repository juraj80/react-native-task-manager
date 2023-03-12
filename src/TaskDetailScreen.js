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
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { v4 as uuid } from "uuid";

import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";

import SubTask from "../components/SubTask";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import HeaderComponent from "../components/HeaderComponent";
import FullWidthButton from "../components/FullWidthButton";
import ReminderIntervalModal from "../components/ReminderIntervalModal";
import { formatUTCDate } from "./helpers/helpers.js";
import {
  Feather,
  MaterialCommunityIcons,
  Entypo,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const TaskDetail = ({ route, navigation }) => {
  // try {
  const [task, setTask] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [taskId, setTaskId] = useState(route.params.id);
  const [taskHeader, setTaskHeader] = useState(route.params.heading);
  const [taskText, setTaskText] = useState(route.params.text);

  const [subTaskText, setSubTaskText] = useState("");
  const [allSubTasks, setAllSubTasks] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] =
    useState(false);

  const [isIntervalModalVisible, setIsIntervalModalVisible] = useState(false);

  const [taskDueDate, setTaskDueDate] = useState(
    route.params.dueDateAt || null
  );
  const [taskReminderDate, setTaskReminderDate] = useState(
    route.params.reminderAt || null
  );

  const [taskRepeatData, setTaskRepeatData] = useState(route.params.repeat);

  const [attachments, setAttachments] = useState(
    route.params.attachments || []
  );
  const [fileName, setFileName] = useState(null);
  const [fileOpen, setFileOpen] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [taskList, setTaskList] = useState(route.params.tasklist);

  const tasksRef = firebase.firestore().collection("tasks");

  TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

  async function fetchData() {
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
      .catch((error) => {
        alert(error);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // provides access to the system's UI for selecting images rom the phone's library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      let filePath = result.assets[0].uri;
      let fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
      setAttachments([...attachments, { fileName, filePath }]);
    }
  };

  const uploadImage = async () => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", attachments, true);
      xhr.send(null);
    });
    const ref = firebase.storage().ref().child(`Files/${fileName}`);
    const snapshot = ref.put(blob);
    snapshot.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      () => {
        setUploading(true);
      },
      (error) => {
        setUploading(false);
        console.log(error);
        blob.close();
        return;
      },
      () => {
        snapshot.snapshot.ref.getDownloadURL().then((url) => {
          setUploading(false);
          setAttachments(url);
          blob.close();
          return url;
        });
      }
    );
  };

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
        attachments: attachments,
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
    let filtered = allSubTasks.filter((task) => task.id != item.id);
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
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const addToMyDay = () => {
    taskList == 0 ? setTaskList(1) : setTaskList(0);
  };

  const handleConfirm = (date) => {
    setTaskDueDate(date);
    hideDatePicker();
  };

  const handleReminderConfirm = (datetime) => {
    setTaskReminderDate(datetime);
    hideDateTimePicker();
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
  const showAttachment = (filePath) => {
    setFileOpen(filePath);
    setModalVisible(true);
  };

  function handleCancelPress() {
    setModalVisible(false);
  }

  const deleteAttachment = (index) => {
    const attachmentsCopy = [...attachments];
    attachmentsCopy.splice(index, 1);
    setAttachments(attachmentsCopy);
  };

  return (
    <LinearGradient
      colors={["lightgrey", "white"]}
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

            <TextInput
              value={taskText}
              onChangeText={setTaskText}
              placeholder={taskText}
              style={[
                styles.mainSection,
                { color: "ccc", fontSize: 22, fontFamily: "Lato-Light" },
              ]}
              spellCheck={false}
              multiline={true}
              autoFocus
              selectionColor="#000"
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
              data={allSubTasks}
              numColumns={1}
              renderItem={renderSubTask}
            ></FlatList>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={createSubTask}
              style={styles.addBtnContainer}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="add-task" size={24} color="black" />
              </View>
              <Text style={styles.btnTextStyle}>Add Subtask</Text>
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
            </TouchableOpacity>
            <TouchableOpacity
              onPress={showIntervalPicker}
              style={styles.btnRowContainer}
            >
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
              {taskList == 0 ? (
                <>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="star"
                      size={30}
                      color="black"
                    />
                  </View>

                  <Text>Add to My Day</Text>
                </>
              ) : (
                <>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name="star"
                      size={30}
                      color="darkblue"
                    />
                  </View>

                  <Text style={{ color: "darkblue" }}>Added to My Day</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              style={styles.btnRowContainer}
            >
              <View style={styles.iconContainer}>
                <Entypo name="attachment" size={30} color="black" />
              </View>

              <Text>Add File</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.attachmentsSection}>
            <TouchableOpacity>
              <Text>Attachments</Text>
              <View>
                {attachments &&
                  attachments.map((obj, i) => (
                    <View key={i} style={styles.attachmentRow}>
                      <View style={styles.leftAlign}>
                        <Text
                          style={styles.attachmentText}
                          onPress={() => showAttachment(obj.filePath)}
                        >
                          {obj.fileName}
                        </Text>
                      </View>
                      <View style={styles.rightAlign}>
                        <TouchableOpacity onPress={() => deleteAttachment(i)}>
                          <MaterialIcons
                            name="cancel"
                            size={24}
                            color="black"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomSection}>
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

        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.cancelBtn}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                {/* <Text style={styles.cancelText}>X</Text> */}
                <Ionicons name="arrow-back" size={36} color="white" />
              </TouchableOpacity>
            </View>

            <Image
              style={styles.image}
              source={{
                uri: fileOpen,
              }}
            />
          </View>
        </Modal>
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
  },
  calendarSection: {
    flex: 2,
    marginVertical: 20,
  },
  attachmentsSection: { flex: 2 },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },
  dragItem: {
    padding: 5,
  },
  addBtnContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 5,
    borderColor: "#95a5a6",
    borderWidth: 2,
    borderRadius: 2,
  },
  btnTextStyle: {
    color: "black",
    fontSize: 20,
    marginLeft: 5,
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
  attachmentRow: {
    marginVertical: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    borderWidth: 1,
  },
  leftAlign: {
    flex: 9,
    justifyContent: "center",
  },
  rightAlign: {
    flex: 1,
    alignItems: "center",
  },
  attachmentText: { fontSize: 14 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  cancelBtn: {
    position: "absolute",

    top: 70,
    left: 20,
    zIndex: 999,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default TaskDetail;

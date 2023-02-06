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
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";

import DateTimePickerModal from "react-native-modal-datetime-picker";

const CreateTask = ({ route, navigation }) => {
  const { heading, isVisible } = route.params;

  const [taskHeader, setTaskHeader] = useState(route.params);
  const [taskDetail, setTaskDetail] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(new Date());

  const tasksRef = firebase.firestore().collection("tasks");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setTaskDueDate(date);
    hideDatePicker();
  };

  const saveTask = async () => {
    // get the timestamp
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: taskHeader,
      text: taskDetail,
      createdAt: timestamp,
      dueDateAt: taskDueDate,
      completed: false,
    };

    tasksRef
      .add(data)
      .then(() => {
        setTaskHeader("");
        setTaskDetail("");
        // release Keyboard
        Keyboard.dismiss();
      })
      .then(() => {
        navigation.navigate("My Actions");
      })
      .catch((error) => {
        alert(error);
      });
    // }
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={taskHeader}
        onChangeText={setTaskHeader}
        placeholder="Add Header"
        placeholderTextColor="black"
        style={{ color: "ccc", fontSize: 22 }}
        spellCheck={false}
        autoFocus
        selectionColor="#aaa"
      />
      <TextInput
        value={taskDetail}
        onChangeText={setTaskDetail}
        placeholder="Add Details"
        style={{ color: "ccc", fontSize: 22 }}
        spellCheck={false}
        multiline={true}
        autoFocus
        selectionColor="#aaa"
        style={styles.mainSection}
      />
      {/* <Text>TaskHeader: {JSON.stringify(taskDetails)}</Text> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.bottom}
      >
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Button
          style={styles.button}
          onPress={showDatePicker}
          color="#841584"
          title="Set Due Date "
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          style={styles.button}
          onPress={() => {
            saveTask();
            navigation.navigate("My Actions");
          }}
          color="#841584"
          title="Create Task"
          accessibilityLabel="Learn more about this purple button"
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 20,
    width: Dimensions.get("window").width,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  headerSection: {
    flex: 1,
    backgroundColor: "yellow",
  },
  mainSection: {
    flex: 9,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginBottom: 30,
  },
});
export default CreateTask;

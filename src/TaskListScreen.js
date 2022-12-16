import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../firebaseConfig";

const TaskList = ({ navigation }) => {
  const [allTasks, setAllTasks] = useState([]);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { heading, text } = doc.data();
        users.push({
          id: doc.id,
          heading,
          text,
        });
      });
      setAllTasks(users);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.itemStyle}
      onPress={() => {
        showTaskDetail(item);
      }}
    >
      <Text>{item.heading}</Text>
      {/* <Text>{item.text}</Text> */}
    </TouchableOpacity>
  );

  const showTaskDetail = (item) => {
    console.log("item", item);
    navigation.navigate("Task Detail", item);
  };

  const createTask = (item) => {
    navigation.navigate("Create Task", { taskDetails: "Add Header" });
  };

  return (
    // <View style={{ flex: 1, justifyContent: "center" }}>
    //   <View style={styles.formContainer}>
    //     <TextInput
    //       style={styles.input}
    //       placeholder="Add some text"
    //       placeholderTextColor="#aaaaaa"
    //       onChangeText={(heading) => {
    //         setAddData(heading);
    //       }}
    //       value={addData}
    //       multiline={true}
    //       underlineColorAndroid="transparent"
    //       autoCapitalize="none"
    //     ></TextInput>
    //     <TouchableOpacity style={styles.button} onPress={addField}>
    //       <Text style={styles.buttonText}>Add</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    <View style={styles.container}>
      <View style={styles.mainSection}>
        <FlatList
          style={{ height: "100%" }}
          data={allTasks}
          numColumns={1}
          renderItem={renderTask}
        ></FlatList>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.plusBtn} onPress={createTask}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   formContainer: {
//     flexDirection: "row",
//     height: 80,
//     marginLeft: 10,
//     marginRight: 10,
//   },
//   input: {
//     height: 48,
//     borderRadius: 5,
//     overflow: "hidden",
//     backgroundColor: "white",
//     paddingLeft: 16,
//     flex: 1,
//     marginRight: 5,
//   },
//   button: {
//     height: 47,
//     borderRadius: 5,
//     backgroundColor: "#788eec",
//     width: 80,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 20,
//   },
// });
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  mainSection: {
    flex: 3,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
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
    backgroundColor: "blue",
    width: 80,
    height: 80,

    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 30,
    color: "white",
  },
  itemStyle: {
    padding: 5,
  },
});

export default TaskList;

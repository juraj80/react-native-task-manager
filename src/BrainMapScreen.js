import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/core";
import { getOuterBindingIdentifiers } from "@babel/types";

import { firebase } from "../firebaseConfig";
import { setUserProperties } from "@firebase/analytics";

const BrainMapScreen = ({ navigation }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  const notesRef = firebase.firestore().collection("notes");

  //   useFocusEffect(
  //     React.useCallback(() => {
  //       getNotes();
  //     }, [])
  //   );

  async function fetchData() {
    notesRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { heading, text } = doc.data();
        users.push({
          id: doc.id,
          heading,
          text,
        });
      });
      setAllNotes(users);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderNote = ({ item }) => (
    <TouchableOpacity style={styles.itemStyle} onPress={() => createTask(item)}>
      <Text>{item.heading}</Text>
      <Text>{item.text}</Text>
    </TouchableOpacity>
  );

  const createTask = (item) => {
    console.log(item);
    navigation.navigate("Create Task", { taskDetails: item.heading });
  };

  return (
    // <View style={styles.container}>
    <View
      style={styles.container}
      //   onPress={() => navigation.navigate("TaskList")}
    >
      <View style={styles.mainSection}>
        <FlatList
          style={{ height: "100%" }}
          data={allNotes}
          numColumns={1}
          renderItem={renderNote}
        ></FlatList>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.plusBtn}
          onPress={() => navigation.navigate("CreateNote")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </View>
  );
};

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
    backgroundColor: "red",
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
    backgroundColor: "green",
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
    backgroundColor: "yellow",
  },
});
export default BrainMapScreen;

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
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
    <TouchableOpacity
      style={styles.itemStyle}
      onPress={() => createNote(item)}
      onLongPress={() => createTask(item)}
    >
      <MaterialCommunityIcons name="note" size={18} color="black" />

      <Text numberOfLines={1} style={styles.itemText}>
        {item.heading}
      </Text>
      {/* <Text>{item.text}</Text> */}
    </TouchableOpacity>
  );

  const createTask = (item) => {
    navigation.navigate("Create Task", item.heading);
  };

  const createNote = (item) => {
    navigation.navigate("Note Detail", item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <View style={styles.headerSection}>
          <Text style={styles.screenTitle}>Brain Map</Text>
        </View>
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
            onPress={() => navigation.navigate("Create Note")}
          >
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    // flexDirection: "column",
  },
  mainSection: {
    flex: 5,
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
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: "row",
  },
});
export default BrainMapScreen;

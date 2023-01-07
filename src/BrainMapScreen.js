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

  async function fetchData() {
    notesRef.onSnapshot((querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        const { heading, text, createdAt } = doc.data();
        users.push({
          id: doc.id,
          heading,
          text,
          createdAt,
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
      {/* <MaterialCommunityIcons name="note-outline" size={18} color="black" /> */}

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
          <Text style={styles.screenTitle}>Notes</Text>
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
          <View style={styles.btnGreyBackground}>
            <View style={styles.btnWhiteBackground}>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => navigation.navigate("Create Note")}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomRow}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4682B4",
    opacity: 0.8,
  },
  headerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  screenWrapper: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // flexDirection: "column",
  },
  mainSection: {
    flex: 5,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  bottomRow: {
    // flex: 1,
    position: "absolute",
    width: "100%",
    bottom: 0,
    height: 70,
    zIndex: -99,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "lightgrey",
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

  plusBtn: {
    backgroundColor: "rgba(173, 173, 173, 0.9)",
    width: 60,
    height: 60,
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
  itemText: {
    marginLeft: 5,
    color: "white",
    fontSize: 15,
  },
});
export default BrainMapScreen;

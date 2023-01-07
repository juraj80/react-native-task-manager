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
} from "react-native";
import AnimatedCheckbox from "react-native-checkbox-reanimated";
import DraggableFlatList, {
  ScaleDecorator,
} from "react-native-draggable-flatlist";

// import { HorizontalTimeline } from "react-native-horizontal-timeline";
import HorizontalTimeline from "../components/CustomTimeline";

import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";

const TaskList = ({ navigation }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [timelineData, setTimelineData] = useState({});

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      const data = {};
      querySnapshot.forEach((doc) => {
        const { heading, text, completed } = doc.data();

        const dueDate = doc.data().dueDateAt.toDate();
        const date = dueDate.getDate();
        tasks.push({
          id: doc.id,
          heading,
          text,
          completed,
          dueDateAt: dueDate,
        });

        Object.assign(data, {
          [date]: { id: doc.id, marked: true, info: heading },
        });
      });
      setAllTasks(tasks);
      setTimelineData(data);
      // console.log("setTimelineData called");
      // console.log(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

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
    console.log("completed", completed[0].dueDateAt.getDate());
    const date = completed[0].dueDateAt.getDate();
    let timelineDataTemp = { ...timelineData };

    console.log("timeTemp", timelineDataTemp);
    delete timelineDataTemp[date];
    setTimelineData(timelineDataTemp);

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.completed);
      setAllTasks(temp);
      console.log("timelineData", timelineData);
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
            boxOutlineColor="#ffffff"
          />
        </Pressable>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            showTaskDetail(item);
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

  const showTaskDetail = (item) => {
    console.log("item", item);
    navigation.navigate("Task Detail", item);
  };

  const createTask = () => {
    console.log("Create Task pressed");
    // navigation.navigate("Create Task", { taskDetails: "Add Header" });
    navigation.navigate("Create Task");
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
            keyExtractor={(task) => task.id}
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

      <View style={styles.bottomRow}></View>
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
    color: "#4169E1",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    // backgroundColor: "rgba(173, 216, 230, 0.5)",
    backgroundColor: "#6495ED",
    borderRadius: 7,
  },
  itemText: { color: "white" },
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
    backgroundColor: "#4169E1",
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
    backgroundColor: "#4169E1",
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

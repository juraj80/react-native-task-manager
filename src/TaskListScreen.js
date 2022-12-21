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
import React, { useState, useEffect, useRef } from "react";
import { firebase } from "../firebaseConfig";

const TaskList = ({ navigation }) => {
  const [allTasks, setAllTasks] = useState([]);

  const tasksRef = firebase.firestore().collection("tasks");

  async function fetchData() {
    tasksRef.onSnapshot((querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((doc) => {
        const { heading, text } = doc.data();
        tasks.push({
          id: doc.id,
          heading,
          text,
        });
      });
      setAllTasks(tasks);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   let temp = allTasks.filter((el) => !el.checked);

  //   const timeout = setTimeout(() => {
  //     setAllTasks(temp);
  //   }, 1000);
  // }, [allTasks]);

  // const onChecked = (id) => {
  //   console.log("onchecked called with id ", id);
  //   const data = allTasks;
  //   const index = data.findIndex((x) => x.id === id);
  //   console.log("index", index);
  //   data[index].checked = !data[index].checked;
  //   console.log("DATA", data);
  //   setAllTasks(data);
  // };

  const handleChange = (id) => {
    let temp = allTasks.map((product) => {
      if (id === product.id) {
        return { ...product, checked: !product.checked };
      }
      return product;
    });
    // temp = temp.filter((el) => !el.checked);
    // console.log("TEMP", temp);
    setAllTasks(temp);

    const timeout = setTimeout(() => {
      temp = temp.filter((el) => !el.checked);
      setAllTasks(temp);
    }, 2000);
  };

  const removeTask = () => {
    let temp = allTasks.filter((el) => !el.checked);
    console.log("TEMP", temp);
    setAllTasks(temp);
  };

  // const handleCheckboxPress = () => {
  //   setChecked((prev) => {
  //     return !prev;
  //   });
  // };

  const Task = ({ item }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const fadeOut = () => {
      console.log("FADE OUT called with fadeAnim value", fadeAnim);
      // Will change fadeAnim value to 0 in 3 seconds
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        console.log("FADE ANIM", fadeAnim);
      });
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
            checked={item.checked}
            highlightColor="#4444ff"
            checkmarkColor="#ffffff"
            boxOutlineColor="#4444ff"
          />
        </Pressable>
        <TouchableOpacity
          style={styles.itemStyle}
          onPress={() => {
            showTaskDetail(item);
          }}
        >
          <Animated.Text
            style={[item.checked ? styles.checkedItem : "", opacityStyle]}
            // style={opacityStyle}
          >
            {item.heading}
          </Animated.Text>
          {/* <Text>{item.text}</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  const renderTask = ({ item }) => <Task item={item} />;

  const showTaskDetail = (item) => {
    console.log("item", item);
    navigation.navigate("Task Detail", item);
  };

  const createTask = () => {
    navigation.navigate("Create Task", { taskDetails: "Add Header" });
  };

  return (
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
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },

  headerSection: {
    flex: 1,
    alignItems: "center",
  },
  mainSection: {
    flex: 3,
    backgroundColor: "yellow",
    padding: 5,
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
  checkbox: {
    width: 24,
    height: 24,
  },
  checkedItem: {
    textDecorationLine: "line-through",
  },
});

export default TaskList;

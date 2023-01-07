import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import PomodoroTimer from "../components/PomodoroTimer";

const PomodoroScreen = () => {
  const [intervalType, setIntervalType] = useState("Working");
  const [workTime, setWorkTime] = useState(5);
  const [breakTime, setBreakTime] = useState(1);

  const handleTimeCompleted = () => {
    if (intervalType === "Working") {
      setIntervalType("Break");
    } else {
      setIntervalType("Working");
    }
  };

  const handleWorkTime = (text) => {
    if (text >= 0) {
      setWorkTime(text);
    } else {
      alert("Time invalid. Setting value to default. Please enter valid time");
      setWorkTime(25);
    }
  };

  const handleBreakTime = (text) => {
    if (text >= 0) {
      setBreakTime(text);
    } else {
      alert("Time invalid. Setting value to default. Please enter valid time");
      setBreakTime(5);
    }
  };

  const handleTime = () => {
    if (intervalType === "Working") {
      return workTime;
    } else {
      return breakTime;
    }
  };

  let time = handleTime();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.inputField}>
          <Text style={styles.inputHeading}>Work</Text>

          <TextInput
            style={styles.inputStyle}
            maxLength={3}
            keyboardType={"numeric"}
            defaultValue={"" + workTime}
            placeholder="mins"
            onChangeText={handleWorkTime}
          ></TextInput>
        </View>
        <View style={styles.inputField}>
          <Text style={styles.inputHeading}>Break</Text>
          <TextInput
            style={styles.inputStyle}
            maxLength={3}
            keyboardType={"numeric"}
            defaultValue={"" + breakTime}
            placeholder="mins"
            onChangeText={handleBreakTime}
          ></TextInput>
        </View>
      </View>
      <PomodoroTimer
        intervalType={intervalType}
        onComplete={handleTimeCompleted}
        period={time}
      ></PomodoroTimer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: 'blue',
  },
  row: {
    flexDirection: "row",
    // backgroundColor: 'red',
    padding: 15,
  },
  inputField: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // borderColor: '#0F0',
    // borderWidth: 1,
  },
  inputStyle: {
    height: 60,
    // borderColor: 'gray',
    // borderWidth: 1,
    width: "40%",
    borderRadius: 50,
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "rgba(62,62, 62, 0.6)",

    padding: 10,
  },
  inputHeading: {
    fontSize: 20,
    padding: 5,
  },
});

export default PomodoroScreen;
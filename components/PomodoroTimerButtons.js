// import React in our code
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const PomodoroTimerButtons = (props) => {
  if (props.isRunning) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonStyle} onPress={props.pause}>
          <Text style={styles.buttonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonStyle} onPress={props.reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonStyle} onPress={props.play}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // backgroundColor: 'green',
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    padding: 5,
    width: 80,
    height: 40,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "300",
  },
});

export default PomodoroTimerButtons;

// import React in our code
import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";

const PomodoroTimerHeader = (props) => {
  const handleDisplay = () => {
    if (props.intervalType === "Working") {
      if (props.isRunning) {
        return "Keep focusing!";
      } else {
        return "It's focus time!";
      }
    } else {
      if (props.isRunning) {
        return "Its break time! Enjoy";
      } else {
        return "Relax :)";
      }
    }
  };

  let textToShow = handleDisplay();
  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>{textToShow}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  textStyle: {
    fontSize: 32,
  },
});

export default PomodoroTimerHeader;

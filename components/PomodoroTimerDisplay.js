// import React in our code
import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const PomodoroTimerDisplay = (props) => {
  //console.log('Received in display :', props.time);
  let runTime = props.time;
  let totalTime = 300;
  let fill = (runTime / totalTime) * 100;
  console.log(runTime);
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={220}
        width={25}
        fill={fill}
        tintColor="#f00"
        lineCap="round"
        rotation={0}
        // onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875"
      >
        {() => (
          <Text style={styles.textStyle}>
            {Math.floor(props.time / 60)
              .toString()
              .padStart(2, "0") +
              ":" +
              (props.time % 60).toString().padStart(2, "0")}
          </Text>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: {
    fontSize: 56,
    fontWeight: "600",
  },
});

export default PomodoroTimerDisplay;

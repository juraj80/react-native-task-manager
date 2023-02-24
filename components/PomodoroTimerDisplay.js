// import React in our code
import { setAutoServerRegistrationEnabledAsync } from "expo-notifications";
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
        size={240}
        width={20}
        fill={fill}
        tintColor="#9acd32"
        lineCap="round"
        rotation={0}
        // onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#454545"
      >
        {() => (
          <View style={styles.innerCircle}>
            <Text style={styles.textStyle}>
              {Math.floor(props.time / 60)
                .toString()
                .padStart(2, "0") +
                ":" +
                (props.time % 60).toString().padStart(2, "0")}
            </Text>
          </View>
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
    color: "#454545",
    paddingHorizontal: 20,
  },
  innerCircle: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, .70)",

    width: "100%",
    alignItems: "center",
  },
});

export default PomodoroTimerDisplay;

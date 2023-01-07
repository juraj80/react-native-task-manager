// import React in our code
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Vibration,
} from "react-native";
import PomodoroTimerDisplay from "./PomodoroTimerDisplay";
import PomodoroTimerHeader from "./PomodoroTimerHeader";
import PomodoroTimerButtons from "./PomodoroTimerButtons";

const PomodoroTimer = (props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState(0);
  const [time, setTime] = useState(props.period * 60);

  // gets called when a stream of new props arrive to the component

  useEffect(() => {
    setIsRunning(false);
    setTime(props.period * 60);
    if (isRunning && time == 0) {
      handlePlay();
    }
  }, [props.period]);

  // invoked immediately after update occurs

  useEffect(() => {
    if (isRunning && time == 0) {
      clearInterval(timerId);
      Vibration.vibrate([500, 500, 500]);
      props.onComplete();
    } else if (!isRunning) {
      clearInterval(timerId);
    }
  }, [isRunning, time]);

  // triggers when play button is pressed
  const handlePlay = () => {
    console.log("handle play is called");
    setIsRunning(true);

    const timerID = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);
    console.log("timerID :", timerID);
    setTimerId(timerID);
  };

  const handlePause = () => {
    clearInterval(timerId);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(timerId);
    setIsRunning(false);
    setTime(props.period * 60);
  };

  return (
    <View style={styles.container}>
      {/* <Text>This is Pomodoro Timer :{time}</Text>
			{console.log('Time :', time)} */}
      <View style={styles.headerStyle}>
        <PomodoroTimerHeader
          isRunning={isRunning}
          intervalType={props.intervalType}
        ></PomodoroTimerHeader>
      </View>
      <View style={styles.displayStyle}>
        <PomodoroTimerDisplay time={time}></PomodoroTimerDisplay>
      </View>
      <View style={styles.buttonsStyle}>
        <PomodoroTimerButtons
          style={styles.buttonsStyle}
          play={handlePlay}
          pause={handlePause}
          reset={handleReset}
          isRunning={isRunning}
        ></PomodoroTimerButtons>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: 'orange',
  },
  headerStyle: {
    flex: 1,
    width: "100%",
    // backgroundColor: 'lightgreen',
    alignItems: "center",
  },
  displayStyle: {
    flex: 5,
    width: "100%",
    // backgroundColor: 'brown',
    alignItems: "center",
  },
  buttonsStyle: {
    flex: 1,
    width: "100%",
    // backgroundColor: 'yellow',
  },
});

export default PomodoroTimer;

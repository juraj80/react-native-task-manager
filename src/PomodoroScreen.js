import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import React, { useState } from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import HeaderComponent from "../components/HeaderComponent";
import { Audio } from "expo-av";

const image = require("../assets/pomodoro.png");

const PomodoroScreen = () => {
  const [intervalType, setIntervalType] = useState("Working");
  const [workTime, setWorkTime] = useState(5);
  const [breakTime, setBreakTime] = useState(1);
  const [sound, setSound] = useState();

  const handleTimeCompleted = () => {
    if (intervalType === "Working") {
      setIntervalType("Break");
    } else {
      setIntervalType("Working");
    }
  };

  const enableAudio = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: false,
    });
  };

  async function playSound() {
    // await Audio.requestPermissionsAsync();
    // await Audio.setAudioModeAsync({
    //   staysActiveInBackground: true,
    //   shouldDuckAndroid: false,
    //   playThroughEarpieceAndroid: false,
    //   allowsRecordingIOS: false,
    //   playsInSilentModeIOS: true,
    // });
    if (Platform.OS === "ios") {
      await enableAudio();
    }

    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/brownNoise.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  function stopSound() {
    setSound(null);
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
      // playSound();
      return workTime;
    } else {
      // stopSound();
      return breakTime;
    }
  };

  let time = handleTime();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={image}
        resizeMode="contain"
        style={styles.image}
        imageStyle={{ opacity: 0.7 }}
      >
        <View style={styles.screenWrapper}>
          {/* <View style={styles.headerSection}>
        <Text style={styles.screenTitle}>My Timer</Text>
      </View> */}
          <HeaderComponent title={"My Timer"} menu={true} color={"black"} />
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
          <View style={styles.timerStyle}>
            <PomodoroTimer
              intervalType={intervalType}
              onComplete={handleTimeCompleted}
              period={time}
              playSound={playSound}
              stopSound={stopSound}
            ></PomodoroTimer>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },

  image: {
    flex: 1,
    // position: "relative",
    justifyContent: "flex-end",

    // position: "absolute",

    width: "100%",
    // height: "100%",
  },
  screenWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    // flexDirection: "column",
  },
  row: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
    // backgroundColor: "green",
  },

  timerStyle: { flex: 10 },

  inputField: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputStyle: {
    height: 60,
    width: "40%",
    // borderRadius: 50,
    color: "black",
    fontSize: 20,
    textAlign: "center",
    // backgroundColor: "rgba(62,62, 62, 0.6)",
    // borderWidth: 2,
    borderBottomWidth: 2,
    padding: 10,
  },
  inputHeading: {
    fontSize: 20,
    padding: 5,
  },
});

export default PomodoroScreen;

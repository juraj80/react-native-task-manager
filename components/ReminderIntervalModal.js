import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import ReminderIntervalPicker from "./ReminderIntervalPicker";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full width
// Start of MyModal component

const ReminderIntervalModal = ({
  isVisible,
  setIsVisible,
  taskRepeatData,
  setTaskRepeatData,
}) => {
  const [interval, setInterval] = useState({});

  const chooseInterval = (intervalObj) => {
    console.log("received value from intervalPicker", intervalObj);
    // setInterval(intervalObj);
    setTaskRepeatData(intervalObj);
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        // setModalVisible(!modalVisible);
        setIsVisible(!isVisible);
      }}
    >
      <TouchableWithoutFeedback
        // onPress={() => setModalVisible(!modalVisible)}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        {/* <View style={styles.centeredView}> */}
        <View style={styles.modalView}>
          <ReminderIntervalPicker
            taskRepeatData={taskRepeatData}
            chooseInterval={chooseInterval}
          />

          {/* <Pressable
                  style={[styles.buttonModal, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable> */}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReminderIntervalModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    // margin: 20,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 25,
    width: width,
    height: height / 3,
    alignItems: "left",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInputSection: {
    flex: 3,
  },
  modalBtnSection: {
    flexDirection: "row",
    paddingVertical: 10,
    // justifyContent: "space-between",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  textStyle: {
    color: "black",
    // fontWeight: "bold",
    textAlign: "center",
  },
  buttonModal: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 2,
    marginHorizontal: 20,
    marginTop: 10,
    width: width / 4.8,
    // backgroundColor: "rgb(102, 204, 153)",
    borderWidth: 1,
    opacity: 0.7,
  },
  iconWrap: {
    flex: 1,
    backgroundColor: "lightgrey",
    margin: 3,
    alignItems: "center",
  },

  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

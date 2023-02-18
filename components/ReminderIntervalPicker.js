import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const ReminderIntervalPicker = ({ chooseInterval, taskRepeatData }) => {
  console.log("Rendering ReminderIntervalPicker with props", taskRepeatData);
  const [dayInterval, setDayInterval] = useState(taskRepeatData.dayInterval);
  const [weekInterval, setWeekInterval] = useState(taskRepeatData.weekInterval);
  const [monthInterval, setMonthInterval] = useState(
    taskRepeatData.monthInterval
  );

  const onConfirm = () => {
    // You can use the selected day interval here to set the repeat functionality for the reminder.
    console.log(`Day Interval: ${dayInterval}`);
    console.log(`Week Interval: ${weekInterval}`);
    console.log(`Month Interval: ${monthInterval}`);
    chooseInterval({ dayInterval, weekInterval, monthInterval });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalHeading}>Repeat every:</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.dayPickerContainer}>
          <Picker
            selectedValue={monthInterval}
            onValueChange={(value) => setMonthInterval(value)}
            itemStyle={styles.itemStyle}
          >
            {[...Array(12)].map((_, index) => {
              const label = index === 1 ? "1 Month" : `${index} Months`;
              return <Picker.Item key={index} label={label} value={index} />;
            })}
          </Picker>
        </View>
        <View style={styles.dayPickerContainer}>
          <Picker
            selectedValue={weekInterval}
            onValueChange={(value) => setWeekInterval(value)}
            itemStyle={styles.itemStyle}
          >
            {[...Array(4)].map((_, index) => {
              const label = index === 1 ? "1 Week" : `${index} Weeks`;
              return <Picker.Item key={index} label={label} value={index} />;
            })}
          </Picker>
        </View>
        <View style={styles.dayPickerContainer}>
          <Picker
            selectedValue={dayInterval}
            onValueChange={(value) => setDayInterval(value)}
            itemStyle={styles.itemStyle}
          >
            {[...Array(24)].map((_, index) => {
              const label = index === 1 ? "1 Day" : `${index} Days`;
              return <Picker.Item key={index} label={label} value={index} />;
            })}
          </Picker>
        </View>
      </View>
      <Button title="Confirm" onPress={onConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
  },
  pickerContainer: {
    flexDirection: "row",
  },
  dayPickerContainer: {
    flex: 1,
    // backgroundColor: "yellow",
  },
  itemStyle: {
    fontSize: 16,
  },
  modalHeading: {
    fontSize: 22,
  },
});

export default ReminderIntervalPicker;

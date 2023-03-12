import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const ReminderIntervalPicker = ({ chooseInterval, taskRepeatData }) => {
  const [dayInterval, setDayInterval] = useState(taskRepeatData.dayInterval);
  const [weekInterval, setWeekInterval] = useState(taskRepeatData.weekInterval);
  const [monthInterval, setMonthInterval] = useState(
    taskRepeatData.monthInterval
  );

  const [repeatInterval, setRepeatInterval] = useState();

  const onConfirm = () => {
    // You can use the selected day interval here to set the repeat functionality for the reminder.
    chooseInterval({ repeat: repeatInterval });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalHeading}>Repeat every:</Text>
      <View style={styles.pickerContainer}>
        <View style={styles.dayPickerContainer}>
          <Picker
            selectedValue={repeatInterval}
            onValueChange={(value) => setRepeatInterval(value)}
            itemStyle={styles.itemStyle}
          >
            {["None", "Daily", "Weekly", "Monthly", " Yearly"].map(
              (item, index) => {
                return <Picker.Item key={index} label={item} value={index} />;
              }
            )}
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

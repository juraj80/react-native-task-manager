import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";

const HorizontalTimeline = (props) => {
  const [index, setIndex] = useState(0);
  const [ref, setRef] = useState(null);
  const [days, setDays] = useState([]);

  useEffect(() => {
    const date = new Date(props.date);
    const timelineDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const keys = props.data ? Object.keys(props.data) : null;
    let days = [];
    if (keys) {
      for (let i = 1; i <= Number(timelineDate.getDate()); i += 1) {
        if (props.data[i]) {
          days.push({
            date: i,
            currentDate: new Date(date.getFullYear(), date.getMonth(), i),
            marked: props.data[i].marked,
            info: props.data[i].info ? props.data[i].info : null,
          });
        } else {
          days.push({
            date: i,
            currentDate: new Date(date.getFullYear(), date.getMonth(), i),
          });
        }
      }
    } else {
      for (let i = 1; i <= Number(timelineDate.getDate()); i += 1) {
        days.push({
          date: i,
          currentDate: new Date(date.getFullYear(), date.getMonth(), i),
        });
      }
    }
    setDays(days);
    scrollToDay(getIndex(days));
  }, [props.data]);

  const getDayOfTheWeek = (day) => {
    switch (day) {
      case 0:
        return "Sun";
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      default:
        return "";
    }
  };
  function scrollToDay(itemIndex) {
    ref?.scrollTo({ x: itemIndex * 62 }); //TODO replace with the width of the day view
  }

  const isToday = (day) => {
    if (day.currentDate.getDate() == new Date().getDate()) {
      return true;
    }
    return false;
  };

  // const getIndex = (arr) => {
  //   arr.map((d, i) => (isToday(d) ? setIndex(i) : null));
  // };

  // const getIndex = (arr) => {
  //   let result = null;
  //   arr.map((d, i) => {
  //     if (isToday(d)) {
  //       result = i;
  //     }
  //   });

  //   return result;
  // };

  const getIndex = (arr) => {
    return arr.findIndex((d) => isToday(d));
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ height: 50 }}
      ref={(ref) => setRef(ref)}
    >
      {days &&
        days.map((d, index) => (
          <TouchableOpacity
            key={index}
            disabled={!d.marked && !isToday(d)}
            onPress={() => props.onPress(d.currentDate)}
          >
            <View
              key={`col${d.date}`}
              style={[
                !d.marked ? styles.day : styles.dayElevated,
                styles.shadow,
              ]}
            >
              <View
                style={[
                  d.marked
                    ? styles.textContainerElevated
                    : isToday(d)
                    ? styles.textContainerGreen
                    : styles.textContainerBlue,
                  styles.textContainer,
                ]}
              >
                <Text style={[styles.title]}>{`${d.date}`}</Text>
                <Text style={[styles.subTitle]}>
                  {`${getDayOfTheWeek(d.currentDate.getDay())}`}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
};

HorizontalTimeline.propTypes = {
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  date: PropTypes.string.isRequired,
  data: PropTypes.object,
  height: PropTypes.number,
  width: PropTypes.number,
};

HorizontalTimeline.defaultProps = {
  backgroundColor: "white",
  data: null,
  height: 50,
  color: "white",
  // color: "#4169E1",
  width: 80,
};

const styles = StyleSheet.create({
  day: {
    borderColor: "white",
    paddingTop: 10,
    width: 72,
    marginHorizontal: 2,
    opacity: 1,
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

  dayElevated: {
    borderColor: "white",
    elevation: 2,
    paddingTop: 10,
    width: 80,
    opacity: 1,
    marginHorizontal: 2,
  },
  textContainer: {
    flexDirection: "row",

    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 7,
  },
  textContainerBlue: {
    backgroundColor: "#efeff0",
  },
  textContainerElevated: {
    backgroundColor: "#fbc093",
  },
  textContainerGreen: {
    backgroundColor: "#b2de27",
  },
  title: {
    fontSize: 15,
    flex: 2,
    textAlign: "center",
    color: "black",
  },
  subTitle: {
    fontSize: 15,
    flex: 3,
    textAlign: "center",
    color: "lightblack",
  },
  dotImage: {
    position: "absolute",
    width: 18,
    height: 18,
    zIndex: 99,
    left: 30,
    bottom: 0,
  },
});

export default HorizontalTimeline;

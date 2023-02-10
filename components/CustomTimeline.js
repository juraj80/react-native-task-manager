/* eslint-disable global-require, react/forbid-prop-types */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getDayOfTheWeek"] }] */
import React, { Component } from "react";
import { StyleSheet, Image, ScrollView, Text, View } from "react-native";
import PropTypes from "prop-types";

class HorizontalTimeline extends Component {
  constructor(props) {
    super(props);

    const date = new Date(props.date);
    const timelineDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const keys = props.data ? Object.keys(props.data) : null;

    // this.renderDays = this.renderDays.bind(this);
    // this.renderDotImage = this.renderDotImage.bind(this);
    const days = [];

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
    // const days = parseActiveDays(props);
    this.state = { days };
  }

  getDayOfTheWeek(day) {
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
  }

  renderDotImage(day) {
    // if (day.marked) {
    if (day.currentDate.getDate() == new Date().getDate()) {
      const { width, height } = this.props;
      return (
        <Image
          source={require("../assets/dot_blue.png")}
          // style={[styles.dotImage, { left: width / 2, top: height / 2 }]}
          style={[styles.dotImage]}
        />
      );
    }
    return null;
  }

  isToday(day) {
    if (day.currentDate.getDate() == new Date().getDate()) {
      return true;
    }
    return false;
  }

  renderDays() {
    const { width, backgroundColor, color } = this.props;

    const days = this.state.days.map((d) => (
      <View
        key={`col${d.date}`}
        // style={[!d.marked ? styles.day : styles.dayElevated, { width }]}
        style={[!d.marked ? styles.day : styles.dayElevated, styles.shadow]}
      >
        {/* <View style={[styles.dayUpper, { backgroundColor }]}> */}
        {/* <View style={styles.textContainer}> */}
        <View
          style={[
            d.marked
              ? styles.textContainerElevated
              : this.isToday(d)
              ? styles.textContainerGreen
              : styles.textContainerBlue,
            styles.textContainer,
          ]}
        >
          {/* <Text style={[styles.title, { color }]}>{`${d.date}`}</Text> */}
          <Text style={[styles.title]}>{`${d.date}`}</Text>
          {/* <Text style={[styles.subTitle, { color }]}> */}
          <Text style={[styles.subTitle]}>
            {`${this.getDayOfTheWeek(d.currentDate.getDay())}`}
          </Text>
        </View>
        {/* </View> */}

        {/* {this.renderDotImage(d)} */}
        {/* <View style={styles.lineContainer} /> */}

        {/* <View style={[styles.dayBottom, { backgroundColor }]}>
          <Text style={[styles.dayInfo, { color }]}>
            {d.info ? d.info.slice(0, 40) : ''}
          </Text>
        </View> */}
      </View>
    ));
    return days;
  }

  static getDerivedStateFromProps(props, state) {
    const date = new Date(props.date);

    const timelineDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    // console.log("PROPS", props.data);
    const keys = props.data ? Object.keys(props.data) : null;

    // this.renderDays = this.renderDays.bind(this);
    // this.renderDotImage = this.renderDotImage.bind(this);
    const days = [];

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
    // this.state = { days };
    return { days };
  }

  render() {
    const { height } = this.props;

    return (
      <ScrollView horizontal contentContainerStyle={{ height }}>
        {this.renderDays()}
      </ScrollView>
    );
  }
}

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

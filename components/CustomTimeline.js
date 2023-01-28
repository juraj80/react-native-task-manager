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
        style={[!d.marked ? styles.day : styles.dayElevated]}
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
    // backgroundColor: "red",
    // borderWidth: 2,
    // backgroundColor: "lightgray",
    borderColor: "white",
    paddingTop: 10,
    width: 80,
    marginHorizontal: 5,
  },
  dayElevated: {
    // backgroundColor: "lightblue",
    borderColor: "white",
    // borderWidth: 1,
    // borderRadius: 10,
    // borderWidth: 2,

    elevation: 2,
    paddingTop: 10,
    width: 80,

    // marginVertical: 5,
    marginHorizontal: 5,
    // shadowOffset: { width: 1, height: 2 },
    // shadowColor: "#000000",
    // shadowRadius: 3,
    // shadowOpacity: 0.3,
  },
  // dayUpper: {
  //   flex: 1,
  //   flexDirection: "row",
  //   backgroundColor: "yellow",
  // },
  // dayBottom: {
  //   flex: 1,
  //   flexDirection: "column",
  //   justifyContent: "center",
  //   backgroundColor: "yellow",
  // },
  // lineContainer: {
  //   height: 3,
  //   // borderTopWidth: 3,
  //   borderColor: "white",
  //   marginTop: 10,
  // },
  textContainer: {
    flexDirection: "row",

    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    // borderWidth: 2,
  },

  textContainerBlue: {
    // flexDirection: "row",
    // // alignSelf: "center",
    // alignItems: "center",
    // padding: 5,
    backgroundColor: "#6495ED",
  },
  textContainerElevated: {
    // flexDirection: "row",
    // // alignSelf: "center",
    // alignItems: "center",
    // padding: 5,
    backgroundColor: "red",
  },
  textContainerGreen: {
    // flexDirection: "row",
    // // alignSelf: "center",
    // alignItems: "center",
    // padding: 5,
    backgroundColor: "green",
  },
  title: {
    fontSize: 15,
    flex: 1,
    // alignSelf: "center",
    textAlign: "center",
    // marginRight: 4,
    // marginTop: 0,
    // color: "#6699CC",
    color: "white",
    // backgroundColor: "black",
  },
  subTitle: {
    fontSize: 15,
    flex: 1,
    textAlign: "left",
    // alignSelf: "flex-st",
    // color: "#6699CC",
    color: "white",
  },
  // dayInfo: {
  //   fontSize: 14,
  //   alignSelf: "center",
  //   backgroundColor: "red",
  // },
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

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../../firebaseConfig";
import HeaderComponent from "../components/HeaderComponent";
import MyDayActions from "../MyDayActions";

describe("MyDayActions component", () => {
  it("renders correctly", () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const route = {
      params: {
        heading: "Test Heading",
      },
    };

    const tree = renderer
      .create(<MyDayActions route={route} navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("handles delete task correctly", () => {
    const deleteTaskFromDB = jest.fn();

    const navigation = {
      navigate: jest.fn(),
    };

    const route = {
      params: {
        heading: "Test Heading",
      },
    };

    const component = shallow(
      <MyDayActions
        route={route}
        navigation={navigation}
        deleteTaskFromDB={deleteTaskFromDB}
      />
    );

    component.instance().deleteTask({ id: "123" });
    expect(deleteTaskFromDB).toHaveBeenCalledWith("123");
  });

  it("handles handleChange correctly", () => {
    const navigation = {
      navigate: jest.fn(),
    };

    const route = {
      params: {
        heading: "Test Heading",
      },
    };

    const component = shallow(
      <MyDayActions route={route} navigation={navigation} />
    );

    component.setState({
      allTasks: [
        {
          id: "123",
          completed: false,
        },
      ],
    });

    component.instance().handleChange("123");
    expect(component.state("allTasks")).toEqual([
      {
        id: "123",
        completed: true,
      },
    ]);
  });
});

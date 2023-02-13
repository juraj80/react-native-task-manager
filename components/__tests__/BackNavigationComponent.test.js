import React from "react";
import { BackHandler, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { render, fireEvent, cleanup } from "@testing-library/react-native";
import BackNavigationComponent from "../BackNavigationComponent";

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn().mockReturnValue({
      goBack: jest.fn(),
    }),
  };
});

describe("BackNavigationComponent", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const { getByTestId } = render(<BackNavigationComponent />);
    const view = getByTestId("back-navigation-view");
    const touchableOpacity = getByTestId("back-navigation-button");
    const text = getByTestId("back-navigation-text");

    expect(view).toBeTruthy();
    expect(touchableOpacity).toBeTruthy();
    expect(text).toBeTruthy();
  });

  it("should call navigation.goBack when the touchable opacity is pressed", () => {
    const { getByTestId } = render(<BackNavigationComponent />);
    const touchableOpacity = getByTestId("back-navigation-button");
    fireEvent.press(touchableOpacity);
    expect(useNavigation().goBack).toHaveBeenCalled();
  });
});

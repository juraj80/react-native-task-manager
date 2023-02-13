import React from "react";
import renderer from "react-test-renderer";
import HeaderComponent from "../HeaderComponent";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View } from "react-native";

const Stack = createStackNavigator();

const TestNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TestPage"
      component={() => (
        <View>
          <HeaderComponent title="Test Page" menu />
        </View>
      )}
    />
  </Stack.Navigator>
);

it("renders with title and back navigation", () => {
  const tree = renderer
    .create(
      <NavigationContainer>
        <TestNavigator />
      </NavigationContainer>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders with title and menu navigation", () => {
  const tree = renderer
    .create(<HeaderComponent title="Test Page" menu />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it("renders with only title", () => {
  const tree = renderer.create(<HeaderComponent title="Test Page" />).toJSON();
  expect(tree).toMatchSnapshot();
});

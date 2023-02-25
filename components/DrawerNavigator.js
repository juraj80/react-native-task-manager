import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BrainMapScreen from "../src/BrainMapScreen";
import TaskList from "../src/TaskListScreen";
import TaskListCompleted from "../src/TaskListCompletedScreen";
import PomodoroTimer from "../src/PomodoroScreen";
import SettingsScreen from "../src/SettingsScreen";
import MyDayActions from "../src/MyDayActionsScreen";
import CustomDrawer from "./CustomDrawer";

import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="My Scribbles"
      screenOptions={{
        drawerActiveBackgroundColor: "lightgrey",
        drawerActiveTintColor: "black",
        drawerLabelStyle: {
          fontFamily: "Lato-Regular",
          fontSize: 16,
          marginLeft: -25,
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="My Scribbles"
        component={BrainMapScreen}
        options={{
          headerMode: "none",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="notebook-edit-outline"
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="My Actions"
        component={TaskList}
        options={{
          headerMode: "none",
          headerShown: false,
          drawerIcon: ({ color }) => (
            // <Ionicons name="home" size={22} color={color} />
            <FontAwesome5 name="tasks" size={22} color={color} />
          ),
        }}
        initialParams={{ heading: null }}
      />
      <Drawer.Screen
        name="My Day"
        component={MyDayActions}
        initialParams={{ heading: null }}
        options={{
          headerMode: "none",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="today-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Pomodoro"
        component={PomodoroTimer}
        options={{
          headerMode: "none",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="timer-outline" size={22} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen name="Animation" component={AnimationExample} />
      <Drawer.Screen name="Draggable" component={DraggableExample} /> */}
      <Drawer.Screen
        name="Finished To-Dos"
        component={TaskListCompleted}
        initialParams={{ heading: null }}
        options={{
          headerMode: "none",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-done" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen name="Task Detail" component={TaskDetail} /> */}
    </Drawer.Navigator>
  );
};
export default AppDrawerNavigator;

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BrainMapScreen from "../src/BrainMapScreen";
import TaskList from "../src/TaskListScreen";
import TaskListCompleted from "../src/TaskListCompletedScreen";
import PomodoroTimer from "../src/PomodoroScreen";
import SettingsScreen from "../src/SettingsScreen";
import MyDayActions from "../src/MyDayActionsScreen";

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="My Scribbles">
      <Drawer.Screen
        name="My Scribbles"
        component={BrainMapScreen}
        options={{ headerMode: "none", headerShown: false }}
      />
      <Drawer.Screen
        name="My Actions"
        component={TaskList}
        options={{ headerMode: "none", headerShown: false }}
        initialParams={{ heading: null }}
      />
      <Drawer.Screen
        name="My Day"
        component={MyDayActions}
        initialParams={{ heading: null }}
        options={{ headerMode: "none", headerShown: false }}
      />
      <Drawer.Screen
        name="Pomodoro"
        component={PomodoroTimer}
        options={{ headerMode: "none", headerShown: false }}
      />
      {/* <Drawer.Screen name="Animation" component={AnimationExample} />
      <Drawer.Screen name="Draggable" component={DraggableExample} /> */}
      <Drawer.Screen
        name="Finished To-Dos"
        component={TaskListCompleted}
        initialParams={{ heading: null }}
        options={{ headerMode: "none", headerShown: false }}
      />

      <Drawer.Screen name="Settings" component={SettingsScreen} />
      {/* <Drawer.Screen name="Task Detail" component={TaskDetail} /> */}
    </Drawer.Navigator>
  );
};
export default AppDrawerNavigator;

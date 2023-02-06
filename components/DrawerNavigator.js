import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BrainMapScreen from "../src/BrainMapScreen";
import TaskList from "../src/TaskListScreen";
import TaskListCompleted from "../src/TaskListCompletedScreen";
import PomodoroTimer from "../src/PomodoroScreen";
import AnimationExample from "../src/AnimationExample";
import DraggableExample from "../src/DraggableExample";

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
      <Drawer.Screen name="Pomodoro" component={PomodoroTimer} />
      {/* <Drawer.Screen name="Animation" component={AnimationExample} />
      <Drawer.Screen name="Draggable" component={DraggableExample} /> */}
      <Drawer.Screen
        name="Finished To-Dos"
        component={TaskListCompleted}
        initialParams={{ heading: null }}
      />
      {/* <Drawer.Screen name="Task Detail" component={TaskDetail} /> */}
    </Drawer.Navigator>
  );
};
export default AppDrawerNavigator;

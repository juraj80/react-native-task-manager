import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BrainMapScreen from "../src/BrainMapScreen";
import TaskList from "../src/TaskListScreen";
import PomodoroTimer from "../src/PomodoroScreen";
import AnimationExample from "../src/AnimationExample";
import DraggableExample from "../src/DraggableExample";

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Brain Map">
      <Drawer.Screen
        name="Notes"
        component={BrainMapScreen}
        options={{ headerMode: "none", headerShown: false }}
      />
      <Drawer.Screen
        name="Tasks"
        component={TaskList}
        options={{ headerMode: "none", headerShown: false }}
      />
      <Drawer.Screen name="Pomodoro" component={PomodoroTimer} />
      {/* <Drawer.Screen name="Animation" component={AnimationExample} />
      <Drawer.Screen name="Draggable" component={DraggableExample} /> */}

      {/* <Drawer.Screen name="Create Note" component={CreateNote} />
      <Drawer.Screen name="Create Task" component={CreateTask} />
      <Drawer.Screen name="Task Detail" component={TaskDetail} /> */}
    </Drawer.Navigator>
  );
};
export default AppDrawerNavigator;

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import BrainMapScreen from "../src/BrainMapScreen";
import TaskList from "../src/TaskListScreen";

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Brain Map">
      <Drawer.Screen name="Brain Map" component={BrainMapScreen} />
      <Drawer.Screen name="Task List" component={TaskList} />
      {/* <Drawer.Screen name="Create Note" component={CreateNote} />
      <Drawer.Screen name="Create Task" component={CreateTask} />
      <Drawer.Screen name="Task Detail" component={TaskDetail} /> */}
    </Drawer.Navigator>
  );
};
export default AppDrawerNavigator;

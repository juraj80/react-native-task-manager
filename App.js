import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import TaskList from "./src/TaskListScreen";
import BrainMapScreen from "./src/BrainMapScreen";
import CreateNote from "./src/CreateNote";
import CreateTask from "./src/CreateTask";
import TaskDetail from "./src/TaskDetailScreen";
import { createStackNavigator } from "@react-navigation/stack";

import AppDrawerNavigator from "./components/DrawerNavigator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="drawer"
          component={AppDrawerNavigator}
          headerShown={false}
          options={{ headerMode: "none", headerShown: false }}
        />
        <Stack.Screen name="Create Note" component={CreateNote} />
        <Stack.Screen name="Create Task" component={CreateTask} />
        <Stack.Screen name="Task Detail" component={TaskDetail} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

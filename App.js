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
import NoteDetail from "./src/NoteDetailScreen";
import LoginScreen from "./src/LoginScreen";
import { createStackNavigator } from "@react-navigation/stack";

import AppDrawerNavigator from "./components/DrawerNavigator";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "IndieFlower-Regular": require("./assets/fonts/IndieFlower-Regular.ttf"),
  });

  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName={"Login"}> */}
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Back"
          component={AppDrawerNavigator}
          headerShown={false}
          options={{ headerMode: "none", headerShown: false }}
        />
        <Stack.Screen name="Create Note" component={CreateNote} />
        <Stack.Screen name="Create Task" component={CreateTask} />
        <Stack.Screen
          name="Task Detail"
          component={TaskDetail}
          options={{ headerMode: "none", headerShown: false }}
        />
        <Stack.Screen name="Note Detail" component={NoteDetail} />
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

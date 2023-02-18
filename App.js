import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, LogBox } from "react-native";
import TaskList from "./src/TaskListScreen";
import BrainMapScreen from "./src/BrainMapScreen";
import CreateNote from "./src/CreateNote";
import CreateTask from "./src/CreateTask";
import TaskDetail from "./src/TaskDetailScreen";
import NoteDetail from "./src/NoteDetailScreen";
import LoginScreen from "./src/LoginScreen";
import DayDetail from "./src/DayDetailScreen";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

import AppDrawerNavigator from "./components/DrawerNavigator";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const Stack = createStackNavigator();
// disable warning messages
//console.disableYellowBox = true;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    "IndieFlower-Regular": require("./assets/fonts/IndieFlower-Regular.ttf"),
    "Lato-Light": require("./assets/fonts/Lato-Light.ttf"),
    "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
    "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
  });

  LogBox.ignoreAllLogs();
  LogBox.ignoreLogs(["Warning: ..."]);

  useEffect(() => {
    // Permissions.getAsync(Permissions.NOTIFICATIONS)
    Notifications.getPermissionsAsync()
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Notifications.requestPermissionsAsync();
          // return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return;
        }
      });
  }, []);

  const triggerNotifications = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You have got mail! 📬",
        body: "Here is the notification body",
        data: { data: "goes here" },
      },
      trigger: { seconds: 2 },
    });
  };

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
        <Stack.Screen name="Scribble Detail" component={NoteDetail} />
        <Stack.Screen
          name="Day Detail"
          component={DayDetail}
          options={{ headerMode: "none", headerShown: false }}
        />
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

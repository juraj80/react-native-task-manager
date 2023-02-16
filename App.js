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
import DayDetail from "./src/DayDetailScreen";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

import AppDrawerNavigator from "./components/DrawerNavigator";
import { useFonts } from "expo-font";
import { useEffect } from "react";

const Stack = createStackNavigator();

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
  });

  // // request the token
  // useEffect(() => {
  //   (async () => {
  //     let token; // check, is this a device or a simulator
  //     if (Constants.isDevice) {
  //       // see if we haven't already been granted access
  //       const { status: existingStatus } =
  //         await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;
  //       if (existingStatus !== "granted") {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //       }
  //       if (finalStatus !== "granted") {
  //         alert("Failed to get push token for push notification!");
  //         return;
  //       } // ask for the token
  //       token = (await Notifications.getExpoPushTokenAsync()).data;
  //     } else {
  //       alert(
  //         "You are running this app on a simulator, you must use a real device to use push notifications"
  //       );
  //     }

  //     // make modifcations to android
  //     if (Platform.OS === "android") {
  //       Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.MAX,
  //         vibrationPattern: [0, 250, 250, 250],
  //         lightColor: "#FF231F7C",
  //       });
  //     }

  //     if (token != undefined) {
  //       console.log(`Our token is ${token}`);
  //     } else {
  //       console.log(`We are unable to get the token`);
  //     }
  //   })();
  // }, []);
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
        <Stack.Screen name="Note Detail" component={NoteDetail} />
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

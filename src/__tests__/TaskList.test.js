import React from "react";
import { firebase } from "../../firebaseConfig";
import { render, fireEvent, act } from "@testing-library/react-native";

import TaskList from "../TaskListScreen";

// jest.mock("@react-navigation/native", () => ({
//   useFocusEffect: jest.fn(),
// }));

jest.mock("../../firebaseConfig", () => ({
  firebase: {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        onSnapshot: jest.fn(),
      })),
    })),
  },
}));

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(() => ({})),
  };
});

describe("TaskList component", () => {
  const route = { params: { heading: "Test Heading" } };
  const navigation = {};
  const allTasks = [
    {
      id: "task-1",
      heading: "Test Task 1",
      text: "Test Task 1 text",
      completed: false,
      subtasks: [],
    },
    {
      id: "task-2",
      heading: "Test Task 2",
      text: "Test Task 2 text",
      completed: true,
      subtasks: [],
    },
  ];
  const completeTasks = [
    {
      id: "task-2",
      heading: "Test Task 2",
      text: "Test Task 2 text",
      completed: true,
      subtasks: [],
    },
  ];
  const timelineData = {};

  const { updateTaskDB } = firebase.firestore().collection("tasks");

  beforeEach(() => {
    jest.clearAllMocks();
    firebase
      .firestore()
      .collection("tasks")
      .onSnapshot.mockImplementation((cb) =>
        cb({
          forEach: jest.fn((doc) => {
            allTasks.push(doc);
          }),
        })
      );
  });

  it("renders correctly with allTasks and completeTasks data", () => {
    const { getByText } = render(
      <TaskList route={route} navigation={navigation} />
    );

    allTasks.forEach((task) => {
      expect(getByText(task.heading)).toBeTruthy();
    });

    completeTasks.forEach((task) => {
      expect(getByText(task.heading)).toBeTruthy();
    });
  });

  it("updates task completion in database", () => {
    render(<TaskList route={route} navigation={navigation} />);

    act(() => {
      updateTaskDB(completeTasks);
    });

    expect(updateTaskDB).toHaveBeenCalledTimes(1);
    expect(updateTaskDB).toHaveBeenCalledWith(completeTasks);
  });
});

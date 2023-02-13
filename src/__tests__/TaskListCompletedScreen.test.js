import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskListCompleted from "../TaskListCompletedScreen";
import { firebase } from "../../firebaseConfig";

jest.mock("../../firebaseConfig", () => {
  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        onSnapshot: jest.fn(),
        doc: jest.fn().mockReturnValue({
          delete: jest.fn(),
        }),
      }),
    }),
  };
});

describe("TaskListCompleted component", () => {
  const mockNavigation = { navigate: jest.fn() };
  const mockRoute = { params: { heading: "Completed Tasks" } };

  it("should render correctly", () => {
    const { getByText, queryByText } = render(
      <TaskListCompleted route={mockRoute} navigation={mockNavigation} />
    );

    expect(getByText("Finished To-Dos")).toBeDefined();
    expect(queryByText("Task was deleted")).toBeNull();
  });

  it("should call deleteTaskFromDB on deleteTask", () => {
    const { getByTestId } = render(
      <TaskListCompleted route={mockRoute} navigation={mockNavigation} />
    );

    fireEvent.press(getByTestId("delete-task"));

    expect(firebase.firestore().collection().doc().delete).toHaveBeenCalled();
  });
});

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
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

  it("should render correctly", async () => {
    const { getByText, queryByText, getByTestId, queryByTestId } = render(
      <TaskListCompleted route={mockRoute} navigation={mockNavigation} />
    );

    const headerComponent = getByTestId("headerId");

    await waitFor(() =>
      expect(getByText(headerComponent, "Finished To-Dos")).toBeDefined()
    );
    await waitFor(() => expect(queryByText("Task was deleted")).toBeNull());
  });

  //   it("should call deleteTaskFromDB on deleteTask", () => {
  //     const { getByTestId } = render(
  //       <TaskListCompleted route={mockRoute} navigation={mockNavigation} />
  //     );

  //     fireEvent.press(getByTestId("delete-task"));

  //     expect(firebase.firestore().collection().doc().delete).toHaveBeenCalled();
  //   });
});

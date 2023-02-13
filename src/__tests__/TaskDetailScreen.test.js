import React from "react";
import { firebase } from "../../firebaseConfig";
import TaskDetail from "../TaskDetailScreen";
import { render, act, waitFor } from "@testing-library/react-native";
import { TouchableOpacity } from "react-native";

jest.mock("../../firebaseConfig", () => {
  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() =>
            Promise.resolve({ data: () => ({ subtasks: [] }) })
          ),
        })),
      })),
    })),
  };
});

describe("TaskDetail", () => {
  it("should render correctly", async () => {
    const navigation = { navigate: jest.fn() };
    const route = {
      params: { id: "1", heading: "Test Heading", text: "Test Text" },
    };
    const { getByText, queryByText, toJSON } = render(
      <TaskDetail navigation={navigation} route={route} />
    );

    await waitFor(() => expect(getByText("Test Heading")).toBeTruthy(), {
      timeout: 5000,
    });
    await waitFor(() => expect(getByText("Test Text")).toBeTruthy(), {
      timeout: 5000,
    });

    TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

    expect(toJSON()).toMatchSnapshot();
  });
});

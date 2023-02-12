import React from "react";
import renderer from "react-test-renderer";
import DayDetail from "../DayDetailScreen";
import { firebase } from "../../firebaseConfig";
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react-native";

jest.mock("../../firebaseConfig", () => ({
  firebase: {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        onSnapshot: jest.fn().mockImplementation((cb) => {
          cb({
            forEach: jest.fn().mockImplementation((docCb) => {
              docCb({
                id: "some-id",
                data: jest.fn().mockReturnValue({
                  heading: "task heading",
                  text: "task text",
                  completed: false,
                  subtasks: [],
                  dueDateAt: {
                    toDate: jest.fn().mockReturnValue(new Date()),
                  },
                  reminderAt: {
                    toDate: jest.fn().mockReturnValue(new Date()),
                  },
                }),
              });
            }),
          });
        }),
        doc: jest.fn().mockReturnValue({
          delete: jest.fn().mockReturnValue(Promise.resolve()),
        }),
      }),
    }),
  },
}));

jest.mock("@react-navigation/native", () => {
  return {
    ...jest.requireActual("@react-navigation/native"),
    useNavigation: jest.fn(() => ({})),
  };
});

describe("DayDetail", () => {
  it("should render correctly", () => {
    const tree = renderer
      .create(
        <DayDetail
          route={{
            params: {
              toISOString: jest
                .fn()
                .mockReturnValue("2022-01-01T12:00:00.000Z"),
            },
          }}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should call the firestore collection and onSnapshot method", () => {
    renderer.create(
      <DayDetail
        route={{
          params: {
            toISOString: jest.fn().mockReturnValue("2022-01-01T12:00:00.000Z"),
          },
        }}
      />
    );
    expect(firebase.firestore).toHaveBeenCalledWith();
    expect(firebase.firestore().collection).toHaveBeenCalledWith("tasks");
    expect(firebase.firestore().collection().onSnapshot).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });
});

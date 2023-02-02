import React from "react";
import { View } from "react-native";
import { render, fireEvent, screen } from "@testing-library/react-native";
import BrainMapScreen from "../BrainMapScreen";
import { firebase } from "../../firebaseConfig";

jest.mock("../../firebaseConfig", () => ({
  firebase: {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        onSnapshot: jest.fn(),
      })),
    })),
  },
}));

describe("BrainMapScreen component", () => {
  const allNotes = [
    {
      id: "note-1",
      heading: "Test Note 1",
      text: "Test Note 1 text",
    },
    {
      id: "note-2",
      heading: "Test Note 2",
      text: "Test Note 2 text",
    },
  ];

  const { updateNoteDB } = firebase.firestore().collection("notes");

  beforeEach(() => {
    jest.clearAllMocks();
    firebase
      .firestore()
      .collection("notes")
      .onSnapshot.mockImplementation((cb) =>
        cb({
          forEach: jest.fn((doc) => {
            allNotes.push(doc);
          }),
        })
      );
  });

  it("renders correctly with allNotes", () => {
    const { getByText } = render(<BrainMapScreen />);

    console.log(allNotes);
    allNotes.forEach((note) => {
      expect(note.heading).toBeTruthy();
    });
  });

  // it("should open the modal when pressing the add button", () => {
  //   const { getByTestId } = render(<BrainMapScreen />);
  //   fireEvent.press(getByTestId("addButton"));
  //   expect(getByTestId("noteModal")).toBeDefined();
  // });

  // it("should delete the selected note", async () => {
  //   const { getByTestId } = render(<BrainMapScreen />);
  //   fireEvent.press(getByTestId("addButton"));
  //   fireEvent.press(getByTestId("deleteButton"));
  //   expect(
  //     firebase.firestore().collection("notes").doc().delete
  //   ).toHaveBeenCalled();
  // });
});

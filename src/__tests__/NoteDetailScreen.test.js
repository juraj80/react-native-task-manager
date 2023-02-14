import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import NoteDetail from "../NoteDetailScreen";

describe("NoteDetail component", () => {
  test("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<NoteDetail />);
    expect(getByPlaceholderText("Note Header")).toBeDefined();
    expect(getByPlaceholderText("Note Detail")).toBeDefined();
    expect(getByText("Save")).toBeDefined();
  });

  test("updates note when 'Save' button is pressed", () => {
    const updateNoteMock = jest.fn();
    const { getByText } = render(<NoteDetail updateNote={updateNoteMock} />);
    fireEvent.press(getByText("Save"));
    expect(updateNoteMock).toHaveBeenCalled();
  });
});

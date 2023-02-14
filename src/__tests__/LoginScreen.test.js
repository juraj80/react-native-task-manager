import React from "react";
import { render, fireEvent, wait } from "@testing-library/react-native";
import LoginScreen from "../LoginScreen";
import { auth } from "../../firebaseConfig";

jest.mock("../../firebaseConfig", () => ({
  auth: {
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
}));

describe("LoginScreen", () => {
  it("should call createUserWithEmailAndPassword with the correct email and password when the Register button is pressed", async () => {
    const navigation = { replace: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const signUpButton = getByText("Register");

    fireEvent.changeText(emailInput, "email@example.com");
    fireEvent.changeText(passwordInput, "password");

    fireEvent.press(signUpButton);

    await wait(() => {
      expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        "email@example.com",
        "password"
      );
    });
  });

  it("should call signInWithEmailAndPassword with the correct email and password when the Login button is pressed", async () => {
    const navigation = { replace: jest.fn() };
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation} />
    );

    const emailInput = getByPlaceholderText("Email");
    const passwordInput = getByPlaceholderText("Password");
    const loginButton = getByText("Login");

    fireEvent.changeText(emailInput, "email@example.com");
    fireEvent.changeText(passwordInput, "password");

    fireEvent.press(loginButton);

    await wait(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        "email@example.com",
        "password"
      );
    });
  });
});

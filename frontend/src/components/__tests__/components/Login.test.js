import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as Router from "react-router";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../components/Login";
import { AuthContext } from "../../../hooks/useAuth";

describe("Login", () => {
  const email = "test-email";
  const password = "test-password";
  const mockError = { auth: "Auth Error" };

  const loginMock = jest.fn();

  const renderWithAuthProvider = () => {
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    const emailInput = screen.getByLabelText("email-input");
    const passwordInput = screen.getByLabelText("password-input");
    return {
      loginMock,
      emailInput,
      passwordInput,
    };
  };

  describe("Form Layout", () => {
    it("updates the email after the email field is updated", () => {
      renderWithAuthProvider(<Login />);
      const emailInput = screen.getByLabelText("email-input");
      fireEvent.change(emailInput, { target: { value: email } });

      expect(emailInput.value).toBe(email);
    });

    it("updates the password after the password field is updated", () => {
      const password = "test-password";
      renderWithAuthProvider(<Login />);
      const passwordInput = screen.getByLabelText("password-input");
      fireEvent.change(passwordInput, { target: { value: password } });

      expect(passwordInput.value).toBe(password);
    });
  });

  describe("Submit Form", () => {
    it("logs in with the user details when the submit button is clicked", () => {
      const { loginMock, emailInput, passwordInput } = renderWithAuthProvider();

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      const submitBtn = screen.getByText("Submit");
      fireEvent.click(submitBtn);

      expect(loginMock).toHaveBeenCalledWith({ email, password });
    });

    it("navigates to login if the registration is valid", async () => {
      loginMock.mockImplementation(() => ({ isValid: true }));
      const useNavigateMock = jest.fn();
      jest
        .spyOn(Router, "useNavigate")
        .mockImplementation(() => useNavigateMock);
      renderWithAuthProvider();
      const submitBtn = await screen.findByText("Submit");
      fireEvent.click(submitBtn);

      await waitFor(() => expect(useNavigateMock).toHaveBeenCalledWith("/"));
    });

    it("resets the password when the submit button is clicked and auth failed", async () => {
      loginMock.mockResolvedValue({
        isValid: false,
        errors: mockError,
      });
      const { emailInput, passwordInput } = renderWithAuthProvider();
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      const submitBtn = await screen.findByText("Submit");
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(passwordInput.value).toBeFalsy();
      });
      expect(emailInput.value).toBeTruthy();
    });

    it("adds the auth error to all form inputs if an auth error is thrown", async () => {
      loginMock.mockResolvedValue({
        isValid: false,
        errors: mockError,
      });
      const { emailInput, passwordInput } = renderWithAuthProvider();
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      const submitBtn = await screen.findByText("Submit");
      fireEvent.click(submitBtn);
      const emailError = screen.getByTestId("input-error-email");
      const passwordError = screen.getByTestId("input-error-password");

      await waitFor(() => {
        expect(emailError.innerHTML).toBe(mockError.auth);
      });

      expect(passwordError.innerHTML).toBe(mockError.auth);
    });

    it("navigates to the home route if the login was successful", async () => {
      loginMock.mockResolvedValue({
        isValid: false,
        errors: mockError,
      });
      const { emailInput, passwordInput } = renderWithAuthProvider();
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      const submitBtn = await screen.findByText("Submit");
      fireEvent.click(submitBtn);
      const emailError = screen.getByTestId("input-error-email");
      const passwordError = screen.getByTestId("input-error-password");

      await waitFor(() => {
        expect(emailError.innerHTML).toBe(mockError.auth);
      });

      expect(passwordError.innerHTML).toBe(mockError.auth);
    });
  });
});

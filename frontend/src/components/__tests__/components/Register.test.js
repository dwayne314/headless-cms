import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as Router from "react-router";
import { MemoryRouter } from "react-router-dom";
import Register from "../../../components/Register";
import { AuthContext } from "../../../hooks/useAuth";

describe("Register", () => {
  const registerMock = jest.fn();
  const renderWithAuthProvider = () => {
    render(
      <AuthContext.Provider value={{ register: registerMock }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    );
    const emailInput = screen.getByLabelText("email-input");
    const passwordInput = screen.getByLabelText("password-input");
    const firstNameInput = screen.getByLabelText("first-name-input");
    const lastNameInput = screen.getByLabelText("last-name-input");
    const submitBtn = screen.getByText("Submit");
    return {
      emailInput,
      passwordInput,
      firstNameInput,
      lastNameInput,
      submitBtn,
    };
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const email = "test-email";
  const password = "test-password";
  const firstName = "test-first-name";
  const lastName = "test-password";

  describe("Form Layout", () => {
    it("updates the email after the email field is updated", () => {
      const { emailInput } = renderWithAuthProvider();
      fireEvent.change(emailInput, { target: { value: email } });

      expect(emailInput.value).toBe(email);
    });

    it("updates the password after the password field is updated", () => {
      const { passwordInput } = renderWithAuthProvider();
      fireEvent.change(passwordInput, { target: { value: password } });

      expect(passwordInput.value).toBe(password);
    });

    it("updates the first-name after the first-name field is updated", () => {
      const { firstNameInput } = renderWithAuthProvider();
      fireEvent.change(firstNameInput, { target: { value: firstName } });

      expect(firstNameInput.value).toBe(firstName);
    });

    it("updates the last-name after the last-name field is updated", () => {
      const { lastNameInput } = renderWithAuthProvider();
      fireEvent.change(lastNameInput, { target: { value: lastName } });

      expect(lastNameInput.value).toBe(lastName);
    });
  });

  describe("Submit Form", () => {
    it("registers with the user details when the form is submitted", async () => {
      const {
        emailInput,
        passwordInput,
        firstNameInput,
        lastNameInput,
        submitBtn,
      } = renderWithAuthProvider();

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });

      fireEvent.click(submitBtn);

      await waitFor(() =>
        expect(registerMock).toHaveBeenCalledWith({
          firstName,
          lastName,
          email,
          password,
        })
      );
    });

    it("navigates to login if the registration is valid", async () => {
      registerMock.mockImplementation(() => ({ isValid: true }));
      const useNavigateMock = jest.fn();
      jest
        .spyOn(Router, "useNavigate")
        .mockImplementation(() => useNavigateMock);
      const { submitBtn } = renderWithAuthProvider();
      fireEvent.click(submitBtn);

      await waitFor(() =>
        expect(useNavigateMock).toHaveBeenCalledWith("/login")
      );
    });

    it("adds an error to a form input if the validation returns an error with a matching input id", async () => {
      const emailError = "Invalid Email Type";
      registerMock.mockImplementation(() => ({
        isValid: false,
        errors: {
          email: emailError,
        },
      }));
      const { submitBtn } = renderWithAuthProvider();
      fireEvent.click(submitBtn);
      const componentError = screen.getByTestId("input-error-email");

      await waitFor(() => expect(componentError.innerHTML).toBe(emailError));
    });

    it("resets the form when the submit button is clicked", async () => {
      const {
        emailInput,
        passwordInput,
        firstNameInput,
        lastNameInput,
        submitBtn,
      } = renderWithAuthProvider();

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.click(submitBtn);

      await waitFor(() => expect(emailInput.value).toBe(""));
      await waitFor(() => expect(passwordInput.value).toBe(""));
      await waitFor(() => expect(firstNameInput.value).toBe(""));
      await waitFor(() => expect(lastNameInput.value).toBe(""));
    });
  });
});

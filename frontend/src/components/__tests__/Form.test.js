import { render, screen, fireEvent } from "@testing-library/react";
import Form, { createFormInputs } from "../Form";

describe("Form", () => {
  describe("Form", () => {
    it("displays the supplied form inputs", () => {
      const mockInput = <div data-testid="test-input">Input</div>;
      render(<Form formInputs={mockInput} />);
      const renderedFormInput = screen.getByTestId("test-input");
      expect(renderedFormInput).toBeTruthy();
    });

    it("calls the onSubmit function when the form button is clicked", () => {
      const mockSubmit = jest.fn((e) => e.preventDefault());
      render(<Form onSubmit={mockSubmit} />);
      const submitBtn = screen.getByText("Submit");
      fireEvent.click(submitBtn);
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });
  });
  describe("createFormInputs", () => {
    const mockEmailId = "email";
    const mockEmailLabel = "email-label";
    const mockEmailValue = "email-value";
    const mockEmailError = undefined;
    const mockEmailUpdateFunc = jest.fn();

    const mockFormInputs = [
      {
        id: mockEmailId,
        label: mockEmailLabel,
        value: mockEmailValue,
        error: mockEmailError,
        updateFunc: mockEmailUpdateFunc,
      },
      {
        id: "password",
        label: "Password",
        value: "password",
        error: undefined,
        updateFunc: jest.fn(),
      },
    ];

    it("creates one form input if passed an object", () => {
      const formInput = createFormInputs({ ...mockFormInputs[0] });
      render(formInput);
      const renderedInputs = screen.getAllByLabelText("input", {
        exact: false,
      });

      expect(renderedInputs.length).toBe(1);
    });

    it("creates a form input for every input object if passed an array", () => {
      const formInput = createFormInputs([...mockFormInputs]);
      render(formInput);
      const renderedInputs = screen.getAllByLabelText("input", {
        exact: false,
      });

      expect(renderedInputs.length).toBe(mockFormInputs.length);
    });

    it("passes the input object id to the input", () => {
      const testInputId = "test-id";
      const mockFormInputConfig = Object.assign(mockFormInputs[0], {
        id: testInputId,
      });
      const formInput = createFormInputs({ ...mockFormInputConfig });
      render(formInput);
      const inputId = screen.getByLabelText("input", { exact: false }).id;

      expect(inputId).toBe(testInputId);
    });

    it("creates a label for the input", () => {
      const testInputLabel = "test-label";
      const mockFormInputConfig = Object.assign(mockFormInputs[0], {
        label: testInputLabel,
      });
      const formInput = createFormInputs({ ...mockFormInputConfig });
      render(formInput);
      const inputLabel = screen.getByTestId("input-label", { exact: false });

      expect(inputLabel.innerHTML).toBe(testInputLabel);
    });

    it("creates a text input if no inputType is defined", () => {
      const mockFormInputConfig = Object.assign(mockFormInputs[0], {
        inputType: undefined,
      });
      const formInput = createFormInputs({ ...mockFormInputConfig });
      render(formInput);
      const inputType = screen.getByLabelText("input", { exact: false }).type;

      expect(inputType).toBe("text");
    });

    it("passes the inputType to the input if defined", () => {
      const mockFormInputConfig = Object.assign(mockFormInputs[0], {
        inputType: "password",
      });
      const formInput = createFormInputs(mockFormInputConfig);
      render(formInput);
      const inputType = screen.getByLabelText("input", { exact: false }).type;

      expect(inputType).toBe("password");
    });

    it("passes the input object value to the input", () => {
      const testValue = "email@email.com";
      const mockFormInput = Object.assign(mockFormInputs[0], {
        value: testValue,
      });
      const formInput = createFormInputs(mockFormInput);
      render(formInput);
      const inputValue = screen.getByLabelText("input", { exact: false }).value;

      expect(inputValue).toBe(testValue);
    });

    it("passes the input object error the input", () => {
      const testError = "This email is not valid";
      const mockFormInput = Object.assign(mockFormInputs[0], {
        error: testError,
      });
      const formInput = createFormInputs(mockFormInput);
      render(formInput);
      const inputValue = screen.getByTestId("input-error", {
        exact: false,
      }).innerHTML;

      expect(inputValue).toBe(testError);
    });

    it("calls the update function when the input value is changed", () => {
      const mockUpdateFunc = jest.fn();
      const mockFormInput = Object.assign(mockFormInputs[0], {
        updateFunc: mockUpdateFunc,
      });
      const formInput = createFormInputs(mockFormInput);
      render(formInput);
      const inputValue = screen.getByLabelText("input", { exact: false });
      const updatedValue = "new input value";
      fireEvent.change(inputValue, { target: { value: updatedValue } });

      expect(mockUpdateFunc).toHaveBeenCalledWith(updatedValue);
    });
  });
});

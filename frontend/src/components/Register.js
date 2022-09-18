import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Form, { createFormInputs } from "./Form";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formErrors, setFormErrors] = useState({});

  function clearForm() {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  }
  async function registerUser(evt) {
    evt.preventDefault();
    const userDetails = { email, password, firstName, lastName };

    try {
      const { isValid, errors } = await register(userDetails);

      if (isValid) {
        // Banner notification to let the user know registration was successful
        navigate("/login");
      } else {
        setFormErrors(errors);
        // Flash the form error to the client
      }
    } catch {
      // log uncaught error here.
      // There should be none because they are caught on the backend
    } finally {
      clearForm();
    }
  }

  const registrationFormInputs = createFormInputs([
    {
      id: "first-name",
      label: "First Name",
      value: firstName,
      error: formErrors["firstName"],
      updateFunc: setFirstName,
    },
    {
      id: "last-name",
      label: "Last Name",
      value: lastName,
      error: formErrors["lastName"],
      updateFunc: setLastName,
    },
    {
      id: "email",
      label: "Email",
      value: email,
      error: formErrors["email"],
      updateFunc: setEmail,
    },
    {
      id: "password",
      label: "Password",
      value: password,
      error: formErrors["password"],
      inputType: "password",
      updateFunc: setPassword,
    },
  ]);

  return (
    <div data-testid="register">
      <Form formInputs={registrationFormInputs} onSubmit={registerUser} />
    </div>
  );
}

export default Register;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Form, { createFormInputs } from "./Form";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  async function loginUser(evt) {
    evt.preventDefault();
    const userDetails = { email, password };

    try {
      const { isValid, errors } = await login(userDetails);
      if (isValid) {
        // Banner notification to let the user know registration was successful
        navigate("/");
      } else {
        setPassword("");
        setFormErrors(errors);
        // Flash the form error to the client
      }
    } catch (err) {
      // log uncaught error here.
      // There should be none because they are caught on the backend
    }
  }
  const loginFormInputs = createFormInputs([
    {
      id: "email",
      label: "Email",
      value: email,
      error: formErrors["auth"],
      updateFunc: setEmail,
    },
    {
      id: "password",
      label: "Password",
      value: password,
      error: formErrors["auth"],
      inputType: "password",
      updateFunc: setPassword,
    },
  ]);

  return (
    <div data-testid="login">
      <Form formInputs={loginFormInputs} onSubmit={loginUser} />
    </div>
  );
}

export default Login;

import Validator from "validator";
import Users from "../models/users";

async function validateRegistration(request) {
  const errors = {};
  const {
    first_name = "",
    last_name = "",
    email = "",
    password = "",
  } = request.body;

  if (!first_name) {
    errors.first_name = "First name must not be empty";
  }

  if (!last_name) {
    errors.last_name = "Last name must not be empty";
  }

  if (!email) {
    errors.email = "Email must not be empty";
  } else if (!Validator.isEmail(email)) {
    errors.email = "The email is invalid";
  } else {
    try {
      const user = await Users.findOne({ email: email });
      if (user) errors.email = "Email already exists";
    } catch {
      errors.email = "Trouble searching users please try again";
    }
  }

  if (!password) {
    errors.password = "Password must not be empty";
  } else if (password.length < 6 || password.length > 30) {
    errors.password = "Password must be between 6 and 30 characters";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid: isValid,
    errors,
    result: isValid
      ? {
          first_name,
          last_name,
          email,
          password,
        }
      : {},
  };
}

export default validateRegistration;

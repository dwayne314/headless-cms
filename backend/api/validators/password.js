import bcrypt from "bcrypt";

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

export default validatePassword;

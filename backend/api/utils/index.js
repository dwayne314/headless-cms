import bcrypt from "bcrypt";

export function hashPassword(next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
}

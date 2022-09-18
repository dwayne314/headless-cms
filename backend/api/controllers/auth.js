import passport from "passport";
import Users from "../models/users";
import validateRegistration from "../validators/registration";

const authController = {
  register: async (req, res, next) => {
    const { isValid, errors, result } = await validateRegistration(req);
    if (!isValid) {
      return res.status(400).json(errors);
    } else {
      try {
        const newUser = await Users.create(result);
        return res.status(201).json(newUser);
      } catch (err) {
        return res.status(500).json({ auth: "User could not be created." });
      }
    }
  },
  login: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).json({ auth: "Invalid email or password" });
      req.login(user, (err) => {
        if (err) res.status(500).json({ auth: "User could not be logged in" });
        return res.status(200).json(user);
      });
    })(req, res, next);
  },
  logout: (req, res, next) => {
    req.logOut();
    req.session.destroy();
    return res.status(200).json({ auth: "User logged out" });
  },
};

export default authController;

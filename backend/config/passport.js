import { Strategy } from "passport-local";
import Users from "../api/models/users";
import validatePassword from "../api/validators/password";

function configurePassport(passport) {
  passport.use(
    "local",
    new Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (username, password, done) => {
        Users.findOne({ email: username }, (err, user) => {
          if (err) return done(err);
          if (!user) return done(null, false);

          const isValid = validatePassword(password, user.password);

          if (isValid) return done(null, user);
          else return done(null, false);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
  });
}

export default configurePassport;

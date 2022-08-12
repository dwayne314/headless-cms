import passport from "passport";
import authController from "../../api/controllers/auth.js";
import Users from "../../api/models/users";
import * as validateRegistration from "../../api/validators/registration";

describe("Auth Controller", () => {
  const mockNext = jest.fn();
  let req, res;

  const mockRequest = (sessionData) => {
    return {
      session: { data: sessionData, destroy: jest.fn() },
      logOut: jest.fn(),
      login: jest.fn(),
    };
  };

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.resetAllMocks();
    req = mockRequest();
    res = mockResponse();
  });

  describe("Login", () => {
    const authError = { err: "err" };
    const loginError = { err: "err" };
    const undefinedUser = false;
    const noAuthError = null;
    const noLoginError = null;
    const mockUser = {
      first_name: "Gerald",
      last_name: "Johnson",
      email: "gj@gmail.com",
    };

    function mockPassportAuth(error, user) {
      return jest
        .spyOn(passport, "authenticate")
        .mockImplementationOnce((strategy = "local", cb) => () => {
          cb(error, user);
        });
    }

    it("calls passport with local authenticate", () => {
      const passportAuthMock = mockPassportAuth();
      authController.login(req, res, mockNext);

      expect(passportAuthMock).toHaveBeenCalledWith(
        "local",
        expect.any(Function)
      );
    });
    it("calls next with the error if an auth error is thrown", () => {
      mockPassportAuth(authError);
      authController.login(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(authError);
    });
    it("returns a 401 error and the auth error if verification failed", () => {
      mockPassportAuth(noAuthError, undefinedUser);
      authController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        auth: "Invalid username or password",
      });
    });
    it("returns a 500 error and the auth error if the login failed", () => {
      mockPassportAuth(noAuthError, mockUser);
      req.login.mockImplementationOnce((user, errorCb) => errorCb(loginError));
      authController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        auth: "User could not be logged in",
      });
    });
    it("calls the request's login function if no error is present and verification passed", () => {
      jest
        .spyOn(passport, "authenticate")
        .mockImplementationOnce((strategy = "local", cb) => () => {
          cb(noAuthError, mockUser);
        });
      authController.login(req, res, mockNext);

      expect(req.login).toHaveBeenCalledTimes(1);
    });
    it("returns a 200 error and the user if the login was successful", () => {
      mockPassportAuth(noAuthError, mockUser);
      req.login.mockImplementationOnce((user, errorCb) =>
        errorCb(noLoginError)
      );
      authController.login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("Logout", () => {
    it("calls the request's logout function", () => {
      authController.logout(req, res, mockNext);
      expect(req.logOut).toHaveBeenCalledTimes(1);
    });
    it("destroys the users session", () => {
      authController.logout(req, res, mockNext);

      expect(req.session.destroy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Register", () => {
    const emptyValidationError = {};
    const authValidationError = { auth: "Invalid Body" };
    const successfulValidation = true;
    const successfulValidationResult = { first_name: "Gerald" };

    function mockCreateUsers(validationResult, withError) {
      return jest.spyOn(Users, "create").mockImplementation(() => {
        if (withError) throw "Error creating user";
        else {
          return validationResult;
        }
      });
    }

    function mockValidateRegistration(isValid, errors, result) {
      return jest
        .spyOn(validateRegistration, "default")
        .mockReturnValue({ isValid, errors, result });
    }

    it("calls the registration validator with the request", async () => {
      const validateRegistrationMock = mockValidateRegistration();
      await authController.register(req, res, mockNext);

      expect(validateRegistrationMock).toHaveBeenCalledWith(req);
    });
    it("returns a 400 error and the validation error if validation failed", async () => {
      const isValid = false;
      mockValidateRegistration(isValid, authValidationError);
      await authController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(authValidationError);
    });
    it("calls the Users.create method with the validation result if validation is successful", async () => {
      mockValidateRegistration(
        successfulValidation,
        emptyValidationError,
        successfulValidationResult
      );
      const userCreateMock = mockCreateUsers();
      await authController.register(req, res, mockNext);

      expect(userCreateMock).toHaveBeenCalledWith(successfulValidationResult);
    });
    it("returns a 500 status code and an error message if a database error is thrown", async () => {
      mockValidateRegistration(
        successfulValidation,
        emptyValidationError,
        successfulValidationResult
      );
      mockCreateUsers({}, "registrationError");
      await authController.register(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        auth: "User could not be created.",
      });
    });
    it("returns a 201 status code and the user if no errors are thrown", async () => {
      mockValidateRegistration(
        successfulValidation,
        emptyValidationError,
        successfulValidationResult
      );
      mockCreateUsers(successfulValidationResult);

      await authController.register(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(successfulValidationResult);
    });
  });
});

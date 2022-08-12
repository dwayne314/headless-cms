import Users from "../../api/models/users";
import validateRegistration from "../../api/validators/registration";

describe("Validate Registration", () => {
  const validRequestBody = {
    first_name: "Greg",
    last_name: "Thompson",
    email: "valid@email.com",
    password: "validPassword",
  };
  const mockRequest = (body = {}) => {
    return {
      body: body,
    };
  };

  const userFindMock = jest
    .spyOn(Users, "findOne")
    .mockImplementation(() => {});

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns error object with a first_name error if the first_name is not in the request body", async () => {
    const req = mockRequest();
    const { errors } = await validateRegistration(req);

    expect(errors.first_name).toBe("First name must not be empty");
  });
  it("returns error object with a last_name error if the last_name is not in the request body", async () => {
    const req = mockRequest();
    const { errors } = await validateRegistration(req);

    expect(errors.last_name).toBe("Last name must not be empty");
  });
  it("returns error object with an email error if the email is not in the request body", async () => {
    const req = mockRequest();
    const { errors } = await validateRegistration(req);

    expect(errors.email).toBe("Email must not be empty");
  });
  it("returns error object with an email error if the email is not a valid email", async () => {
    const req = mockRequest({ email: "invalid email format" });
    const { errors } = await validateRegistration(req);

    expect(errors.email).toBe("The email is invalid");
  });
  it("returns error object with an email error if the email is taken", async () => {
    userFindMock.mockImplementation(() => validRequestBody);
    const req = mockRequest({ email: "valid@email.com" });
    const { errors } = await validateRegistration(req);

    expect(errors.email).toBe("Email already exists");
  });
  it("returns error object with an email error if the database throws an error", async () => {
    userFindMock.mockImplementation(() => {
      throw "Email not found";
    });
    const req = mockRequest({ email: "valid@email.com" });
    const { errors } = await validateRegistration(req);

    expect(errors.email).toBe("Trouble searching users please try again");
  });
  it("returns error object with a password error if the password is not in the request body", async () => {
    const req = mockRequest();
    const { errors } = await validateRegistration(req);

    expect(errors.password).toBe("Password must not be empty");
  });
  it("returns error object with a password error if the password is less than 6 chars", async () => {
    const fiveCharPassword = new Array(5).fill("a").join("");
    const req = mockRequest({ password: fiveCharPassword });
    const { errors } = await validateRegistration(req);

    expect(errors.password).toBe(
      "Password must be between 6 and 30 characters"
    );
  });
  it("returns error object with a password error if the password is more than 30 chars", async () => {
    const thirtyOneCharPassword = new Array(31).fill("a").join("");
    const req = mockRequest({ password: thirtyOneCharPassword });
    const { errors } = await validateRegistration(req);

    expect(errors.password).toBe(
      "Password must be between 6 and 30 characters"
    );
  });
  it("returns isValid object = false if any errors are thrown", async () => {
    const req = mockRequest();
    const { errors, isValid } = await validateRegistration(req);

    expect(errors).toBeTruthy();
    expect(isValid).toBeFalsy();
  });
  it("returns isValid object = true if no errors are thrown", async () => {
    const req = mockRequest(validRequestBody);
    const { isValid, errors } = await validateRegistration(req);

    expect(isValid).toBeTruthy();
  });
  it("returns error object = {} if no errors are thrown", async () => {
    const req = mockRequest(validRequestBody);
    const { errors } = await validateRegistration(req);

    expect(errors).toStrictEqual({});
  });
  it("returns result object with only first_name, last_name, email, and password if validation is successful", async () => {
    const req = mockRequest(validRequestBody);
    const { result } = await validateRegistration(req);

    expect(result.first_name).toBe(validRequestBody.first_name);
    expect(result.last_name).toBe(validRequestBody.last_name);
    expect(result.email).toBe(validRequestBody.email);
    expect(result.password).toBe(validRequestBody.password);
  });
  it("removed unsupported request body properties from the result object if validation is successful", async () => {
    const req = mockRequest(validRequestBody);
    const { result } = await validateRegistration(req);

    expect(Object.keys(result).length).toBe(4);
    expect(result.unsupportedParam).toBe(undefined);
  });
});

import bcrypt from "bcrypt";
import validatePassword from "../../api/validators/password";

describe("Validate Password", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const compareSyncMock = jest.spyOn(bcrypt, "compareSync");

  it("returns true if the comparison is valid", () => {
    const hashedPassword = "#$##$";
    const password = "password";

    compareSyncMock.mockReturnValue(true);
    const validationResult = validatePassword(password, hashedPassword);

    expect(validationResult).toBeTruthy();
  });
  it("returns false if the comparison is not valid", () => {
    const hashedPassword = "#$##$";
    const password = "password";

    compareSyncMock.mockReturnValue(false);
    const validationResult = validatePassword(password, hashedPassword);

    expect(validationResult).toBeFalsy();
  });
});

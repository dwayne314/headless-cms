import bcrypt from "bcrypt";
import { hashPassword } from "../../api/utils";

describe("hashPassword", () => {
  it("calls bcrypt hashSync with 10 salt rounds", () => {
    const nextMock = jest.fn();
    const bcryptMock = jest
      .spyOn(bcrypt, "hashSync")
      .mockImplementation(() => jest.fn());
    hashPassword.call({ password: "pass" }, nextMock);

    expect(bcryptMock).toHaveBeenCalledWith("pass", 10);
  });
  it("calls next", () => {
    const nextMock = jest.fn();
    jest.spyOn(bcrypt, "hashSync").mockImplementation(() => jest.fn());
    hashPassword.call({ password: "pass" }, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
  });
});

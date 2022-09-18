import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";
import useAuth, { AuthProvider } from "../../../hooks/useAuth";

describe("Auth Provider", () => {
  const userDetails = { email: "test-email", password: "test-pass" };
  const axiosPostMock = jest.spyOn(axios, "post");

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("register", () => {
    it("returns a valid registration payload if no errors were thrown", async () => {
      axiosPostMock.mockImplementation(() => {});
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });
      const { isValid } = await result.current.register(userDetails);

      expect(isValid).toBe(true);
    });

    it("returns an invalid registration payload if an error is thrown", async () => {
      const registrationError = "User could not be registered";
      axiosPostMock.mockImplementation(() =>
        Promise.reject({ response: { data: registrationError } })
      );
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });
      const { isValid, errors } = await result.current.register(userDetails);

      expect(isValid).toBe(false);
      expect(errors).toBe(registrationError);
    });
  });

  describe("login", () => {
    it("updates the user state with the user details", async () => {
      axiosPostMock.mockImplementation(() => {});
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });
      result.current.login(userDetails);

      await waitFor(() =>
        expect(result.current.user).toStrictEqual(userDetails)
      );
    });

    it("returns a valid login payload if no errors were thrown", async () => {
      axiosPostMock.mockImplementation(() => {});
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });
      let loginResult;
      await act(async () => {
        loginResult = await result.current.login(userDetails);
      });

      expect(loginResult.isValid).toBe(true);
    });

    it("returns an invalid login payload if an error is thrown", async () => {
      const loginError = "User could not be logged in";
      axiosPostMock.mockImplementation(() =>
        Promise.reject({ response: { data: loginError } })
      );
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });
      let loginResult;
      await act(async () => {
        loginResult = await result.current.login(userDetails);
      });

      expect(loginResult.isValid).toBe(false);
      expect(loginResult.errors).toBe(loginError);
    });
  });

  describe("logout", () => {
    it("updates the user state to empty object", async () => {
      axiosPostMock.mockImplementation(() => {});
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

      const { result } = renderHook(() => useAuth(), { wrapper });
      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toStrictEqual({});
    });

    it("returns a valid logout payload", async () => {
      axiosPostMock.mockImplementation(() => {});
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

      const { result } = renderHook(() => useAuth(), { wrapper });
      let logoutResult;
      await act(async () => {
        logoutResult = await result.current.logout();
      });

      expect(logoutResult.isValid).toBe(true);
    });
  });
});

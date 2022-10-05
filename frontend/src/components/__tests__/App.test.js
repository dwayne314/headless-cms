import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { AuthContext } from "../../hooks/useAuth";

describe("App", () => {
  const renderWithRouter = (path, user) => (
    <AuthContext.Provider value={{ user: user }}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  it("`/` route renders the Home component if the AuthContext contains a user", () => {
    const validUser = { firstName: "Gerald" };
    render(renderWithRouter("/", validUser));

    expect(screen.getByTestId("home")).toBeTruthy();
  });

  it("`/` route renders the Login component if the AuthContext doesn't contain a user", () => {
    const noUser = {};
    render(renderWithRouter("/", noUser));

    expect(screen.queryByTestId("home")).toBeFalsy();
    expect(screen.getByTestId("login")).toBeTruthy();
  });

  it("`/register` route renders the Register component", () => {
    render(renderWithRouter("/register"));
    expect(screen.getByTestId("register")).toBeTruthy();
  });

  it("`/login` route renders the Login component", () => {
    // make sure to test that the user is redirected to home if they are logged in
    render(renderWithRouter("/login"));
    expect(screen.getByTestId("login")).toBeTruthy();
  });
});

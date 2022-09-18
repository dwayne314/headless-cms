import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../../../components/App";

describe("App", () => {
  const renderWithRouter = (path) => (
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );

  it("`/` route renders the Home component", () => {
    render(renderWithRouter("/"));
    expect(screen.getByTestId("home")).toBeTruthy();
  });

  it("`/register` route renders the Register component", () => {
    render(renderWithRouter("/register"));
    expect(screen.getByTestId("register")).toBeTruthy();
  });

  it("`/login` route renders the Login component", () => {
    render(renderWithRouter("/login"));
    expect(screen.getByTestId("login")).toBeTruthy();
  });
});

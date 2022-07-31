import { render, screen } from "@testing-library/react";
import App from "../../components/App";

describe("App", () => {
  it("test", () => {
    render(<App />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

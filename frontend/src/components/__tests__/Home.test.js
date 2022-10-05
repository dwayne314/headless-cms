import { render, screen } from "@testing-library/react";
import Home from "../Home";

describe("Home", () => {
  it("displays the rendered text", () => {
    render(<Home />);
    expect(screen.getByText("Hit Home Route")).toBeInTheDocument();
  });
});

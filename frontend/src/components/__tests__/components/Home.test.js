import { render, screen } from "@testing-library/react";
import Home from "../../../components/Home";

describe("Home", () => {
  it("displays the rendered text", () => {
    render(<Home />);
    expect(screen.getByText("Hit Home Route")).toBeInTheDocument();
  });
});

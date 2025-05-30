import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../404";
import { MemoryRouter, useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      pathname: "/some/invalid/path",
    }),
    useNavigate: jest.fn(),
  };
});

describe("NotFound Page", () => {
  it("renders 404 content", () => {
    render(<NotFound />, { wrapper: MemoryRouter });

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go back/i })
    ).toBeInTheDocument();
  });

  it("logs 404 path to console", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<NotFound />, { wrapper: MemoryRouter });

    expect(consoleSpy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/some/invalid/path"
    );

    consoleSpy.mockRestore();
  });

  it("navigates to home on 'Go Back' click", async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<NotFound />, { wrapper: MemoryRouter });

    const button = screen.getByRole("button", { name: /go back/i });
    await userEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});

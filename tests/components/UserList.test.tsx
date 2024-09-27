import { render, screen } from "@testing-library/react";
import UserList from "../../src/components/UserList";
import { User } from "../../src/entities";

describe("UserList", () => {
  it("should render no user when the user array is empty", () => {
    render(<UserList users={[]} />);
    screen.getByText(/no users/i);
  });

  it("should render a list of user", () => {
    const users: User[] = [
      { id: 1, name: "Mohamad" },
      { id: 2, name: "Omar" },
      { id: 3, name: "Amr" },
      { id: 4, name: "Amer" },
    ];

    render(<UserList users={users} />);

    users.forEach((user) => {
      const link = screen.getByRole("link", { name: user.name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/users/${user.id}`);
    });
  });
});

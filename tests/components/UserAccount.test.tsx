import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const adminUser: User = {
    id: 1,
    name: "Abdalslam",
    isAdmin: true,
  };
  const user: User = {
    id: 1,
    name: "Abdalslam",
    isAdmin: false,
  };

  it("should render user name", () => {
    render(<UserAccount user={adminUser} />);
    expect(screen.getByText(adminUser.name)).toBeInTheDocument;
  });

  it("should render edit button if user is admin", () => {
    render(<UserAccount user={adminUser} />);
    const editButton = screen.queryByRole("button");
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveTextContent(/edit/i);
  });

  it("should not render the edit button if the user is not admin", () => {
    render(<UserAccount user={user} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

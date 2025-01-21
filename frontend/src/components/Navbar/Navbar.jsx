import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext"; // Import useAuth

const NavbarComponent = () => {
  const { token, setToken } = useAuth(); // Get token and setToken from AuthContext

  const handleSignOut = () => {
    setToken(null);
    window.location.href = "/";
  };

  return (
    <div className="nav-container">
      <Navbar color="light" expand="md" container={false}>
        <Container>
          <NavbarBrand href={token ? "/profile" : "/"}>Groupify</NavbarBrand>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/courses" disabled={!token}>
                Courses
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/contacts" disabled={!token}>
                Contacts
              </NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                Account
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem href="/profile" disabled={!token}>
                  Profile
                </DropdownItem>
                <DropdownItem href="/settings" disabled={!token}>
                  Settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleSignOut}>Sign Out</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent;

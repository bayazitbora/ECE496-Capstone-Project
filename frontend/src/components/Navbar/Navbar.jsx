import { Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavbarComponent = () => {
  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/profile">Groupify</NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink href="/courses">Courses</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/contacts">Contacts</NavLink>
        </NavItem>
      </Nav>
      <Nav className="ml-auto" navbar>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Account
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem href="/profile">
              Profile
            </DropdownItem>
            <DropdownItem href="/settings">
              Settings
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem href="/">
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Navbar>
  );
};

export default NavbarComponent;
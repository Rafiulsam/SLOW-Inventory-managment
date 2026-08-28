import { NavLink } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar" aria-label="Main navigation">
    <strong className="brand">SLOW Inventory Management</strong>
    <div className="nav-links">
      <NavLink end to="/">
        Dashboard
      </NavLink>
      <NavLink to="/products">Update products</NavLink>
      <NavLink to="/products/add">Add product</NavLink>
    </div>
  </nav>
);

export default Navbar;

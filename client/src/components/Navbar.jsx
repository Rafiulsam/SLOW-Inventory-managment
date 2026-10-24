import { NavLink } from "react-router-dom";

const Navbar = () => (
  <nav className="mx-auto mb-16 flex max-w-[1400px] items-center justify-between max-[760px]:mb-11 max-[760px]:items-start max-[760px]:gap-5" aria-label="Main navigation">
    <strong className="text-[#bb4b32] text-[1.15rem] tracking-[0.12em]">SLOW Inventory Management</strong>
    <div className="flex gap-6 max-[760px]:flex-wrap max-[760px]:justify-end max-[760px]:gap-x-4 max-[760px]:gap-y-3">
      <NavLink className="border-b-2 border-transparent pb-[5px] text-[#66716c] text-[0.78rem] font-bold no-underline hover:border-[#bb4b32] hover:text-[#1d2926] [&.active]:border-[#bb4b32] [&.active]:text-[#1d2926]" end to="/">
        Dashboard
      </NavLink>
      <NavLink className="border-b-2 border-transparent pb-[5px] text-[#66716c] text-[0.78rem] font-bold no-underline hover:border-[#bb4b32] hover:text-[#1d2926] [&.active]:border-[#bb4b32] [&.active]:text-[#1d2926]" to="/products">Update products</NavLink>
      <NavLink className="border-b-2 border-transparent pb-[5px] text-[#66716c] text-[0.78rem] font-bold no-underline hover:border-[#bb4b32] hover:text-[#1d2926] [&.active]:border-[#bb4b32] [&.active]:text-[#1d2926]" to="/products/add">Add product</NavLink>
    </div>
  </nav>
);

export default Navbar;

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
//import finmateLogo from "../assets/finmate-logo.svg";

const navItems = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Features",
    href: "#features",
  },
  {
    label: "Why FinMate",
    href: "#why-finmate",
  },
  {
    label: "About",
    href: "#about",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="relative z-50 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <img src="./logo.svg" alt="FinMate" className="h-10 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-green-600"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => navigate("/login")}
            type="button"
            className="px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-green-600"
          >
            Login
          </button>

          <button
            onClick={() =>
              user?.name ? navigate("/dashboard") : navigate("/signup")
            }
            type="button"
            className="rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-700 active:scale-95"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 top-[72px] w-full border-b border-slate-100 bg-white px-6 py-6 shadow-lg md:hidden">
          <ul className="flex flex-col gap-5">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-sm font-medium text-slate-700 transition-colors hover:text-green-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/login")}
              type="button"
              className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700"
            >
              Login
            </button>

            <button
              onClick={() =>
                user.name ? navigate("/dashboard") : navigate("/signup")
              }
              type="button"
              className="flex-1 rounded-full bg-green-600 py-2.5 text-sm font-semibold text-white"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

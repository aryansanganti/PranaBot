import React, { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6" />
            <span className="font-bold text-xl">PranaBot</span>
          </div>

          {/* Hamburger Menu for small screens */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Links Section - Hidden on small screens, visible on medium+ */}
          <div className="hidden md:flex space-x-6">
            <a href="#home" className="hover:text-green-200 transition-colors">
              Home
            </a>
            <a
              href="#how-it-works"
              className="hover:text-green-200 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="hover:text-green-200 transition-colors"
            >
              About
            </a>
          </div>
        </div>

        {/* Dropdown menu for mobile devices */}
        {isOpen && (
          <div className="md:hidden mt-3 space-y-2">
            <a
              href="#home"
              className="block text-center py-2 hover:bg-green-700 rounded"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              className="block text-center py-2 hover:bg-green-700 rounded"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="block text-center py-2 hover:bg-green-700 rounded"
            >
              About
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

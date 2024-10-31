import React from "react";
import { Heart, Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12 w-full">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div>
            <h3 className="font-semibold text-lg mb-3">AyurVision</h3>
            <p className="text-gray-300 text-sm">
              Identifying and learning about Ayurvedic plants made easy through
              artificial intelligence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <div className="flex flex-col space-y-2 text-gray-300 text-sm">
              <a
                href="mailto:contact@ayurvision.com"
                className="flex items-center space-x-2 hover:text-white"
              >
                <Mail className="w-4 h-4" />
                <span>contact@pranabot.com</span>
              </a>
              <a
                href="https://github.com/ayurvision"
                className="flex items-center space-x-2 hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3">Disclaimer</h3>
            <p className="text-gray-300 text-sm">
              This application is for educational purposes only. Please consult
              with qualified Ayurvedic practitioners for medical advice.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500" /> by Aryan Sanganti
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

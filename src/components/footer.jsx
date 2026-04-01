import React from "react";
import { FaTwitter, FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const socials = [
    { Icon: FaTwitter, link: "https://twitter.com/nike" },
    { Icon: FaFacebookF, link: "https://facebook.com/nike" },
    { Icon: FaYoutube, link: "https://youtube.com/nike" },
    { Icon: FaInstagram, link: "https://instagram.com/nike" },
  ];

  return (
    <footer className="bg-[#111] dark:bg-black text-white pt-10 pb-6 font-sans transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {/* 1. Column: Main Links */}
          <div className="flex flex-col gap-3 text-[12px] font-bold uppercase tracking-tight">
            <a href="#" className="hover:text-gray-400 transition-colors">
              Find a Store
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Become a Member
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Sign Up for Email
            </a>
            <a href="#" className="hover:text-gray-400 transition-colors">
              Send Us Feedback
            </a>
          </div>

          {/* 2. Column: Get Help */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[12px] font-bold uppercase">Get Help</h4>
            <nav className="flex flex-col gap-2 text-[12px] text-[#7e7e7e]">
              <a href="#" className="hover:text-white transition-colors">
                Order Status
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Delivery
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Returns
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Payment Options
              </a>
            </nav>
          </div>

          {/* 3. Column: About Nike */}
          <div className="flex flex-col gap-3">
            <h4 className="text-[12px] font-bold uppercase">About Nike</h4>
            <nav className="flex flex-col gap-2 text-[12px] text-[#7e7e7e]">
              <a href="#" className="hover:text-white transition-colors">
                News
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Careers
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Investors
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Sustainability
              </a>
            </nav>
          </div>

          {/* 4. Social Icons (Style to'g'rilangan joyi) */}
          {/* Ijtimoiy tarmoqlar qismi */}
          <div className="flex gap-4">
            {socials.map((social) => (
              <a
                key={social.link}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#7e7e7e] dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-500 text-[#111] dark:text-white w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0"
              >
                <social.Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-4 border-t border-[#222] dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-[#7e7e7e]">
          <div className="flex items-center gap-4">
            <span className="text-white text-[12px]">Uzbekistan</span>
            <p>© 2026 Nike, Inc. All Rights Reserved</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Guides
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Sale
            </a>
            <a href="#" className="hover:text-white">
              Terms of Use
            </a>
            <a href="#" className="hover:text-white">
              Nike Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

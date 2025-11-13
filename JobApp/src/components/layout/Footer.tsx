import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, MailIcon } from 'lucide-react';
export const Footer: React.FC = () => {
  return <footer className="bg-gray-800 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* District Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Kapchorwa District Local Government</h3>
            <p className="text-gray-300 mb-4">
              Serving the people of Kapchorwa with transparent governance, public services, and job opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/kapchorwadistrict" className="text-gray-300 hover:text-white">
                <FacebookIcon size={20} />
              </a>
              <a href="https://twitter.com/kapchorwagov" className="text-gray-300 hover:text-white">
                <TwitterIcon size={20} />
              </a>
              <a href="https://instagram.com/kapchorwadistrict" className="text-gray-300 hover:text-white">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/user" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/user/jobs" className="text-gray-300 hover:text-white">
                  Job Listings
                </Link>
              </li>
              <li>
                <Link to="/user/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/user/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
          {/* Public Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Public Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@kapchorwa.go.ug" className="text-gray-300 hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://kapchorwa.go.ug/services" className="text-gray-300 hover:text-white">
                  District Services
                </a>
              </li>
              <li>
                <a href="https://kapchorwa.go.ug/faqs" className="text-gray-300 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="https://kapchorwa.go.ug/about" className="text-gray-300 hover:text-white">
                  About Kapchorwa
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe for updates on job openings and district announcements.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full focus:outline-none text-gray-900 rounded-l"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r"
              >
                <MailIcon size={20} />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Kapchorwa District Local Government. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
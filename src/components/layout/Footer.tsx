import { APP_CONFIG } from '../../config/app.config';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="bg-gray-800 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-sm">
            <strong className="text-yellow-500">Important Disclaimer:</strong>{' '}
            {APP_CONFIG.disclaimers.full}
          </p>
        </div>

        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm">{APP_CONFIG.firmName}</p>
            <p className="text-sm">{APP_CONFIG.lawyerName}</p>
            <p className="text-sm mt-2">
              <a 
                href={`mailto:${APP_CONFIG.supportEmail}`}
                className="text-primary-400 hover:text-primary-300"
              >
                {APP_CONFIG.supportEmail}
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary-400">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-400">Refund Policy</a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-sm">
              Professional immigration assessment tool built by experienced 
              New Zealand immigration lawyers.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>© {currentYear} {APP_CONFIG.firmName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
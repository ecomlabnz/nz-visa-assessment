import { APP_CONFIG } from '../../config/app.config';

export const Header = () => {
  return (
    <header className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{APP_CONFIG.appName}</h1>
            <p className="text-primary-100 text-sm mt-1">{APP_CONFIG.tagline}</p>
          </div>
          
          {/* Navigation placeholder */}
          <nav className="hidden md:flex space-x-6">
            <a href="#assessment" className="hover:text-primary-200 transition">
              Assessment
            </a>
            <a href="#about" className="hover:text-primary-200 transition">
              About
            </a>
            <a href="#contact" className="hover:text-primary-200 transition">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
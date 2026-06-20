import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 pt-16 pb-8 hidden md:block">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img className="w-10 h-10 rounded-lg" src="/img/logo.png" alt="Zodiac Store" />
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Zodiac</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your one-stop destination for premium electronics, audio gear, and modern tech lifestyle accessories.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li><Link to="/shop" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">All Products</Link></li>
              <li><Link to="/category/sony" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Audio & Headphones</Link></li>
              <li><Link to="/category/samsungs" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Gaming Consoles</Link></li>
              <li><Link to="/category/apples" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Computers & Laptops</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Terms & Conditions</Link></li>
              <li><Link to="/shipping" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors text-sm">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0" />
                <span>123 Tech Avenue, Innovation District, Phnom Penh, Cambodia</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                <a href="mailto:reaksa@gmail.com" className="hover:text-indigo-600 transition-colors">reaksa@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>+855 89 674 732</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Zodiac Store. All rights reserved.
          </p>
          <div className="flex gap-3 items-center">
            <img className="w-10 h-11 transition-transform duration-300 ease-in-out hover:scale-110" src="/img/visa.png" alt="Visa" />
            <img className="w-10 h-7 rounded-md transition-transform duration-300 ease-in-out hover:scale-110" src="/img/ABA.png" alt="ABA" />
            <img className="w-12 h-9 transition-transform duration-300 ease-in-out hover:scale-110" src="/img/union.png" alt="UnionPay" />
            <img className="w-10 h-7 rounded-md transition-transform duration-300 ease-in-out hover:scale-110" src="/img/acleda.png" alt="Acleda" />
          </div>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

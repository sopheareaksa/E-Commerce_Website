import { useState } from 'react';
import api from '../api/axios';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);

      const BOT_TOKEN = '8987532573:AAGRkQ1-Jkne7-i5htVXhN0Tmx1DjtFAoBI';
      const CHAT_ID = '1237039934';
      const text = `New Contact Message\n\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      });

      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 dark:bg-indigo-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Get in Touch</h1>
          <p className="text-indigo-100 text-lg max-w-xl mx-auto">Have a question or need help? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: MapPin, title: 'Visit Us', text: '123 Tech Avenue, Phnom Penh' },
            { icon: Mail, title: 'Email Us', text: 'support@zodiacstore.com' },
            { icon: Phone, title: 'Call Us', text: '+855 89 674 732' },
          ].map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-slate-200 mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-slate-400">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Send a Message</h2>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-500 dark:text-slate-400">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Name</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name"
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                      className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?"
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200" />
                </div>
                <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50">
                  <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Business Hours</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between text-gray-600 dark:text-slate-300">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Mon - Fri</span>
                  <span>9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-slate-300">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between text-gray-600 dark:text-slate-300">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Sunday</span>
                  <span>Closed</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3909.041450664374!2d104.88050767504198!3d11.55085978864407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310951add5e2cd81%3A0x171ead43f31ff00e!2sPhnom%20Penh!5e0!3m2!1sen!2skh!4v1700000000000"
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

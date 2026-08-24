import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function Home() {
  const { products, getByCategory, loading } = useProducts();

  const slides = [
    {
      src: '/img/Headphone.png',
      alt: 'Headphone',
      subtitle: 'Beats Solo',
      title: 'Wireless',
      desc: 'Experience premium sound quality with the all-new Beats Solo Wireless. Designed for comfort and engineered for pure audio perfection.',
    },
    {
      src: '/img/Controller.png',
      alt: 'Wireless Controller',
      subtitle: 'Gaming Gear',
      title: 'Controller',
      desc: 'Take control of every game with precision-engineered wireless controllers built for comfort, speed, and immersive gameplay.',
    },
    {
      src: '/img/airpods.png',
      alt: 'AirPods Pro',
      subtitle: 'Audio Essentials',
      title: 'AirPods Pro',
      desc: 'Immerse yourself in crystal-clear audio with active noise cancellation and a seamless fit for all-day listening.',
    },
    {
      src: '/img/speaker4.png',
      alt: 'Wireless Speaker',
      subtitle: 'Sound On',
      title: 'Speaker',
      desc: 'Bring the party anywhere with powerful wireless speakers delivering deep bass and room-filling sound.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fullText = slides[currentSlide].title;

  useEffect(() => {
    let timeout;
    const typeSpeed = isDeleting ? 40 : 90;

    if (!isDeleting && typedText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typedText === '') {
      timeout = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsDeleting(false);
      }, 300);
    } else {
      timeout = setTimeout(() => {
        setTypedText((prev) =>
          isDeleting ? fullText.slice(0, prev.length - 1) : fullText.slice(0, prev.length + 1)
        );
      }, typeSpeed);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, fullText, slides.length]);

  const featured = products.slice(0, 4);
  const apples = getByCategory('apples').slice(0, 4);
  const samsungs = getByCategory('samsungs').slice(0, 4);

  const renderProductGrid = (items) => {
    if (loading && items.length === 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-100 dark:border-slate-700 animate-pulse space-y-3">
              <div className="bg-slate-100 dark:bg-slate-700 aspect-square rounded-xl" />
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.product_id} product={p} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Hero */}
      <header className="max-w-7xl mx-auto m-4 md:mt-8 md:mb-16 animate-fade-up">
        <div className="bg-slate-900 rounded-[2rem] p-8 md:p-20 min-h-[450px] md:h-[550px] flex items-center overflow-hidden relative shadow-2xl">
          {/* Animated gradient blobs */}
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob"
            style={{ animationDelay: '0s' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-purple-500 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob"
            style={{ animationDelay: '2s', animationDirection: 'reverse' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-pink-500 rounded-full mix-blend-screen filter blur-[128px] opacity-25 animate-blob"
            style={{ animationDelay: '4s' }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
            <div className="space-y-6 text-center md:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-indigo-300 text-xs md:text-sm font-semibold tracking-wide uppercase backdrop-blur-md border border-white/10">
                {slides[currentSlide].subtitle}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-none min-h-[1.2em]">
                {typedText}
                <span className="animate-pulse text-indigo-400">|</span>
              </h1>
              <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto md:mx-0 line-clamp-3">
                {slides[currentSlide].desc}
              </p>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Shop Category <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
                <img
                  key={currentSlide}
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].alt}
                  className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] animate-fade-in transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  setTypedText('');
                  setIsDeleting(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-indigo-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Brand Logos */}
      <section className="max-w-7xl mx-auto border-y border-gray-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 md:grid-cols-4 py-8 gap-8 items-center justify-items-center">
          <img src="/img/Samsung.png" alt="Samsung" className="h-6 md:h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
          <img src="/img/Panasonic.png" alt="Panasonic" className="h-6 md:h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
          <img src="/img/Apple.png" alt="Apple" className="h-6 md:h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
          <img src="/img/Sony.png" alt="Sony" className="h-6 md:h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
        </div>
      </section>

      {/* Promo Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mt-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-3xl p-8 flex items-center justify-between group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute right-0 top-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="space-y-3 relative z-10 w-1/2">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Gaming Gear</span>
              <h2 className="font-bold text-2xl md:text-3xl text-slate-800 dark:text-slate-200">Wireless <br />Controller</h2>
              <p className="font-bold text-slate-500 dark:text-slate-400">$80.00</p>
              <Link to="/shop" className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-slate-800 pb-1 mt-2 inline-flex items-center gap-1 hover:text-red-500 hover:border-red-500 transition-colors">
                Shop Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-1/2 relative z-10">
              <img className="w-full drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out" src="/img/Controller.png" alt="Controller" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm rounded-3xl p-8 flex items-center justify-between group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
            <div className="space-y-3 relative z-10 w-1/2">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Audio Essentials</span>
              <h2 className="font-bold text-2xl md:text-3xl text-slate-800 dark:text-slate-200">AirPods <br />Pro Gen 2</h2>
              <p className="font-bold text-slate-500 dark:text-slate-400">$175.00</p>
              <Link to="/shop" className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b-2 border-slate-800 pb-1 mt-2 inline-flex items-center gap-1 hover:text-blue-500 hover:border-blue-500 transition-colors">
                Shop Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="w-1/2 relative z-10">
              <img className="w-full drop-shadow-xl group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out" src="/img/airpods.png" alt="AirPods" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">Products On Sale</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Grab these limited-time deals before they're gone.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {renderProductGrid(featured)}
      </section>

      {/* Mid Season Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="relative rounded-3xl bg-[url('/img/bg-img.png')] bg-cover bg-center bg-no-repeat overflow-hidden min-h-[400px] flex items-center shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
          <div className="relative z-10 p-10 md:p-16 w-full max-w-2xl">
            <h4 className="text-sm font-bold tracking-[0.2em] text-indigo-400 mb-4 uppercase">Mid Season's Sale</h4>
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
              Autumn Collection <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">Up to 30% Off</span>
            </h1>
            <p className="text-slate-300 mb-8 max-w-md">
              Upgrade your lifestyle with our premium tech collection. Limited time offers on top tier electronics.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all">
              Shop The Sale <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Apple Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">Apple Products</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Grab these limited-time deals before they're gone.</p>
          </div>
          <Link to="/category/apples" className="hidden md:flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {renderProductGrid(apples)}
      </section>

      {/* Samsung Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">Samsung Products</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Grab these limited-time deals before they're gone.</p>
          </div>
          <Link to="/category/samsungs" className="hidden md:flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {renderProductGrid(samsungs)}
      </section>
    </div>
  );
}

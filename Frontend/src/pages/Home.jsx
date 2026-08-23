import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function Home() {
  const { products, getByCategory } = useProducts();

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
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTypedText('');
      setIsDeleting(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    let timeout;
    const typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && typedText === fullText) {
      timeout = setTimeout(() => setIsDeleting(true), 1200);
    } else if (isDeleting && typedText === '') {
      timeout = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsDeleting(false);
      }, 200);
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

          <div className="relative w-full z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="text-left space-y-4 md:space-y-6 md:w-1/2 z-20">
              <span
                className="inline-block py-1 px-3 rounded-full bg-white/10 text-indigo-300 text-sm font-semibold tracking-wide border border-white/20 backdrop-blur-sm animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                New Arrivals
              </span>

              <div className="space-y-1 animate-slide-in-left" style={{ animationDelay: '0.3s' }}>
                <h2 className="font-medium text-2xl md:text-3xl text-gray-300 min-h-[2rem]">
                  {slides[currentSlide].subtitle}
                </h2>
                <h2 className="font-black text-5xl md:text-7xl text-white tracking-tight leading-tight min-h-[1.1em]">
                  {typedText}
                  <span className="inline-block w-[3px] h-[0.9em] ml-1 bg-indigo-400 align-middle animate-pulse" />
                </h2>
              </div>

              <p
                className="text-gray-400 dark:text-slate-500 max-w-md text-sm md:text-base line-clamp-2 md:line-clamp-none animate-slide-in-left"
                style={{ animationDelay: '0.45s' }}
              >
                {slides[currentSlide].desc}
              </p>

              <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-8 py-3.5 mt-4 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.45)] active:scale-95 transition-all duration-300"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <h1 className="text-white/[0.04] font-black text-[15vw] md:text-[8vw] leading-none uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 select-none pointer-events-none whitespace-nowrap animate-pulse">
              GEAR
            </h1>

            <div
              className="md:w-1/2 relative z-20 mt-10 md:mt-0 flex justify-center w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] h-[300px] sm:h-[360px] md:h-[420px] animate-slide-in-right"
              style={{ animationDelay: '0.5s' }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 translate-y-0 scale-100 z-10'
                      : 'opacity-0 translate-y-6 scale-95 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] max-h-full max-w-full object-contain"
                  />
                </div>
              ))}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide
                        ? 'bg-white w-6'
                        : 'bg-white/40 hover:bg-white/70 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apples.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {samsungs.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

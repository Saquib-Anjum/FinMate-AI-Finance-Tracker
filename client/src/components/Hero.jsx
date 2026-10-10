import { ArrowRight, Play } from "lucide-react";



const Hero = () => {
  return (
    <section id="home" className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        {/* LEFT */}
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Smart finance management
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
            Take Control
            <br />
            of Your <span className="text-green-600">Finances</span>
            <br />
            with FinMate
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-500 md:text-lg">
            Track expenses, set budgets, achieve goals and get AI-powered
            insights — all in one simple place.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 active:scale-95">
              Get Started Free
              <ArrowRight size={17} />
            </button>

            <button className="flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-green-500 hover:text-green-600">
              <Play size={16} />
              Watch Demo
            </button>
          </div>

          {/* Trust */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="h-9 w-9 rounded-full border-2 border-white bg-slate-200" />
              <div className="h-9 w-9 rounded-full border-2 border-white bg-slate-300" />
              <div className="h-9 w-9 rounded-full border-2 border-white bg-slate-400" />
            </div>

            <p className="text-sm text-slate-500">
              Trusted by{" "}
              <span className="font-semibold text-slate-700">10K+</span> users
            </p>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex items-center justify-center lg:justify-end">
          {/* Soft background */}
          <div className="absolute h-[420px] w-[420px] rounded-full bg-green-50 blur-3xl" />

          <img
            src="./hero1.png"
            alt="FinMate finance dashboard"
            className="relative z-10 w-full max-w-[600px] object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

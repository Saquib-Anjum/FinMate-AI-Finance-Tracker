import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section id="about" className="bg-white py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[32px] bg-green-600 px-6 py-16 text-center text-white md:px-12">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-white/10" />

          <div className="relative">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles size={23} />
            </div>

            <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-bold md:text-4xl">
              Start taking control of your finances today.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-green-50 md:text-base">
              Track your money, create better habits and work
              toward your financial goals with FinMate.
            </p>

            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-green-700 transition hover:bg-green-50">
              Get Started Free
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTA;
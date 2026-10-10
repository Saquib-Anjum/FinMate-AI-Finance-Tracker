import {
  ShieldCheck,
  BarChart3,
  Brain,
  Zap,
} from "lucide-react";

const benefits = [
  {
    icon: Brain,
    title: "AI-powered insights",
    text: "Understand your spending patterns and get useful suggestions.",
  },
  {
    icon: BarChart3,
    title: "Clear analytics",
    text: "See exactly where your money goes with simple visual reports.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    text: "Your financial information stays protected and under your control.",
  },
  {
    icon: Zap,
    title: "Simple to use",
    text: "No complicated spreadsheets or confusing financial tools.",
  },
];

const WhyFinMate = () => {
  return (
    <section
      id="why-finmate"
      className="bg-slate-950 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

          {/* Left */}
          <div>

            <p className="text-sm font-semibold text-green-400">
              WHY FINMATE
            </p>

            <h2 className="mt-4 max-w-xl text-4xl font-bold leading-tight md:text-5xl">
              Managing money shouldn't feel complicated.
            </h2>

            <p className="mt-6 max-w-lg leading-7 text-slate-400">
              FinMate brings your transactions, budgets, goals and
              financial insights together in one simple experience.
            </p>

            <button className="mt-8 rounded-full bg-green-600 px-7 py-3.5 text-sm font-semibold transition hover:bg-green-500">
              Start Managing Your Money
            </button>

          </div>

          {/* Right */}
          <div className="grid gap-4 sm:grid-cols-2">

            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {benefit.text}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyFinMate;
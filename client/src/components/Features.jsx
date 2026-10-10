import {
  Receipt,
  WalletCards,
  Target,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Receipt,
    title: "Track Expenses",
    description: "Stay on top of your spending.",
  },
  {
    icon: WalletCards,
    title: "Set Budgets",
    description: "Plan your money better.",
  },
  {
    icon: Target,
    title: "Achieve Goals",
    description: "Save for what matters.",
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Get personalized tips.",
  },
];

const Features = () => {
  return (
    <section id="features" className="border-y border-slate-100 bg-slate-50/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-12 md:grid-cols-4 lg:px-8">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="group flex flex-col items-center px-4 py-5 text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
                <Icon size={22} />
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default Features;
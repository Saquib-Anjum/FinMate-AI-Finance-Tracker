import React from "react";
import {
  TrendingDown,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const insights = [
  {
    icon: TrendingDown,
    title: "Spending insights",
    description: "Understand where your money goes.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: PiggyBank,
    title: "Savings goals",
    description: "Stay focused on your future plans.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Wallet,
    title: "Budget planning",
    description: "Make every rupee count.",
    color: "bg-blue-50 text-blue-600",
  },
];

function AIInsights() {
  return (
    <aside className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-5 flex items-center gap-2">
          <Sparkles size={18} className="text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900">
            Your financial toolkit
          </h3>
        </div>

        <div className="space-y-5">
          {insights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  <Icon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-slate-800">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </div>

                <ArrowUpRight size={15} className="mt-1 text-slate-300" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
          <Sparkles size={19} />
        </div>

        <h3 className="text-sm font-semibold text-slate-900">
          A little more clarity.
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-600">
          Ask questions in plain language and use your financial data to make
          more informed decisions.
        </p>

        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          Built for your financial journey
        </p>
      </div>
    </aside>
  );
}

export default AIInsights;
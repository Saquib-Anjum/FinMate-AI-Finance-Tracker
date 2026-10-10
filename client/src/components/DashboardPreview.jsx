import {
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
} from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <p className="text-sm font-semibold text-green-600">
            YOUR MONEY. YOUR DASHBOARD.
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Everything you need to understand your money
          </h2>

          <p className="mt-4 text-slate-500">
            Get a clear picture of your income, expenses, budgets
            and financial goals from one simple dashboard.
          </p>

        </div>

        {/* Dashboard */}
        <div className="mt-14 rounded-[30px] border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/40 md:p-7">

          <div className="rounded-2xl bg-white p-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm text-slate-400">
                  Good morning
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Financial Overview
                </h3>
              </div>

              <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
                October 2026
              </button>

            </div>

            {/* Stats */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    Balance
                  </p>

                  <CircleDollarSign
                    size={20}
                    className="text-green-600"
                  />

                </div>

                <p className="mt-3 text-2xl font-bold">
                  ₹52,450
                </p>

                <p className="mt-2 text-xs text-green-600">
                  +12.5% this month
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    Income
                  </p>

                  <ArrowUpRight
                    size={20}
                    className="text-green-600"
                  />

                </div>

                <p className="mt-3 text-2xl font-bold">
                  ₹38,200
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  This month
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center justify-between">

                  <p className="text-sm text-slate-500">
                    Expenses
                  </p>

                  <ArrowDownRight
                    size={20}
                    className="text-orange-500"
                  />

                </div>

                <p className="mt-3 text-2xl font-bold">
                  ₹21,640
                </p>

                <p className="mt-2 text-xs text-orange-500">
                  8.2% less than last month
                </p>
              </div>

            </div>

            {/* Fake chart */}
            <div className="mt-6 rounded-2xl border border-slate-100 p-5">

              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  Spending Overview
                </h4>

                <span className="text-xs text-slate-400">
                  Last 7 months
                </span>
              </div>

              <div className="mt-8 flex h-52 items-end gap-3">

                {[45, 60, 40, 75, 55, 85, 65, 95, 70, 80, 60, 90].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-t-md bg-green-500/80 transition hover:bg-green-600"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  )
                )}

              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
import React from 'react'
import {Calendar1Icon,FileTextIcon,BadgeDollarSign} from 'lucide-react'
function DashboardCard({ dashboardData,user }) {
  
  const cards = [{
      icon: Calendar1Icon,
      value: dashboardData.summary.totalIncome,
      title: "Total Balance",
      subtitle: "This month",
    },
    {
      icon: FileTextIcon,
      value: dashboardData.summary.totalIncome,
      title: "Total Income",
      subtitle: "This month",
    },

    {
      icon: BadgeDollarSign,
      value: dashboardData.summary.totalExpense,
      title: "Total Expences",
      subtitle: "This month",
    },
    {
      icon: BadgeDollarSign,
      value: dashboardData.summary.savings,
      title: "Savings",
      subtitle: "This month",
    },
  ];
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8 w-full">
        {cards.map((ele, idx) => {
          return (
            <div
              key={idx}
              className="card-hover card p-5 sm:p-6 relative overflow-hidded group flex items-center justify-between "
            >
              <div className="">
                {/* slef colsing */}
                <div className=" absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70 transition-colors"></div>
                <p className="text-sm text-slate-700 font-medium">
                  {ele.title}
                </p>
                <p className="text-2xl font-bold text-slate-700">{ele.value}</p>
              </div>
              <ele.icon className="size-10 p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors" />
            </div>
          );
        })}
      </div>
      
    </div>
  )
}

export default DashboardCard

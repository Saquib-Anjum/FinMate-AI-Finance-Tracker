import React from "react";
import AIHeader from "../components/ai/AIHeader";
import ChatPanel from "../components/ai/ChatPanel";
import AIInsights from "../components/ai/AIInsights";

function AI_assistant() {
  return (
    <div className="min-h-full bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <AIHeader />

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ChatPanel />
          <AIInsights />
        </div>
      </div>
    </div>
  );
}

export default AI_assistant;
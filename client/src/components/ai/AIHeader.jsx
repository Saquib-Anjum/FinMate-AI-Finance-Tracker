import React from "react";
import { Sparkles, Plus } from "lucide-react";

function AIHeader({ onNewChat, loading }) {
  return (
    <header className="mb-8 flex items-center justify-between gap-4">
      <div>
        

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Your money, made smarter.
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Your personal AI companion for better financial decisions.
        </p>
      </div>

      <button
        onClick={onNewChat}
        disabled={loading}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 disabled:opacity-50 sm:px-4"
      >
        <Plus size={17} />
        <span className="hidden sm:inline">New chat</span>
      </button>
    </header>
  );
}

export default AIHeader;
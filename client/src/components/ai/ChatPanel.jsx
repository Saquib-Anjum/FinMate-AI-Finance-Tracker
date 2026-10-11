import React, { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, UserRound } from "lucide-react";
import api from "../../api/axios";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hey! 👋 I'm your FinMate AI. Ask me about your spending, budgets, or savings goals. Let's make your money work smarter.",
  },
];

const suggestions = [
  "Where does my money go this month?",
  "Am I staying within my budget?",
  "How much have I saved?",
  "How can I reduce my expenses?",
];

function ChatPanel({ onLoadingChange }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text = input) => {
    const question = text.trim();

    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);
    onLoadingChange?.(true);

    try {
      const { data } = await api.post("/ai", {
        question: question,
      });

      if (!data.success || !data.answer) {
        throw new Error("No AI response was received.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    if (loading) return;

    setMessages(initialMessages);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <section className="flex h-[min(720px,calc(100dvh-220px))] min-h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* Chat header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Sparkles size={20} />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">FinMate AI</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Your personal finance assistant
          </p>
        </div>

        <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI powered
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-6">
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isUser
                    ? "bg-slate-900 text-white"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isUser ? <UserRound size={17} /> : <Bot size={19} />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] ${
                  isUser ? "text-right" : ""
                }`}
              >
                <p className="mb-1.5 text-xs font-medium text-slate-400">
                  {isUser ? "You" : "FinMate AI"}
                </p>

                <div
                  className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "rounded-tr-md bg-emerald-600 text-left text-white"
                      : "rounded-tl-md bg-slate-50 text-left text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Sparkles size={18} />
            </div>

            <div className="flex gap-1 rounded-xl bg-slate-50 px-4 py-4">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"
                  style={{ animationDelay: `${dot * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4 sm:px-6">
          <p className="mb-3 text-xs font-medium text-slate-400">
            GET STARTED WITH
          </p>

          <div className="grid gap-2 sm:grid-cols-2">
            {suggestions.map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                disabled={loading}
                className="rounded-xl border border-slate-200 px-3 py-3 text-left text-xs leading-5 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-800 disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSend();
        }}
        className="border-t border-slate-100 p-4 sm:p-5"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-500/10">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about your finances..."
            className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="mt-3 text-center text-[10px] text-slate-400">
          FinMate AI can make mistakes. Verify important financial information.
        </p>
      </form>
    </section>
  );
}

export default ChatPanel;

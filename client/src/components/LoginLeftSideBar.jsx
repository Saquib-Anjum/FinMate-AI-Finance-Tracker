import React from "react";

function LoginLeftSideBar() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-green-50 px-10">
      <style>{`
        @keyframes fm-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fm-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fm-pop { from { opacity: 0; transform: scale(.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes fm-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(14px,-10px); } }

        .fm-float { animation: fm-float 6s ease-in-out infinite; }
        .fm-pop { opacity: 0; animation: fm-pop .9s cubic-bezier(.2,.8,.2,1) .1s forwards; }
        .fm-up-1 { opacity: 0; animation: fm-up .7s ease-out .5s forwards; }
        .fm-up-2 { opacity: 0; animation: fm-up .7s ease-out .7s forwards; }
        .fm-dot-a { animation: fm-drift 7s ease-in-out infinite; }
        .fm-dot-b { animation: fm-drift 9s ease-in-out 1s infinite reverse; }

        @media (prefers-reduced-motion: reduce) {
          .fm-float, .fm-dot-a, .fm-dot-b { animation: none; }
          .fm-pop, .fm-up-1, .fm-up-2 { animation: none; opacity: 1; }
        }
      `}</style>

      {/* Soft shapes behind the illustration */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-[58%] rounded-full bg-white" />
      <div className="fm-dot-a pointer-events-none absolute left-[12%] top-[16%] h-3 w-3 rounded-full bg-green-500/60" />
      <div className="fm-dot-b pointer-events-none absolute bottom-[22%] right-[12%] h-4 w-4 rounded-full bg-green-400/50" />
      <div className="fm-dot-a pointer-events-none absolute right-[18%] top-[20%] h-2 w-2 rounded-full bg-green-600/50" />

      {/* Illustration */}
      <div className="fm-pop relative z-10 w-full max-w-md">
        <img
          src="./login.png"
          alt=""
          className="fm-float mx-auto w-full select-none drop-shadow-xl"
          draggable="false"
        />
      </div>

      {/* Short text */}
      <div className="relative z-10 mt-8 text-center">
        <h1 className="fm-up-1 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
          Take control of your <span className="text-green-600">finances</span>
        </h1>
        <p className="fm-up-2 mt-2 text-sm text-slate-500">
          Track. Budget. Grow.
        </p>
      </div>
    </div>
  );
}

export default LoginLeftSideBar;

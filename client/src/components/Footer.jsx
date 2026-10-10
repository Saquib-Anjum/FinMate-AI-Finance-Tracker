import { Mail, ArrowUpRight } from "lucide-react";
//import finmateLogo from "../assets/finmate-logo.svg";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* ==================== BRAND ==================== */}
          <div className="md:col-span-2">
            {/* Logo */}
            <a href="#home" className="inline-flex items-center">
              <img src="./logo.svg" alt="FinMate" className="h-10 w-auto" />
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              A simple and intelligent way to track your expenses, manage
              budgets and achieve your financial goals.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-3">
              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-green-500 hover:text-green-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.13c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.72-1.52-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .3.21.65.79.54A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-green-500 hover:text-green-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[17px] w-[17px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 9H7.12v11.45H3.56V9z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-green-500 hover:text-green-600"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-[16px] w-[16px]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@finmate.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-green-500 hover:text-green-600"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* ==================== PRODUCT ==================== */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <a href="#features" className="transition hover:text-green-600">
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#why-finmate"
                  className="transition hover:text-green-600"
                >
                  Why FinMate
                </a>
              </li>

              <li>
                <a href="#pricing" className="transition hover:text-green-600">
                  Pricing
                </a>
              </li>

              <li>
                <a
                  href="#dashboard"
                  className="transition hover:text-green-600"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* ==================== COMPANY ==================== */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <a href="#about" className="transition hover:text-green-600">
                  About
                </a>
              </li>

              <li>
                <a
                  href="mailto:hello@finmate.com"
                  className="transition hover:text-green-600"
                >
                  Contact
                </a>
              </li>

              <li>
                <a href="#privacy" className="transition hover:text-green-600">
                  Privacy
                </a>
              </li>

              <li>
                <a href="#terms" className="transition hover:text-green-600">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ==================== BOTTOM ==================== */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FinMate. All rights reserved.</p>

          <a
            href="#home"
            className="inline-flex items-center gap-1 transition hover:text-green-600"
          >
            Back to top
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

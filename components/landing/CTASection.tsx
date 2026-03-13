"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();
  const { setIsRegisterWindowOpen } = useUIStore();
  return (
    <section className="relative py-24 px-6 bg-linear-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Ready to fire your
          <br />
          financial chaos?
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of freelancers who finally feel in control.
        </p>

        {/* CTA Button */}
        <div className="inline-block">
          <button
            className="group relative px-12 py-5 text-xl font-bold text-white bg-linear-to-r from-purple-600 via-blue-500 to-green-500 rounded-2xl bg-size-[200%_200%] animate-gradient-shift hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(88,166,255,0.4),0_0_40px_rgba(63,185,80,0.2)] animate-pulse-glow cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
              setIsRegisterWindowOpen(true);
            }}
          >
            <span className="relative z-10">Start Free — No Card Required</span>
          </button>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          14-day full access • Cancel anytime
        </p>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Bank-level encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>No credit card needed</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
      <p className="text-red-500 mt-4 text-center font-semibold text-sm">
        This is a high-level overview based on official IRS rules as of March
        2026 (tax year 2025/2026). Tax laws change annually (wage base,
        brackets, etc.). This is NOT tax advice. <br />
        Estimates only — always verify with IRS.gov, a CPA, or tax software like
        TurboTax. Consult a tax professional. Non-compliance can lead to
        penalties and interest.
      </p>
    </section>
  );
}

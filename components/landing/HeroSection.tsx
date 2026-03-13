export default function HeroSection() {
  return (
    <section className="relative overflow-hidden p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse [animation-delay:700ms]" />
      <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse [animation-delay:1000ms]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main Heading */}
        <div className="text-center mb-16 opacity-0 animate-fade-in-up">
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Smart Financial
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-green-600 bg-clip-text text-transparent">
              Command Center
            </span>
            <br />
            <span className="text-5xl md:text-6xl">for Freelancers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-4 font-medium">
            Know what you can safely spend — without thinking like an
            accountant.
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Your AI employee sends invoices by voice or text, schedules
            meetings, follows up on every unpaid invoice, and handles all the
            admin.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 opacity-0 animate-fade-in-up [animation-delay:100ms] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stop guessing your numbers
            </h3>
            <p className="text-gray-500 leading-relaxed">
              See exactly how much you can spend today, tomorrow, and next
              quarter — with live tax estimates baked in. No spreadsheets. No
              accountant brain required.
            </p>
          </div>

          {/* Card 2 - Highlighted */}
          <div className="bg-gradient-to-br from-cyan-600 via-purple-600 to-green-600 rounded-2xl p-8 shadow-2xl opacity-0 animate-fade-in-up [animation-delay:200ms] transform md:scale-105 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(8,145,178,0.3)]">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Your 24/7 autonomous AI employee
            </h3>
            <p className="text-white/90 leading-relaxed">
              It sends professional invoices (text or voice), schedules client
              meetings, politely chases late payments, files expenses, and keeps
              your projects on track — while you do the creative work.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 opacity-0 animate-fade-in-up [animation-delay:300ms] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              One dashboard. Total control.
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Clients • Projects • Income • Expenses • Quarterly taxes • Cash
              runway • AI task list.
              <br />
              Everything in one beautiful place.
            </p>
          </div>
        </div>

        {/* Safe to Spend Demo Card */}
        <div className="max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in-up [animation-delay:400ms]">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 shadow-2xl shadow-green-500/30">
            <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">
              Live Preview
            </p>
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">
              Safe to Spend
            </h2>
            <div className="font-mono text-6xl font-bold text-green-400 mb-4">
              $4,250.00
            </div>
            <p className="text-gray-400 text-sm">After taxes and expenses</p>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-700">
              <div>
                <p className="text-gray-500 text-xs mb-1">Tax Reserved</p>
                <p className="font-mono text-amber-400 font-semibold">$1,340</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">Unpaid Invoices</p>
                <p className="font-mono text-red-400 font-semibold">$1,950</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">This Month</p>
                <p className="font-mono text-cyan-400 font-semibold">$2,270</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

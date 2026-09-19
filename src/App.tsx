import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReportIssue from "./pages/ReportIssue";
import TrackComplaint from "./pages/TrackComplaintPage.tsx";
import OfficerDashboard from "./pages/OfficerDashboard";
import AILogic from "./pages/AILogic";

import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MapPin,
  MessageSquareText,
  Mic,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white shadow-lg">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-950">
                Jan-Seva AI
              </h1>

              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Public Grievance Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-blue-700"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="transition hover:text-blue-700"
            >
              Features
            </a>

            <Link
              to="/track"
              className="transition hover:text-blue-700"
            >
              Track
            </Link>

            <Link
              to="/officer"
              className="transition hover:text-blue-700"
            >
              Officer
            </Link>

            <Link
              to="/logic"
              className="transition hover:text-blue-700"
            >
              AI Logic
            </Link>

            <a
              href="#about"
              className="transition hover:text-blue-700"
            >
              About
            </a>
          </nav>

          <Link
            to="/report"
            className="hidden rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 sm:block"
          >
            Report an Issue
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(14,165,233,0.08),transparent_30%)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Sparkles size={16} />
                AI-powered public service routing
              </div>

              <h2 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">
                Speak your problem.
                <span className="block text-blue-700">
                  Jan-Seva finds the right authority.
                </span>
              </h2>

              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Report civic problems in your own language. Jan-Seva AI
                understands your complaint, identifies the responsible
                department, calculates urgency, and helps you track what
                happens next.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/report"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800"
                >
                  Report an Issue

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  to="/track"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  Track Complaint
                  <ChevronRight size={18} />
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  22 Scheduled Languages
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Voice & Text
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green-600" />
                  Transparent AI
                </div>
              </div>
            </div>

            {/* AI DEMO CARD */}
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-5 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                      AI ANALYSIS PREVIEW
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Grievance Intelligence
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    AI Ready
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                      <Mic size={20} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Citizen Complaint
                      </p>

                      <p className="mt-2 leading-6 text-slate-700">
                        “మా కాలనీలో డ్రైనేజీ నీళ్లు రోడ్డుపైకి వస్తున్నాయి.
                        పిల్లలు స్కూల్‌కి వెళ్లడానికి ఇబ్బంది పడుతున్నారు.”
                      </p>
                    </div>
                  </div>

                  <div className="my-5 h-px bg-slate-100" />

                  <div className="grid grid-cols-2 gap-3">
                    <AnalysisItem label="Language" value="Telugu" />

                    <AnalysisItem
                      label="Issue"
                      value="Drainage Overflow"
                    />

                    <AnalysisItem
                      label="Department"
                      value="Water & Sanitation"
                    />

                    <AnalysisItem
                      label="Authority"
                      value="Local Government"
                    />
                  </div>

                  <div className="mt-4 rounded-2xl bg-red-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Priority Score
                      </span>

                      <span className="text-2xl font-extrabold text-red-600">
                        91/100
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-red-100">
                      <div className="h-full w-[91%] rounded-full bg-red-500" />
                    </div>

                    <p className="mt-2 text-xs font-medium text-red-700">
                      HIGH PRIORITY · Public safety risk detected
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
  <span>Sample Tracking ID</span>

  <span className="font-mono font-semibold text-blue-400">
    GR-8921
  </span>
</div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
            <Stat value="22" label="Scheduled Languages" />
            <Stat value="0–100" label="Explainable Priority" />
            <Stat value="AI" label="Smart Classification" />
            <Stat value="Anytime" label="Digital Access" />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="From citizen voice to the right authority"
              description="Jan-Seva removes the complexity of government departments from the citizen experience."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-4">
              <ProcessCard
                number="01"
                icon={<MessageSquareText size={24} />}
                title="Tell Us"
                description="Type, speak, or upload a photo describing the problem."
              />

              <ProcessCard
                number="02"
                icon={<Brain size={24} />}
                title="AI Understands"
                description="AI detects language, identifies the issue, and summarizes the complaint."
              />

              <ProcessCard
                number="03"
                icon={<Zap size={24} />}
                title="AI Routes"
                description="The system calculates urgency and identifies the responsible authority."
              />

              <ProcessCard
                number="04"
                icon={<MapPin size={24} />}
                title="Track"
                description="Receive a tracking ID and follow the complaint through resolution."
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="bg-slate-950 px-6 py-24 text-white">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              dark
              eyebrow="BUILT FOR EVERY CITIZEN"
              title="Simple on the outside. Intelligent underneath."
              description="A citizen-first interface powered by explainable AI and scalable government routing."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              <FeatureCard
                icon={<Globe2 size={24} />}
                title="Multilingual by Design"
                description="Citizens can interact in India's Scheduled Languages instead of navigating a language barrier."
              />

              <FeatureCard
                icon={<Mic size={24} />}
                title="Voice-First Reporting"
                description="Speak naturally instead of typing long descriptions. Browser voice input makes reporting faster."
              />

              <FeatureCard
                icon={<Brain size={24} />}
                title="Explainable AI"
                description="See why a complaint received its priority score and why it was routed to a department."
              />

              <FeatureCard
  icon={<MapPin size={24} />}
  title="Location-Aware Context"
  description="Capture location information as contextual evidence that can support future location-aware grievance routing."
/>

              <FeatureCard
                icon={<ShieldCheck size={24} />}
                title="Transparent Decisions"
                description="The AI Logic Viewer shows the complete journey from complaint to authority."
              />

              <FeatureCard
                icon={<Zap size={24} />}
                title="Priority Intelligence"
                description="Urgency is scored from 0 to 100 using public safety, health, impact, and people affected."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="bg-blue-700 px-6 py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              Government services should understand citizens.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              Jan-Seva AI turns everyday complaints into structured,
              explainable, actionable government requests.
            </p>

            <Link
              to="/report"
              className="mt-8 flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-xl transition hover:bg-blue-50"
            >
              Report a Problem
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-8 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm md:flex-row">
          <div>
            <p className="font-semibold text-white">Jan-Seva AI</p>

            <p className="mt-1">
              AI-powered public grievance routing.
            </p>
          </div>

          <p className="self-end">Built for Hack Devengers 2.0</p>
        </div>
      </footer>
    </div>
  );
}

function AnalysisItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="border-slate-200 px-6 py-8 text-center even:border-x md:border-r md:last:border-r-0">
      <p className="text-3xl font-extrabold text-blue-700">
        {value}
      </p>

      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <p
        className={`text-xs font-bold tracking-[0.2em] ${
          dark ? "text-blue-400" : "text-blue-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-4xl font-extrabold tracking-tight ${
          dark ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-4 text-lg leading-8 ${
          dark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function ProcessCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          {icon}
        </div>

        <span className="font-mono text-sm font-bold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="mt-6 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500">
      <div className="inline-flex rounded-xl bg-blue-500/10 p-3 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold">{title}</h3>

      <p className="mt-2 leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/track" element={<TrackComplaint />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/logic" element={<AILogic />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
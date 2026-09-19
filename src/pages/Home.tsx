import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  Languages,
  MapPin,
  Mic,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const languages = [
  "हिन्दी",
  "తెలుగు",
  "தமிழ்",
  "ಕನ್ನಡ",
  "മലയാളം",
  "मराठी",
  "বাংলা",
  "ગુજરાતી",
  "ਪੰਜਾਬੀ",
  "ଓଡ଼ିଆ",
  "অসমীয়া",
  "اردو",
  "संस्कृतम्",
  "नेपाली",
  "कोंकणी",
  "मैथिली",
  "डोगरी",
  "संथाली",
  "कश्मीरी",
  "बोडो",
  "मणिपुरी",
  "ਪੰਜਾਬੀ",
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ShieldCheck size={22} />
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-slate-950">
              Jan-Seva AI
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Public Grievance Intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            Features
          </a>

          <Link
            to="/ai-logic"
            className="text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            AI Logic
          </Link>

          <Link
            to="/track"
            className="text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            Track Complaint
          </Link>

          <Link
            to="/officer"
            className="text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            Officer Dashboard
          </Link>
        </nav>

        <Link
          to="/report"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Report Issue
          <ArrowRight size={16} />
        </Link>
      </div>
    </header>
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
        {icon}
      </div>

      <h3 className="text-lg font-bold text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              AI-powered public grievance routing
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
              Speak your problem.
              <span className="block text-blue-600">
                Jan-Seva finds the right authority.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Report civic problems in your own language. Jan-Seva AI
              understands your complaint, identifies the issue, estimates
              urgency, and suggests the appropriate government service path.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Report a Problem
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
              >
                Track Complaint
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Voice & text
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                22 scheduled languages
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-600" />
                Explainable AI
              </span>
            </div>
          </div>

          {/* HERO DEMO */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/40">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Citizen Complaint
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Telugu complaint
                  </p>
                </div>

                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                  AI Ready
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <Mic size={19} className="text-blue-600" />
                  </div>

                  <p className="text-sm leading-7 text-slate-700">
                    మా ప్రాంతంలో డ్రైనేజీ సమస్య చాలా తీవ్రంగా ఉంది. రోడ్డు
                    మొత్తం మురుగునీటితో నిండిపోయింది.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain size={19} className="text-blue-700" />
                    <p className="font-bold text-slate-900">AI Analysis</p>
                  </div>

                  <span className="text-xs font-bold text-blue-700">
                    Complete
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      Water & Sanitation
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      Priority
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-red-600">
                      91/100
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      Authority
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      Local Government
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-[11px] font-bold uppercase text-slate-400">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-bold text-green-700">
                      Ready to Route
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Context</p>
                  <p className="text-sm font-bold text-slate-800">
                    Location available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGE STRIP */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Languages size={21} className="text-blue-600" />
              </div>

              <div>
                <p className="font-bold text-slate-900">
                  Built for India&apos;s linguistic diversity
                </p>
                <p className="text-sm text-slate-500">
                  Interface and AI workflow designed around India&apos;s 22
                  Scheduled Languages.
                </p>
              </div>
            </div>

            <div className="flex max-w-xl flex-wrap gap-2">
              {languages.slice(0, 11).map((language) => (
                <span
                  key={language}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
              From citizen voice to actionable routing
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Jan-Seva turns an unstructured complaint into a structured,
              explainable grievance record.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: <Mic size={22} />,
                title: "Speak or Type",
                text: "Describe your problem naturally using voice or text in a supported Indian language.",
              },
              {
                number: "02",
                icon: <Brain size={22} />,
                title: "AI Understands",
                text: "The system classifies the issue, estimates urgency, and explains the signals used.",
              },
              {
                number: "03",
                icon: <Target size={22} />,
                title: "Route & Track",
                text: "A department and authority level are suggested, with a tracking ID for follow-up.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-200 bg-slate-50 p-7"
              >
                <span className="text-sm font-extrabold text-blue-600">
                  {step.number}
                </span>

                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                  {step.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Core Features
            </p>

            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
              Designed around the citizen journey
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Globe2 size={21} />}
              title="Multilingual Reporting"
              description="Citizens can choose from India's Scheduled Languages and describe their issue naturally."
            />

            <FeatureCard
              icon={<Mic size={21} />}
              title="Voice & Text"
              description="Use browser-supported speech input or type a complaint without navigating complex government forms."
            />

            <FeatureCard
              icon={<Brain size={21} />}
              title="AI Classification"
              description="Convert an unstructured complaint into category, subcategory, department and authority information."
            />

            <FeatureCard
              icon={<Target size={21} />}
              title="Priority Score"
              description="Generate a 0–100 urgency score using complaint signals and explain the factors behind it."
            />

            <FeatureCard
              icon={<MapPin size={21} />}
              title="Contextual Location"
              description="Optional location information can be attached as supporting context for the grievance."
            />

            <FeatureCard
              icon={<Clock3 size={21} />}
              title="Track Progress"
              description="A tracking ID lets citizens view the current status of their submitted grievance."
            />

            <FeatureCard
              icon={<UserRound size={21} />}
              title="Officer Dashboard"
              description="Officers can review grievances, inspect evidence and update complaint status."
            />

            <FeatureCard
              icon={<ShieldCheck size={21} />}
              title="Explainable AI"
              description="The AI decision view makes the classification and routing reasoning visible."
            />

            <FeatureCard
              icon={<Sparkles size={21} />}
              title="Local Fallback"
              description="A browser-side fallback classifier keeps the core demo functional when the AI service is unavailable."
            />
          </div>
        </div>
      </section>

      {/* AI LOGIC */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Transparent AI
              </p>

              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                Don&apos;t just give a route. Explain it.
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Jan-Seva AI is designed so the classification process can be
                inspected. Citizens and evaluators can see the signals used to
                determine category, urgency and routing.
              </p>

              <Link
                to="/ai-logic"
                className="mt-7 inline-flex items-center gap-2 font-bold text-blue-700 hover:text-blue-800"
              >
                Explore AI Logic
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                {[
                  ["Complaint", "Unstructured citizen input"],
                  ["Language", "Detected / selected language"],
                  ["Classification", "Issue category + subcategory"],
                  ["Urgency", "Priority score from 0–100"],
                  ["Routing", "Department + authority level"],
                  ["Evidence", "Reasoning and supporting context"],
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-extrabold text-blue-700">
                      {index + 1}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {label}
                      </p>
                      <p className="text-xs text-slate-500">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Have a public problem?
              </h2>

              <p className="mt-3 leading-7 text-blue-100">
                Tell Jan-Seva AI what happened. We&apos;ll turn your complaint
                into a structured grievance record.
              </p>
            </div>

            <Link
              to="/report"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:bg-blue-50"
            >
              Start a Complaint
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-slate-900">Jan-Seva AI</p>
            <p className="mt-1">
              Multilingual AI-assisted public grievance routing.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link to="/report" className="hover:text-blue-700">
              Report
            </Link>

            <Link to="/track" className="hover:text-blue-700">
              Track
            </Link>

            <Link to="/officer" className="hover:text-blue-700">
              Officer Dashboard
            </Link>

            <Link to="/ai-logic" className="hover:text-blue-700">
              AI Logic
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
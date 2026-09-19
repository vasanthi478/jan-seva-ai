import { useState } from "react";
import {
  ArrowDown,
  Brain,
  CheckCircle2,
  FileText,
  Gauge,
  Globe2,
  ImagePlus,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";

export default function AILogic() {
  const [trackingId, setTrackingId] = useState("");
  const [grievance, setGrievance] = useState<any>(null);

  const findGrievance = () => {
    const data = JSON.parse(
      localStorage.getItem("janSevaGrievances") || "[]"
    );

    const result = data.find(
      (item: any) =>
        item.tracking_id?.toLowerCase() ===
        trackingId.trim().toLowerCase()
    );

    setGrievance(result || null);
  };

  const steps = grievance
    ? [
        {
          icon: <FileText size={22} />,
          title: "Citizen Complaint",
          value: grievance.complaint,
          description:
            "Original complaint submitted by the citizen.",
        },
        {
          icon: <Globe2 size={22} />,
          title: "Language Detection",
          value: grievance.language,
          description:
            "AI identifies the language used by the citizen.",
        },
        {
          icon: <Brain size={22} />,
          title: "AI Understanding",
          value: grievance.summary,
          description:
            "Gemini converts the complaint into a structured understanding.",
        },
        {
          icon: <Route size={22} />,
          title: "Issue Classification",
          value: `${grievance.category} → ${grievance.subcategory}`,
          description:
            "The complaint is classified into a government service domain.",
        },
        {
          icon: <Gauge size={22} />,
          title: "Priority Analysis",
          value: `${grievance.urgency_score}/100 — ${grievance.urgency}`,
          description:
            "AI evaluates urgency using safety, health and public impact.",
        },
        {
          icon: <ShieldCheck size={22} />,
          title: "Department Routing",
          value: grievance.department,
          description:
            "The complaint is routed to the relevant government department.",
        },
        {
          icon: <MapPin size={22} />,
          title: "Authority Selection",
          value: grievance.authority_level,
          description:
            "The appropriate government authority level is identified.",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
              <Brain size={22} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                Jan-Seva AI
              </h1>

              <p className="text-xs text-slate-500">
                Transparent AI Logic
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            AI Logic Viewer
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            How Jan-Seva AI Decides
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Follow the complete reasoning pipeline from a citizen complaint
            to the responsible government authority.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl gap-3">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") findGrievance();
            }}
            placeholder="Enter Tracking ID e.g. GR-MR42OK"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={findGrievance}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            View Logic
          </button>
        </div>

        {!grievance && (
          <div className="mt-10 rounded-2xl border bg-white p-10 text-center shadow-sm">
            <Brain
              size={44}
              className="mx-auto text-blue-500"
            />

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Enter a grievance tracking ID
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Example: GR-MR42OK
            </p>
          </div>
        )}

        {trackingId && !grievance && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
            No grievance found with this tracking ID.
          </div>
        )}

        {grievance && (
          <div className="mt-10">
            <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Tracking ID
                  </p>

                  <p className="mt-1 font-mono text-2xl font-bold text-blue-600">
                    {grievance.tracking_id}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 size={17} />
                  AI Analysis Complete
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={step.title}>
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        {step.icon}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                          Step {index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {step.title}
                        </h3>

                        <p className="mt-2 break-words font-semibold text-slate-800">
                          {step.value}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown
                        size={20}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* LOCATION + EVIDENCE */}
            {(grievance.location || grievance.photo) && (
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {grievance.location && (
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <MapPin size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Complaint Location
                        </h3>

                        <p className="text-xs text-slate-500">
                          Location used as routing context
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                      {grievance.location}
                    </p>
                  </div>
                )}

                {grievance.photo && (
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <ImagePlus size={21} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          Evidence Photo
                        </h3>

                        <p className="text-xs text-slate-500">
                          Evidence attached by the citizen
                        </p>
                      </div>
                    </div>

                    <img
                      src={grievance.photo}
                      alt="Complaint evidence"
                      className="mt-5 max-h-72 w-full rounded-xl border border-slate-200 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* REASONING */}
            {grievance.reasoning?.length > 0 && (
              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-700 p-2.5 text-white">
                    <Brain size={20} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Why did AI make this decision?
                    </h3>

                    <p className="text-xs text-slate-500">
                      Explainable AI reasoning stored with the grievance
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {grievance.reasoning.map(
                    (reason: string, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 rounded-xl bg-white p-4"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-blue-700"
                        />

                        <p className="text-sm text-slate-700">
                          {reason}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Decision Pipeline
              </p>

              <p className="mt-3 font-mono text-sm leading-8 text-slate-300">
                Complaint → Language → Understanding → Classification →
                Priority → Department → Authority
              </p>

              {(grievance.location || grievance.photo) && (
                <p className="mt-2 font-mono text-sm leading-8 text-slate-400">
                  Location + Evidence → Routing Context
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

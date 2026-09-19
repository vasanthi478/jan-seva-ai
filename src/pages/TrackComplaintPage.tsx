import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  ArrowLeft,
  MapPin,
  ImagePlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TrackComplaint() {
  const navigate = useNavigate();

  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const complaints = JSON.parse(
      localStorage.getItem("janSevaGrievances") || "[]"
    );

    const result = complaints.find(
      (item: any) =>
        item.tracking_id?.toLowerCase() ===
        trackingId.trim().toLowerCase()
    );

    setComplaint(result || null);
    setSearched(true);
  };

  const steps = [
    "Submitted",
    "AI Classified",
    "Department Assigned",
    "In Progress",
    "Resolved",
  ];

  const statusIndex = complaint
    ? steps.indexOf(complaint.status)
    : -1;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <div className="font-bold text-blue-600">
            Jan-Seva AI
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Grievance Tracking
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Track Your Complaint
          </h1>

          <p className="mt-3 text-slate-500">
            Enter your tracking ID to view your grievance status.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl gap-3">
          <input
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="GR-MR42OK"
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSearch}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Search size={18} />
            Track
          </button>
        </div>

        {searched && !complaint && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-center text-red-700">
            No grievance found with this tracking ID.
          </div>
        )}

        {complaint && (
          <div className="mt-10 space-y-6">
            {/* GRIEVANCE DETAILS */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-slate-400">
                TRACKING ID
              </p>

              <h2 className="mt-1 text-2xl font-bold text-blue-600">
                {complaint.tracking_id}
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">CATEGORY</p>
                  <p className="mt-1 font-semibold">
                    {complaint.category}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">DEPARTMENT</p>
                  <p className="mt-1 font-semibold">
                    {complaint.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">PRIORITY</p>
                  <p className="mt-1 font-semibold">
                    {complaint.urgency_score}/100 —{" "}
                    {complaint.urgency}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400">AUTHORITY</p>
                  <p className="mt-1 font-semibold">
                    {complaint.authority_level}
                  </p>
                </div>
              </div>
            </div>

            {/* LOCATION + PHOTO */}
            {(complaint.location || complaint.photo) && (
              <div className="grid gap-6 md:grid-cols-2">
                {complaint.location && (
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <MapPin size={21} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Complaint Location
                        </h2>

                        <p className="text-xs text-slate-500">
                          Location captured during submission
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {complaint.location}
                      </p>
                    </div>
                  </div>
                )}

                {complaint.photo && (
                  <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                        <ImagePlus size={21} />
                      </div>

                      <div>
                        <h2 className="font-bold text-slate-900">
                          Evidence Photo
                        </h2>

                        <p className="text-xs text-slate-500">
                          Photo attached to the grievance
                        </p>
                      </div>
                    </div>

                    <img
                      src={complaint.photo}
                      alt="Complaint evidence"
                      className="mt-5 max-h-72 w-full rounded-xl border border-slate-200 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STATUS */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Complaint Status
              </h2>

              <div className="mt-8 space-y-6">
                {steps.map((step, index) => {
                  const completed = index <= statusIndex;

                  return (
                    <div
                      key={step}
                      className="flex items-center gap-4"
                    >
                      {completed ? (
                        <CheckCircle2
                          size={28}
                          className="text-green-500"
                        />
                      ) : (
                        <Circle
                          size={28}
                          className="text-slate-300"
                        />
                      )}

                      <p
                        className={`font-semibold ${
                          completed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">
                Complaint Summary
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {complaint.summary}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

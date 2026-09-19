import { useEffect, useState } from "react";
import {
  MapPin,
  ImagePlus,
  CheckCircle2,
  Circle,
} from "lucide-react";

type Grievance = {
  tracking_id: string;
  category: string;
  subcategory: string;
  department: string;
  urgency_score: number;
  urgency: string;
  summary: string;
  status: string;
  location?: string;
  photo?: string;
};

const statuses = [
  "Submitted",
  "AI Classified",
  "Department Assigned",
  "In Progress",
  "Resolved",
];

export default function OfficerDashboard() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);

  useEffect(() => {
    loadGrievances();
  }, []);

  function loadGrievances() {
    try {
      const data = localStorage.getItem("janSevaGrievances");

      if (data) {
        setGrievances(JSON.parse(data));
      }
    } catch (error) {
      console.error(error);
    }
  }

  function updateStatus(id: string, status: string) {
    const updated = grievances.map((item) => {
      if (item.tracking_id === id) {
        return {
          ...item,
          status,
        };
      }

      return item;
    });

    localStorage.setItem(
      "janSevaGrievances",
      JSON.stringify(updated)
    );

    setGrievances(updated);
  }

  const highPriority = grievances.filter(
    (item) => item.urgency_score >= 60
  ).length;

  const inProgress = grievances.filter(
    (item) => item.status === "In Progress"
  ).length;

  const resolved = grievances.filter(
    (item) => item.status === "Resolved"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-bold text-blue-700">
            Jan-Seva AI
          </h1>

          <p className="text-sm text-slate-500">
            Officer Command Center
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Officer Dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Manage citizen grievances and update their status.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Complaints
            </p>

            <p className="mt-2 text-3xl font-bold">
              {grievances.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">
              High Priority
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {highPriority}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {inProgress}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolved}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border bg-white">
          <div className="border-b p-6">
            <h3 className="text-xl font-bold">
              Citizen Grievances
            </h3>
          </div>

          {grievances.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No grievances found.
            </div>
          ) : (
            <div>
              {grievances.map((item) => (
                <div
                  key={item.tracking_id}
                  className="border-b p-6 last:border-b-0"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row">
                    <div className="flex-1">
                      <p className="font-mono font-bold text-blue-600">
                        {item.tracking_id}
                      </p>

                      <h4 className="mt-2 text-lg font-bold">
                        {item.subcategory}
                      </h4>

                      <p className="mt-2 text-sm text-slate-600">
                        {item.summary}
                      </p>

                      <div className="mt-4 space-y-1 text-sm text-slate-500">
                        <p>
                          <b>Category:</b> {item.category}
                        </p>

                        <p>
                          <b>Department:</b> {item.department}
                        </p>

                        <p>
                          <b>Priority:</b>{" "}
                          {item.urgency_score}/100 —{" "}
                          {item.urgency}
                        </p>
                      </div>

                      {/* LOCATION */}
                      {item.location && (
                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={18}
                              className="text-blue-700"
                            />

                            <p className="text-sm font-bold text-slate-800">
                              Complaint Location
                            </p>
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-600">
                            {item.location}
                          </p>
                        </div>
                      )}

                      {/* PHOTO */}
                      {item.photo && (
                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-2">
                            <ImagePlus
                              size={18}
                              className="text-blue-700"
                            />

                            <p className="text-sm font-bold text-slate-800">
                              Evidence Photo
                            </p>
                          </div>

                          <img
                            src={item.photo}
                            alt="Complaint evidence"
                            className="mt-3 max-h-72 w-full rounded-xl border border-slate-200 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {/* STATUS */}
                    <div className="w-full md:w-56">
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Update Status
                      </p>

                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateStatus(
                            item.tracking_id,
                            e.target.value
                          )
                        }
                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Current Status
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          {item.status === "Resolved" ? (
                            <CheckCircle2
                              size={18}
                              className="text-green-600"
                            />
                          ) : (
                            <Circle
                              size={18}
                              className="text-blue-600"
                            />
                          )}

                          <p className="text-sm font-semibold text-slate-700">
                            {item.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

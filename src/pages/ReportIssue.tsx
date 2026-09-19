import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  analyzeGrievance,
  type GrievanceAnalysis,
} from "../services/gemini";

const languages = [
  "Assamese",
  "Bengali",
  "Bodo",
  "Dogri",
  "English",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kashmiri",
  "Konkani",
  "Maithili",
  "Malayalam",
  "Manipuri",
  "Marathi",
  "Nepali",
  "Odia",
  "Punjabi",
  "Sanskrit",
  "Santali",
  "Sindhi",
  "Tamil",
  "Telugu",
  "Urdu",
];

function ReportIssue() {
  const [language, setLanguage] = useState("Telugu");
  const [complaint, setComplaint] = useState("");
  const [analysis, setAnalysis] =
    useState<GrievanceAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [listening, setListening] = useState(false);

  const [trackingId, setTrackingId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [location, setLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [photo, setPhoto] = useState("");

  const recognitionRef = useRef<any>(null);

  // ---------------- VOICE INPUT ----------------

  const startVoiceInput = () => {
    const SpeechRecognition =
  (window as any).SpeechRecognition ||
  (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(
        "Voice input is not supported in this browser. Please use Chrome or type your complaint."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = getSpeechLanguage(language);
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
      setError("");
    };

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setComplaint(transcript);
    };

    recognition.onerror = () => {
      setListening(false);
      setError(
        "Voice input failed. Please try again or type your complaint."
      );
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceInput = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  // ---------------- LOCATION ----------------

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location is not supported by this browser.");
      return;
    }

    setLocationLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLocationLoading(false);
      },
      () => {
        setError("Unable to get your location. Please allow location access and try again.");
        setLocationLoading(false);
      }
    );
  };

  // ---------------- PHOTO ----------------

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  // ---------------- AI ANALYSIS ----------------

  const handleAnalyze = async () => {
    setError("");

    if (!complaint.trim()) {
      setError("Please describe your problem first.");
      return;
    }

    if (complaint.trim().length < 10) {
      setError(
        "Please provide a little more detail about the problem."
      );
      return;
    }

    setLoading(true);
    setAnalysis(null);
    setSubmitted(false);
    setTrackingId("");

    try {
      const result = await analyzeGrievance(
        complaint.trim(),
        language
      );

      setAnalysis(result);
    } catch (err) {
      console.error("Gemini error:", err);

      setError(
        "AI analysis failed. Please check your Gemini API key, internet connection, and browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE GRIEVANCE ----------------

  const handleCreateGrievance = () => {
    if (!analysis) return;

    const id = `GR-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    const now = new Date().toISOString();

    const grievance = {
      id,
      tracking_id: id,
      complaint: complaint.trim(),
      language,

      category: analysis.category,
      subcategory: analysis.subcategory,
      department: analysis.department,
      authority_level: analysis.authority_level,

      location,
      photo,

      urgency_score: analysis.urgency_score,
      urgency: analysis.urgency,

      safety_risks: analysis.safety_risks,
      summary: analysis.summary,
      estimated_resolution: analysis.estimated_resolution,
      reasoning: analysis.reasoning,

      status: "Submitted",

      created_at: now,
      updated_at: now,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("janSevaGrievances") || "[]"
      );

      existing.push(grievance);

      localStorage.setItem(
        "janSevaGrievances",
        JSON.stringify(existing)
      );

      setTrackingId(id);
      setSubmitted(true);
    } catch (err) {
      console.error("Storage error:", err);

      setError(
        "Unable to save the grievance on this device. Please try again."
      );
    }
  };

  // ---------------- EDIT COMPLAINT ----------------

  const handleBack = () => {
    setAnalysis(null);
    setSubmitted(false);
    setTrackingId("");
    setError("");
  };

  // ---------------- RESULT SCREEN ----------------

  if (analysis) {
    return (
     <AnalysisResult
        analysis={analysis}
        complaint={complaint}
        location={location}
        photo={photo}
        onBack={handleBack}
        onCreateGrievance={handleCreateGrievance}
        trackingId={trackingId}
        submitted={submitted}
      />
    );
  }

  // ---------------- REPORT FORM ----------------

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-700 transition hover:text-blue-700"
          >
            <ArrowLeft size={19} />

            <div>
              <p className="font-bold text-slate-950">
                Jan-Seva AI
              </p>

              <p className="text-xs text-slate-500">
                Public Grievance Intelligence
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-green-700">
            <ShieldCheck size={16} />
            Secure Submission
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
            Report a Public Issue
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950">
            Tell us what happened
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Describe the problem in your own language. Jan-Seva AI
            will understand it and identify the appropriate
            government authority.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {/* LANGUAGE */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Select your language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            >
              {languages.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <p className="mt-2 text-xs text-slate-500">
              Jan-Seva AI supports India's 22 Scheduled Languages.
            </p>
          </div>

          {/* COMPLAINT */}
          <div className="mt-7">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-bold text-slate-800">
                Describe your problem
              </label>

              <button
                type="button"
                onClick={
                  listening
                    ? stopVoiceInput
                    : startVoiceInput
                }
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  listening
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {listening ? (
                  <>
                    <MicOff size={16} />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    Speak
                  </>
                )}
              </button>
            </div>

            {listening && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                Listening... speak your complaint
              </div>
            )}

            <textarea
              value={complaint}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  setComplaint(e.target.value);
                }
              }}
              rows={7}
              placeholder="Example: మా కాలనీలో డ్రైనేజీ నీళ్లు రోడ్డుపైకి వస్తున్నాయి..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-4 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>
                Type naturally. AI will understand the context.
              </span>

              <span>{complaint.length} / 1000</span>
            </div>
          </div>

          {/* LOCATION + PHOTO */}
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 text-left transition hover:border-blue-400 hover:bg-blue-50 disabled:opacity-60"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <MapPin size={22} />
              </div>

              <div>
                <p className="font-bold text-slate-800">
                  {locationLoading ? "Getting Location..." : location ? "Location Added" : "Add Location"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {location ? location : "Use your current location to help identify the local authority."}
                </p>
              </div>
            </button>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 text-left transition hover:border-blue-400 hover:bg-blue-50">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <ImagePlus size={22} />
              </div>

              <div className="min-w-0">
                <p className="font-bold text-slate-800">
                  {photo ? "Photo Added" : "Add Photo"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {photo ? "Evidence photo selected successfully." : "Optional evidence can help understand the issue."}
                </p>
              </div>

              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
          </div>

          {photo && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <img src={photo} alt="Complaint evidence preview" className="max-h-64 w-full rounded-xl object-contain" />
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertTriangle
                size={20}
                className="shrink-0"
              />

              <p>{error}</p>
            </div>
          )}

          {/* SECURITY */}
          <div className="mt-7 rounded-2xl bg-slate-50 p-4">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Your complaint is handled securely
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Your information is used to understand, classify,
                  route, and track the grievance.
                </p>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-4 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                AI is analyzing your complaint...
              </>
            ) : (
              <>
                <Brain size={19} />
                Analyze & Submit Complaint
                <Send size={17} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

// ============================================================
// AI RESULT
// ============================================================

function AnalysisResult({
  analysis,
  complaint,
  location,
  photo,
  onBack,
  onCreateGrievance,
  trackingId,
  submitted,
}: {
  analysis: GrievanceAnalysis;
  complaint: string;
  location: string;
  photo: string;
  onBack: () => void;
  onCreateGrievance: () => void;
  trackingId: string;
  submitted: boolean;
}) {
  const priority = Math.min(
    100,
    Math.max(0, analysis.urgency_score)
  );

  const priorityColor =
    priority >= 85
      ? "text-red-600"
      : priority >= 60
        ? "text-orange-600"
        : "text-green-600";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-semibold text-slate-700 hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Edit Complaint
          </button>

          <div className="flex items-center gap-2 text-sm font-bold text-green-700">
            <CheckCircle2 size={18} />
            AI Analysis Complete
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* SUCCESS SCREEN */}
        {submitted ? (
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2
                size={42}
                className="text-green-600"
              />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-green-600">
              Grievance Submitted Successfully
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
              Your complaint has been registered
            </h1>

            <p className="mt-4 text-slate-600">
              Keep your tracking ID safe. You can use it to check
              the status of your grievance.
            </p>

            <div className="mt-8 rounded-3xl border border-blue-200 bg-white p-8 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Your Tracking ID
              </p>

              <p className="mt-3 text-4xl font-black tracking-wider text-blue-700">
                {trackingId}
              </p>

              <div className="mt-6 grid gap-3 text-left sm:grid-cols-2">
                <ResultItem
                  label="Department"
                  value={analysis.department}
                />

                <ResultItem
                  label="Priority"
                  value={`${priority}/100 — ${analysis.urgency}`}
                />

                <ResultItem
                  label="Category"
                  value={analysis.category}
                />

                <ResultItem
                  label="Status"
                  value="Submitted"
                />

                {location && (
                  <ResultItem
                    label="Location"
                    value={location}
                  />
                )}

                {photo && (
                  <ResultItem
                    label="Evidence"
                    value="Photo attached"
                  />
                )}
              </div>

              {photo && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <img
                    src={photo}
                    alt="Complaint evidence"
                    className="max-h-64 w-full rounded-xl object-contain"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/"
                className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
              >
                Back to Home
              </Link>

              <button
                onClick={onBack}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                AI Analysis
              </p>

              <h1 className="mt-2 text-4xl font-extrabold text-slate-950">
                Your complaint has been understood
              </h1>

              <p className="mt-3 text-slate-600">
                Jan-Seva AI analyzed the complaint and identified a
                likely routing path.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* PRIORITY */}
              <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Priority
                </p>

                <div className="mt-5 flex items-end gap-2">
                  <span
                    className={`text-6xl font-black ${priorityColor}`}
                  >
                    {priority}
                  </span>

                  <span className="mb-2 text-slate-500">
                    /100
                  </span>
                </div>

                <p className="mt-2 font-bold">
                  {analysis.urgency}
                </p>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${priority}%`,
                    }}
                  />
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-400">
                  {analysis.summary}
                </p>
              </div>

              {/* ROUTING */}
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm lg:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                  Government Routing
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <ResultItem
                    label="Language"
                    value={analysis.language}
                  />

                  <ResultItem
                    label="Category"
                    value={analysis.category}
                  />

                  <ResultItem
                    label="Subcategory"
                    value={analysis.subcategory}
                  />

                  <ResultItem
                    label="Department"
                    value={analysis.department}
                  />

                  <ResultItem
                    label="Authority Level"
                    value={analysis.authority_level}
                  />

                  <ResultItem
                    label="Estimated Resolution"
                    value={analysis.estimated_resolution}
                  />
                </div>
              </div>
            </div>

            {/* COMPLAINT */}
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Citizen Complaint
              </p>

              <p className="mt-3 leading-7 text-slate-700">
                {complaint}
              </p>
            </div>

            {/* LOCATION + EVIDENCE */}
            {(location || photo) && (
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {location && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Complaint Location
                        </p>
                        <p className="text-xs text-slate-500">
                          Location captured from the citizen
                        </p>
                      </div>
                    </div>
                    <p className="mt-5 rounded-xl bg-slate-50 p-4 font-semibold text-slate-700">
                      {location}
                    </p>
                  </div>
                )}

                {photo && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-7">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                        <ImagePlus size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          Evidence Photo
                        </p>
                        <p className="text-xs text-slate-500">
                          Photo attached to this grievance
                        </p>
                      </div>
                    </div>
                    <img
                      src={photo}
                      alt="Complaint evidence"
                      className="mt-5 max-h-64 w-full rounded-xl border border-slate-200 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* REASONING */}
            <div className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-700 p-2.5 text-white">
                  <Brain size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Why did AI make this decision?
                  </p>

                  <p className="text-xs text-slate-500">
                    Explainable AI reasoning
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {analysis.reasoning.map((reason, index) => (
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
                ))}
              </div>
            </div>

            {/* SAFETY RISKS */}
            {analysis.safety_risks.length > 0 && (
              <div className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-7">
                <div className="flex items-center gap-2 font-bold text-orange-800">
                  <AlertTriangle size={19} />
                  Detected Safety / Public Risks
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.safety_risks.map((risk, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CREATE GRIEVANCE */}
            <div className="mt-8 rounded-3xl bg-blue-700 p-7 text-white">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-xl font-bold">
                    AI has classified your complaint
                  </p>

                  <p className="mt-1 text-sm text-blue-100">
                    Create your grievance to receive an official
                    tracking ID.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onCreateGrievance}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  <Send size={17} />
                  Create Grievance
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ============================================================
// SMALL COMPONENT
// ============================================================

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="mt-2 font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

// ============================================================
// SPEECH LANGUAGE
// ============================================================

function getSpeechLanguage(language: string) {
  const languages: Record<string, string> = {
    Assamese: "as-IN",
    Bengali: "bn-IN",
    English: "en-IN",
    Gujarati: "gu-IN",
    Hindi: "hi-IN",
    Kannada: "kn-IN",
    Malayalam: "ml-IN",
    Marathi: "mr-IN",
    Odia: "or-IN",
    Punjabi: "pa-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
    Urdu: "ur-IN",
  };

  return languages[language] || "en-IN";
}

export default ReportIssue;


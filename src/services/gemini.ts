import { GoogleGenAI } from "@google/genai";

export type GrievanceAnalysis = {
  language: string;
  category: string;
  subcategory: string;
  department: string;
  authority_level: string;
  urgency_score: number;
  urgency: string;
  safety_risks: string[];
  summary: string;
  estimated_resolution: string;
  reasoning: string[];
};

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const fallbackAnalysis = (
  complaint: string,
  language: string
): GrievanceAnalysis => {
  const text = complaint.toLowerCase();

  let category = "Civic Services";
  let subcategory = "General Public Issue";
  let department = "Municipal Administration";
  let authority_level = "Local Government";
  let urgency_score = 45;
  let urgency = "MEDIUM";

  const safety_risks: string[] = [];
  const reasoning: string[] = [];

  if (
    text.includes("drain") ||
    text.includes("drainage") ||
    text.includes("sewage") ||
    text.includes("నీరు") ||
    text.includes("డ్రైనేజీ")
  ) {
    category = "Water & Sanitation";
    subcategory = "Drainage / Sewage";
    department = "Water & Sanitation";
    urgency_score = 72;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains indicators of drainage or sanitation problems."
    );
    reasoning.push(
      "Sanitation issues can affect public health when left unresolved."
    );

    safety_risks.push("Public health risk");
  } else if (
    text.includes("road") ||
    text.includes("pothole") ||
    text.includes("రోడ్డు") ||
    text.includes("గుంత")
  ) {
    category = "Roads & Infrastructure";
    subcategory = "Road Damage / Pothole";
    department = "Public Works / Roads";
    urgency_score = 68;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains indicators of road damage or infrastructure problems."
    );
    reasoning.push(
      "Road damage can create risks for pedestrians and vehicles."
    );

    safety_risks.push("Road safety risk");
  } else if (
    text.includes("garbage") ||
    text.includes("waste") ||
    text.includes("trash") ||
    text.includes("చెత్త")
  ) {
    category = "Waste Management";
    subcategory = "Garbage / Waste Collection";
    department = "Municipal Sanitation";
    urgency_score = 58;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to garbage or solid waste management."
    );
    reasoning.push(
      "Accumulated waste can create sanitation and environmental concerns."
    );
  } else if (
    text.includes("street light") ||
    text.includes("streetlight") ||
    text.includes("light") ||
    text.includes("లైట్")
  ) {
    category = "Public Infrastructure";
    subcategory = "Street Lighting";
    department = "Municipal Electrical Services";
    urgency_score = 52;
    urgency = "MEDIUM";

    reasoning.push(
      "The complaint appears related to public street lighting."
    );
    reasoning.push(
      "Poor street lighting can reduce visibility and public safety."
    );

    safety_risks.push("Visibility / public safety concern");
  } else if (
    text.includes("electric") ||
    text.includes("electricity") ||
    text.includes("power") ||
    text.includes("current") ||
    text.includes("విద్యుత్")
  ) {
    category = "Electricity";
    subcategory = "Power Supply Issue";
    department = "Electricity Distribution";
    authority_level = "District / Local Utility";
    urgency_score = 65;
    urgency = "HIGH";

    reasoning.push(
      "The complaint appears related to electricity or power supply."
    );
    reasoning.push(
      "Electricity-related complaints may require timely technical attention."
    );

    safety_risks.push("Potential electrical safety concern");
  } else if (
    text.includes("hospital") ||
    text.includes("health") ||
    text.includes("medical") ||
    text.includes("ambulance") ||
    text.includes("ఆసుపత్రి")
  ) {
    category = "Healthcare";
    subcategory = "Public Health Service";
    department = "Health Department";
    authority_level = "District Health Authority";
    urgency_score = 78;
    urgency = "HIGH";

    reasoning.push(
      "The complaint contains healthcare-related indicators."
    );
    reasoning.push(
      "Healthcare complaints may have direct consequences for citizen wellbeing."
    );

    safety_risks.push("Potential health risk");
  }

  if (text.includes("urgent") || text.includes("danger") || text.includes("emergency")) {
    urgency_score = Math.min(100, urgency_score + 15);
    urgency = "CRITICAL";

    reasoning.push(
      "Urgency indicators were detected in the complaint."
    );

    safety_risks.push("Immediate attention may be required");
  }

  if (reasoning.length === 0) {
    reasoning.push(
      "The complaint was analyzed using the local classification fallback."
    );
    reasoning.push(
      "A general civic-services routing path was selected because no stronger category signal was detected."
    );
  }

  return {
    language,
    category,
    subcategory,
    department,
    authority_level,
    urgency_score,
    urgency,
    safety_risks,
    summary: complaint.length > 180
      ? `${complaint.substring(0, 177)}...`
      : complaint,
    estimated_resolution: urgency_score >= 75
      ? "Priority review recommended"
      : "Standard administrative review",
    reasoning,
  };
};

function normalizeAnalysis(
  value: Partial<GrievanceAnalysis>,
  language: string
): GrievanceAnalysis {
  const score = Number(value.urgency_score);

  return {
    language: value.language || language,
    category: value.category || "Civic Services",
    subcategory: value.subcategory || "General Public Issue",
    department: value.department || "Municipal Administration",
    authority_level: value.authority_level || "Local Government",
    urgency_score: Number.isFinite(score)
      ? Math.max(0, Math.min(100, Math.round(score)))
      : 50,
    urgency: value.urgency || "MEDIUM",
    safety_risks: Array.isArray(value.safety_risks)
      ? value.safety_risks.map(String)
      : [],
    summary: value.summary || "Complaint analyzed successfully.",
    estimated_resolution:
      value.estimated_resolution || "Standard administrative review",
    reasoning: Array.isArray(value.reasoning)
      ? value.reasoning.map(String)
      : ["AI classification completed."],
  };
}

export async function analyzeGrievance(
  complaint: string,
  language: string
): Promise<GrievanceAnalysis> {
  const fallback = fallbackAnalysis(complaint, language);

  if (!apiKey) {
    return fallback;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are Jan-Seva AI, an AI-assisted public grievance routing system for India.

Analyze the following citizen complaint.

Citizen-selected language:
${language}

Complaint:
${complaint}

Return ONLY valid JSON with exactly these fields:

{
  "language": "detected or selected language",
  "category": "government service category",
  "subcategory": "specific issue",
  "department": "responsible department",
  "authority_level": "appropriate authority level",
  "urgency_score": 0,
  "urgency": "LOW | MEDIUM | HIGH | CRITICAL",
  "safety_risks": ["risk 1"],
  "summary": "short structured summary",
  "estimated_resolution": "reasonable review expectation",
  "reasoning": [
    "reason 1",
    "reason 2",
    "reason 3"
  ]
}

Rules:
- urgency_score must be an integer from 0 to 100.
- Consider public safety, health impact, scale of impact, vulnerability and urgency.
- Do not invent a real government officer's name.
- Use department and authority categories rather than claiming a live government connection.
- Keep reasoning short and explainable.
- Preserve the meaning of the citizen's complaint.
`;

    const response = await ai.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const rawText = response.text?.trim();

    if (!rawText) {
      return fallback;
    }

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return normalizeAnalysis(parsed, language);
  } catch (error) {
    console.warn(
      "Gemini unavailable. Using local fallback classifier.",
      error
    );

    return fallback;
  }
}
# Jan-Seva AI

### Speak your problem. Jan-Seva finds the right authority.

Jan-Seva AI is a multilingual public grievance routing system designed to help citizens report civic problems without having to figure out which government department is responsible for them.

A citizen can describe a problem in their preferred Indian language using text or voice. Jan-Seva AI analyzes the complaint, identifies the type of issue, estimates its urgency, suggests the appropriate department and authority level, and generates a tracking ID.

The main idea is simple: **the citizen should explain the problem, not understand the government hierarchy behind it.**

---

## The Problem

Reporting a public issue is not always straightforward.

For example, a citizen may know that:

> "There is a large pothole near our college and bikes are getting into accidents."

But they may not know whether the complaint should go to a municipal office, roads department, public works authority, or another local authority.

This becomes even harder when:

- the citizen is more comfortable speaking in a regional language
- the issue is urgent
- the citizen does not know the responsible department
- the complaint contains multiple details that need to be understood
- the citizen wants to know what happened to the complaint after submitting it

Jan-Seva AI focuses on this routing problem.

---

## What Jan-Seva AI Does

The application takes a citizen's complaint and converts it into structured information.

### Basic flow

```text
Citizen
   |
   v
Describe the problem
(Text / Voice)
   |
   v
Jan-Seva AI
   |
   +---- Detect / use language
   |
   +---- Classify the complaint
   |
   +---- Identify department
   |
   +---- Determine authority level
   |
   +---- Calculate urgency score
   |
   +---- Identify possible safety risks
   |
   v
Complaint Record
   |
   +---- Tracking ID
   |
   +---- Citizen Tracking
   |
   +---- Officer Dashboard
Main Features
1. Multilingual Complaint Input
The interface provides a language selector covering India's 22 Scheduled Languages.
Citizens can select the language they want to use when submitting a complaint.
The AI analysis keeps the selected language as part of the complaint context.
Note: actual browser voice recognition availability depends on the browser, operating system, and speech-recognition support available on the user's device.

2. Voice Input
The complaint form supports browser-based speech input.
A citizen can speak instead of typing when speech recognition is supported by their browser.
This is particularly useful for people who find typing a complaint difficult.
If speech recognition is unavailable, the normal text input remains available.
3. AI Complaint Classification
Jan-Seva AI uses Google's Gemini API to analyze the complaint.
The analysis produces structured information such as:
- Category
- Subcategory
- Department
- Authority level
- Urgency score
- Urgency level
- Safety risks
- Complaint summary
- Estimated review expectation
- Reasoning behind the classification
The AI is used as an assisted routing layer, not as a replacement for a government official.
4. Priority Score
Each complaint receives an urgency score from:
0 - 100
The score is intended to help organize complaints according to factors such as:
- public safety
- health impact
- urgency indicators
- potential scale of impact
- vulnerability
The application also displays an urgency level such as:
LOW
MEDIUM
HIGH
CRITICAL
5. Explainable AI
Instead of only showing an AI-generated department, Jan-Seva AI also shows why the complaint was classified that way.
For example, the system can explain that a complaint was routed toward a sanitation-related department because the complaint contained drainage or sewage indicators.
This makes the AI decision easier to understand instead of presenting it as a black box.
6. Department Routing
The system maps complaints to broad government service areas such as:
- Roads & Infrastructure
- Water & Sanitation
- Waste Management
- Public Infrastructure
- Electricity
- Healthcare
- Municipal Services
It also identifies an appropriate authority level such as:
- Local Government
- District / Local Utility
- District Health Authority
These are routing categories used by the application. The current version does not claim a live connection to every government department or official.
7. Photo Upload
Citizens can attach a photograph along with a complaint.
This can provide additional context for issues such as:
- damaged roads
- garbage accumulation
- drainage problems
- public infrastructure damage
- other visible civic issues
The uploaded image is stored with the complaint record in the current browser-based implementation.
8. Location Context
The complaint form can include location information.
Location is treated as additional context for the complaint rather than automatically claiming that the system has identified the official government jurisdiction.
This leaves room for future integration with proper geographic and administrative boundary data.
9. Tracking ID
After submitting a complaint, Jan-Seva AI generates a unique tracking ID.
The citizen can use this ID to find the complaint later.
Example:
JAN-SEVA-XXXXXXXX
The tracking page displays information such as:
- complaint summary
- category
- department
- authority level
- priority
- location
- attached photo
- current status
- status history
10. Citizen Tracking
Citizens can enter their tracking ID and check their submitted complaint.
The system provides a status timeline so that the complaint is not simply treated as a one-time form submission.
11. Officer Dashboard
The officer dashboard provides an overview of submitted complaints.
It includes information such as:
- total complaints
- high-priority complaints
- complaints currently in progress
- resolved complaints
- complaint category
- department
- priority
- location
- attached image
- current status
The available workflow includes:
Submitted
     ↓
AI Classified
     ↓
Department Assigned
     ↓
In Progress
     ↓
Resolved
The dashboard is intended as a prototype for how an authority-facing grievance queue could work.
12. Local Fallback
The application does not completely depend on Gemini being available.
A local rule-based fallback classifier is included for common complaint types such as:
- drainage
- sewage
- roads
- potholes
- garbage
- street lights
- electricity
- healthcare
If the Gemini API is unavailable or does not return a usable response, the application can fall back to the local classifier.
This also makes the prototype more resilient during demonstrations.
AI Decision Example
For a complaint such as:
There is a large pothole on the main road near our college.
It is dangerous for bikes and accidents may happen at night.
The system may identify information such as:
Category:
Roads & Infrastructure

Subcategory:
Road Damage / Pothole

Department:
Public Works / Roads

Urgency:
HIGH

Priority:
68 / 100

Safety Risk:
Road safety risk
The exact result can vary when Gemini is used because the classification is generated from the complaint content.
Technology Stack
Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
AI
- Google Gemini API
- @google/genai
Browser Features
- Web Speech API for voice input
- Browser location APIs where available
- Browser file/image input
Storage
The current prototype uses browser localStorage for complaint persistence.
This was intentionally kept simple so that the complete working prototype could be built and demonstrated without requiring a separate backend during the hackathon.
Application Pages
/
    Landing page

/report
    Submit a grievance

/track
    Track a submitted grievance

/officer
    Officer dashboard

/ai-logic
    Explainable AI / routing logic
Project Structure
jan-seva-ai/
│
├── public/
│
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── ReportIssue.tsx
│   │   ├── TrackComplaintPage.tsx
│   │   ├── OfficerDashboard.tsx
│   │   └── AILogic.tsx
│   │
│   ├── services/
│   │   └── gemini.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
Running the Project Locally
Requirements
Make sure the following are installed:
- Node.js
- npm
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd jan-seva-ai
2. Install dependencies
npm install
3. Create the environment file
Create:
.env.local
Add:
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-2.5-flash
Do not commit .env.local to GitHub.
4. Start the development server
npm run dev
The application will normally be available at:
http://localhost:5173
5. Create a production build
npm run build
Environment Variable
The application reads the Gemini configuration using Vite environment variables.
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-2.5-flash
The .env.local file is excluded from Git using .gitignore.
For a production system, the Gemini API request should ideally be moved behind a backend or secure server-side API layer rather than exposing an API key through a client-side application.
Current Data Model
A submitted grievance contains information such as:
Tracking ID
Complaint
Language
Category
Subcategory
Department
Authority Level
Urgency Score
Urgency
Safety Risks
Summary
Reasoning
Location
Photo
Status
This structure allows the same complaint data to be used by both the citizen tracking interface and the officer dashboard.
What Makes the Prototype Different
The focus of Jan-Seva AI is not simply collecting complaints.
The important part is what happens after the citizen submits the complaint.
Instead of:
Citizen → Form → Database
the intended workflow is:
Citizen
   ↓
Complaint
   ↓
AI Understanding
   ↓
Classification
   ↓
Priority Assessment
   ↓
Department Routing
   ↓
Authority Level
   ↓
Tracking
The project also exposes the reasoning behind the AI classification so that the routing decision can be inspected.
Limitations of the Current Prototype
This project is a hackathon prototype and has several limitations.
No direct government system integration
The current version does not connect directly to live government grievance portals or internal department systems.
The department and authority mapping is currently a structured routing model.
Browser-based storage
Complaint data is currently stored in localStorage.
Therefore, the prototype does not provide real multi-device synchronization.
Voice recognition
Voice input depends on speech-recognition capabilities provided by the user's browser and device.
API security
The current frontend uses a Vite environment variable for Gemini configuration.
For a production deployment, the AI request should be handled through a secure backend or server-side proxy.
Authority mapping
The current authority-level classification is a generalized model.
A production implementation would need verified administrative boundaries, department responsibilities, state-specific workflows, and official escalation rules.
Future Scope
There are several directions in which Jan-Seva AI can be extended.
Government Integration
Connect the routing system with official grievance and departmental systems through authorized APIs.
Administrative Hierarchy
Build verified:
State
   ↓
District
   ↓
Municipality / Mandal / Local Body
   ↓
Department
   ↓
Authority
mapping.
Better Geographic Routing
Use administrative boundary data and geospatial services to determine the relevant jurisdiction from the complaint location.
Image Understanding
Use multimodal AI to analyze uploaded photographs and detect visible problems such as:
- potholes
- garbage accumulation
- damaged infrastructure
- overflowing drains
Notifications
Provide SMS, email, WhatsApp, or application notifications when the complaint status changes.
Analytics
Authorities could use aggregated data to identify:
- frequently reported locations
- recurring complaint categories
- unresolved issues
- areas with repeated infrastructure problems
Backend and Database
Move from browser storage to a secure backend with:
- authentication
- PostgreSQL
- role-based access
- audit logs
- secure file storage
- multi-device synchronization
Design Goal
The interface is designed around a simple principle:
A citizen should not need to understand government departments in order to report a problem.

The citizen explains what happened.
Jan-Seva AI helps structure the information and identify where it could be routed.
Hackathon
Built for Hack Devengers 2.0.
The project was developed as a working prototype during the hackathon period.
Project Status
Current prototype includes:
- Multilingual complaint interface
- Text complaint input
- Voice input
- Gemini AI analysis
- Local fallback classification
- Department routing
- Authority-level classification
- Priority scoring
- AI reasoning
- Photo upload
- Location context
- Tracking ID
- Citizen tracking
- Officer dashboard
- Complaint status workflow
- Browser persistence
- Production build
Team
Jan-Seva AI
Built as an individual hackathon project.
Note
Jan-Seva AI is an experimental prototype for demonstrating AI-assisted public grievance routing.
It should not be treated as an official government grievance platform or as a replacement for verified government procedures.

### One important thing before you paste it

I deliberately **didn't make unsupported claims** such as:

- "connected to all Indian government departments"
- "supports live government routing"
- "AI understands every Indian language perfectly"
- "guarantees correct department assignment"
- "secure production-grade system"

Those claims could hurt you if a judge actually tests the project.

Also, the README says **22 Scheduled Languages**, but your current `Home.tsx` language array needs a small correction because the version we created earlier has **Punjabi twice**. We'll fix that before the final GitHub commit.

After you paste and save the README, **don't commit yet**. Tell me `README saved`, and we'll do a final repository check before the first commit.
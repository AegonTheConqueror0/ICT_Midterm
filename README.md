# HCDC College of Maritime Education (COME)
## Shipboard Computer Hardware & Network Design Laboratory Simulator
### Bachelor of Science in Marine Transportation (BSMT) Midterm Examination Platform

[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Academic-HCDC%20COME%20BSMT-0284c7.svg)](#academic-integrity--license)

---

## ⚓ Overview

The **Shipboard Computer Hardware & Network Design Laboratory Simulator** is an interactive, computer-based maritime assessment application engineered for the **College of Maritime Education (COME)** at **Holy Cross of Davao College (HCDC)**. Designed specifically for the **Bachelor of Science in Marine Transportation (BSMT)** program, this system evaluates cadets on marine computer hardware identification, integrated navigation network topologies, maritime troubleshooting, and safe equipment handling in accordance with **STCW** and **IMO Model Course** standards.

---

## 🚢 Key Features & Examination Modules

### 1. Mandatory Cadet Registration & Mission Briefing
* **Pre-Assessment Gate:** Strictly locks all assessment tabs until the candidate submits validated credentials (Full Name, Student/Cadet ID, Training Vessel/Simulator Station, and Rank/Designation).
* **Synchronized Exam Timer:** A 30-minute countdown timer remains paused at `30:00 (Pending Start)` and begins automatically once the cadet launches the examination.
* **Rapid Examiner Preset:** Includes a one-click *"Fill Sample BSMT Cadet"* utility for rapid demonstration and instructor testing.

### 2. Module 1: Interactive Hotspot Labelling (30 Points)
* High-resolution, interactive maritime workstation motherboard schematic.
* Pinpoints mission-critical shipboard components:
  * Marine Radar / ECDIS Dual Gigabit NIC
  * Marine Embedded Industrial Processor & Heatsink
  * Marine-Grade Dual Channel ECC RAM
  * Dual Redundant Shipboard AC/DC Power Supply Unit
  * High-Endurance NVMe Solid-State Storage
* Includes a real-world shipboard scenario question regarding dual-NIC fault tolerance and network segmentation between ECDIS and ARPA radar.

### 3. Module 2: Marine Component Function Matching (15 Points)
* Interactive matching matrix connecting shipboard hardware components with their exact maritime operational roles (e.g., NMEA 0183/2000 serial data buffers, managed Ethernet bridge switches, optical isolation barriers, and bridge UPS units).
* Instant feedback with real-time score tracking.

### 4. Module 3: Shipboard Network Topology Builder (30 Points)
* Interactive SVG vector canvas simulating a bridge local area network (LAN).
* Cadets configure cabling between essential navigational bridge equipment:
  * Primary ECDIS (Electronic Chart Display and Information System)
  * Backup / Secondary ECDIS Station
  * ARPA / Marine Radar Transceiver
  * Class A AIS (Automatic Identification System) Transponder
  * Marine DGPS Receiver
  * Dual Redundant Managed Industrial Ethernet Switch
* Dynamic connection line rendering with port-to-port validation and duplicate connection protection.

### 5. Module 4: Network Checking Procedures & Equipment Handling (25 Points)
* **Fault Isolation Scenarios:** 5 real-world shipboard communication and equipment failure scenarios (IP conflicts, cable integrity failures, switch loop storms, serial buffer overflows, and ground loops).
* **Safe Handling Protocol Sequencer:** Drag-and-drop / click-to-reorder sequence testing cadets on standard maritime Electrostatic Discharge (ESD) prevention and shipboard electronics servicing protocol.

### 6. Module 5: Official Examination Report & Anti-Tamper Receipt
* **Score Breakdown:** Automated tabulation displaying individual section points and a cumulative score out of 100 points with an evaluation rating (*Passed with Distinction*, *Passed*, or *Incomplete*).
* **Anti-Tamper Digital Receipt:** Generates a unique, verifiable receipt number (`HCDC-REC-[YEAR]-COME-[ID]`) stamped with the exact submission timestamp.
* **One-Click PDF Export:** Powered by `html2canvas-pro` and `jspdf` to download an official, formatted evaluation receipt suitable for academic submission or printing.
* **Submission Confirmation Gate:** Prevents accidental early submission with a safety modal summarizing answered modules.

---

## 🏛️ Institutional Branding & Assets

The platform integrates the official institutional identity of:
* **School Seal:** Holy Cross of Davao College (HCDC)
* **Program Logo:** College of Maritime Education (COME) — Department of Marine Transportation (BSMT)
* **Dynamic Asset Resolution:** Logo assets are loaded directly from `src/assets/images/` and `public/assets/images/` using dynamic `import.meta.glob` discovery with automated SVG vector fallbacks to ensure zero 404 or compilation errors in any local VS Code or containerized environment.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | Modular, component-driven user interface |
| **TypeScript** | Strict compile-time typing and assessment data structures |
| **Vite** | Next-generation fast frontend tooling and dev server |
| **Tailwind CSS** | Clean maritime color palette and responsive UI layout |
| **Lucide React** | Consistent, accessible iconography |
| **jspdf & html2canvas-pro** | High-fidelity client-side PDF receipt generation |

---

## 🚀 Getting Started (VS Code & Local Development)

### Prerequisites
* **Node.js**: Version `18.x` or higher (Node 20+ recommended)
* **npm**: Version `9.x` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hcdc-come-bsmt-hardware-simulator.git
   cd hcdc-come-bsmt-hardware-simulator

   Install project dependencies:
code
Bash
npm install
Start the local development server:
code
Bash
npm run dev
Open your browser and navigate to http://localhost:3000 (or the port displayed in your terminal).
Build for production:
code
Bash
npm run build
Compiled, production-ready static assets will be output to the dist/ directory.
Run Type Checking / Linter:
code
Bash
npm run lint
📁 Project Directory Structure
code
Text
├── public/
│   └── assets/
│       └── images/               # Static fallback images and institutional seals
├── src/
│   ├── assets/
│   │   └── images/               # High-resolution HCDC School & COME Program logos
│   ├── components/
│   │   ├── Header.tsx            # Navigation header, timer display & status pill
│   │   ├── Logos.tsx             # Resilient dual institutional logo components
│   │   ├── MissionBriefing.tsx   # Candidate credential verification & timer launch
│   │   ├── HotspotSimulator.tsx  # Module 1: Motherboard component hotspot labelling
│   │   ├── MatchingSimulator.tsx # Module 2: Marine component function matching
│   │   ├── TopologySimulator.tsx # Module 3: Shipboard bridge network builder (SVG)
│   │   ├── ProcedureSimulator.tsx# Module 4: Troubleshooting & 6-step handling protocol
│   │   └── ResultsReport.tsx     # Module 5: Performance receipt & PDF generator
│   ├── types.ts                  # TypeScript interfaces for Cadet, Scores & Modules
│   ├── App.tsx                   # Central assessment state & navigation gatekeeper
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Tailwind CSS styles and print media rules
├── package.json                  # Dependencies and project scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build configuration
👨‍🏫 Instructor / Assessment Notes
Timer Expiration: If the 30-minute timer elapses, the assessment automatically locks to uphold academic integrity.
Reviewing Cadets: Instructors can review cadet submissions in real-time or examine downloaded official PDF receipts containing the digital signature line, candidate ID, and time of completion.
Resetting Sessions: An assessment can be cleared and reset from the Report & Receipt screen via the confirmation modal.
⚖️ Academic Integrity & Departmental Attribution
Institution: Holy Cross of Davao College (HCDC)
College: College of Maritime Education (COME)
Program: Bachelor of Science in Marine Transportation (BSMT)
Instructor / Contact: edgardo.rojas@hcdc.edu.ph
This simulator is developed for instructional and laboratory examination purposes under the Department of Marine Transportation, College of Maritime Education, Holy Cross of Davao College.
code
Code
---

### Tips for your GitHub Repository:
1. **Badges:** Replace `your-username` in the clone URL with your actual GitHub username.
2. **Screenshots:** You can capture 1-2 screenshots of the **Mission Briefing**, **Network Topology Builder**, and **Official Receipt PDF** and add them to a `/docs/` or `/screenshots/` folder in your repo to make your repository stand out even more.
3. 

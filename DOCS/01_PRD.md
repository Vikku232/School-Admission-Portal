# Product Requirements Document (PRD)
## Project: SmartCV Builder — AI-Powered Resume Builder
**Author:** Soumyadeep Giri  |  **Version:** 1.0  |  **Date:** July 2026
**Inspired by:** BetterCV feature set (see BetterCV_Features.md)
**Stack alignment:** Spring Boot 3.x (Java 17) backend + React (Vite) frontend, following the same architectural pattern as the existing Spring AI Mail Agent project (WebClient → Gemini API).

---

## 1. Vision
SmartCV Builder is an AI-assisted resume-building web app that lets a user create an ATS-friendly, recruiter-approved resume in three guided steps, with real-time preview and AI-generated content (summaries, bullet points, skill suggestions). It is built as a portfolio-grade, production-style full-stack project — not a toy CRUD app — to demonstrate reactive Spring Boot + Gemini integration, JWT auth, PostgreSQL modeling, and a polished React UI.

## 2. Problem Statement
Students and early-career candidates (the primary target audience) struggle to:
- Articulate achievements in resume language ("blank page syndrome")
- Format resumes so ATS software parses them correctly
- Iterate quickly between content and design without breaking layout

## 3. Goals
- G1: Let a user go from zero to a downloadable, ATS-safe PDF resume in under 10 minutes.
- G2: Use AI (Gemini) to generate/improve summaries, bullet points, and skill suggestions.
- G3: Give a live split-screen preview that updates as the user types.
- G4: Score the resume (completeness + ATS-friendliness) and show actionable feedback.
- G5: Support multiple templates with one-click color/theme switching.

## 4. Non-Goals (v1)
- No LinkedIn import/parsing in v1 (stub only).
- No payment/subscription system in v1 — all features free.
- No multi-language resume support in v1 (English only).
- No collaborative/shared editing in v1.

## 5. Target Users
- Final-year engineering / CS students preparing for campus placements.
- Early-career developers building their first professional resume.
- (Secondary) career switchers reframing past experience.

## 6. Feature List (mapped from BetterCV_Features.md)

### 6.1 AI Content Engine
| Feature | Description | Priority |
|---|---|---|
| AI Summary Generator | Generates a professional summary from job title + experience level | P0 |
| AI Bullet-Point Generator | Converts a rough sentence into a polished, action-oriented bullet | P0 |
| Skill Suggestions | Suggests relevant skills based on job title/domain | P1 |
| Keyword/Tone Refinement | Rewrites text to be more confident and keyword-aligned to a target JD | P1 |

### 6.2 ATS Optimization
| Feature | Description | Priority |
|---|---|---|
| ATS-safe template rendering | No tables/columns that break parsing; single-column PDF export mode | P0 |
| Formatting auto-correction | Enforces consistent header hierarchy, bullet style, spacing | P1 |
| ATS Score | Rule-based + AI-assisted score (0–100) with specific fix suggestions | P1 |

### 6.3 Design & Live Preview
| Feature | Description | Priority |
|---|---|---|
| Template gallery | 4–6 curated templates (Simple, Modern, One-Column, With-Photo) | P0 |
| Real-time split-screen preview | Left = form, right = live-rendered resume | P0 |
| Theme/accent color picker | Swap accent color without re-entering content | P1 |
| Auto-formatting/auto-fit | Dynamically scales spacing to fit one page | P2 |

### 6.4 Guided 3-Step Workflow
1. **Onboarding** — "Start from scratch" or "Upload existing resume" (parse PDF/DOCX → prefill fields)
2. **Guided Data Entry** — tabs: Contact, Experience, Education, Skills, Summary, Additional Sections (Awards, Hobbies, Languages, Certifications, Links, Custom)
3. **Review & Export** — Resume Score widget + one-click PDF download

### 6.5 Account & Persistence
| Feature | Description | Priority |
|---|---|---|
| Auth (JWT) | Register/login, same pattern as your other projects | P0 |
| Save/auto-save resume drafts | Debounced auto-save every few seconds | P0 |
| Multiple resumes per user | Dashboard listing saved resumes | P1 |

## 7. User Stories (sample)
- As a student, I want to type one rough sentence about a project and have AI turn it into a strong bullet point, so I don't stare at a blank field.
- As a user, I want to see my resume score improve as I fill more sections, so I know what's missing.
- As a user, I want to switch templates without losing my content, so I can compare looks quickly.
- As a user, I want to download a clean, ATS-safe PDF, so I can submit it to job portals confidently.

## 8. Success Metrics (portfolio framing — since there's no real user base)
- Full user journey (signup → build → AI-assist → export PDF) completes end-to-end with no manual DB edits.
- Resume renders identically in live preview and exported PDF (pixel-consistent, single source of truth).
- AI endpoints respond within 3–5s p95 (Gemini flash model).
- ATS score calculation is deterministic and explainable (not a black box).

## 9. Risks / Constraints
- Gemini API key must never be exposed client-side (WebClient pattern from Mail Agent applies here too).
- PDF export must be pixel-consistent with the live preview — recommend rendering HTML→PDF server-side (see Backend spec) rather than duplicating layout logic in a PDF library.
- Resume parsing (upload existing resume) is the highest-risk/most-optional feature — mark P2, build last.

## 10. Out of Scope for This Document
Detailed API contracts and data models live in `02_SRS.md`. Frontend page/component breakdown lives in `03_Frontend_Stitch_Spec.md`. Backend module breakdown lives in `04_Backend_Antigravity_Spec.md`. Build sequencing lives in `05_Step_By_Step_Build_Loop.md`.

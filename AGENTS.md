# AI Training & Behavioral Guidelines (Speaking Bomb Game)

## Vocabulary Data Integrity
- **NO Autonomous Additions:** NEVER add words to the vocabulary list without explicit user instruction.
- **NO Inferred Categories:** DO NOT add `category` fields or try to classify words unless requested.
- **Strict Mapping:** Follow the user-provided YCT level/lesson structure exactly.
- **Lesson Count:** 
  - YCT 1-4: Lessons 1-11 + Lesson 12 (REVIEW).
  - YCT 5-6: Lessons 1-14.

## UI Standards
- All interactive buttons must have Chinese labels followed by English translations.
- PK mode must show separate scoring and explicit "WIN!" banners.
- Avoid obvious countdown timers; use the bomb fuse and vibration as the primary failure cues.

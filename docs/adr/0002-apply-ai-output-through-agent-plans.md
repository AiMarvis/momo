# Apply AI Output Through Agent Plans

Codex CLI and OpenAI API providers must return structured Agent Plans instead of directly changing vault files. Kuku OS validates each plan, splits Safe Auto Changes from Approval-Required Changes, maps domain objects to Kuku mutations, and applies them through path guards, checksums, Run Logs, and Undo Plans. This adds friction compared with direct file patches, but it protects local-first trust, receipts, undo, and user approval boundaries.

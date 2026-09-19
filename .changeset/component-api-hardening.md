---
"doodleui-react": major
---

Component API hardening across the library.

**Added:** `asChild` on Button/Card/Badge; shared `sm|md|lg` sizing; `startIcon`/`endIcon`; Button `loading`; form `invalid`/`error`/`errorMessage`; RHF-friendly refs + FormData; compound Card/Table/Accordion/Field.

**Breaking:** `TableHead` is now `<th>` — use `TableHeader` for `<thead>` (`TableHeaderCell` still aliases th). `Avatar` `size` is `"sm"|"md"|"lg"|number` (default `"md"`).

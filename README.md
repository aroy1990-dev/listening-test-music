# Music Listening Test

Blind 4-way listening test: 20 trials, 4 loudness-matched versions of each 30 s excerpt. The listener picks the version that sounds best overall.

- `audio/tNN_{A..D}.wav` — stimuli. Which system made which file is **not** in this repo (kept in the private `key.json`).
- Trial order and on-screen option order are shuffled per listener; answers are recorded as the file label (A–D), with the on-screen order logged for position-bias analysis.
- `collector/Code.gs` — Google Apps Script that logs responses to a Sheet (see header comment). Set `CONFIG.ENDPOINT` in `index.html`.

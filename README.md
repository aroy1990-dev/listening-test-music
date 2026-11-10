# Music Listening Test

Blind A/B listening test: 20 trials. Each trial plays the **original** (the system input) as a reference, then the listener chooses which of two processed versions does it best. All clips are 30 s and loudness-matched.

- `audio/tNN_{A..D}.wav` — stimuli. Which file is the original / PRISM / PRISM w/o MPO is **not** in this repo (kept in the private `key.json`).
- Trial order and the on-screen order of the two options are shuffled per listener. Answers are recorded as the chosen file name (e.g. `t01_A`), with the on-screen order and play counts logged for position-bias analysis.
- `collector/Code.gs` — Google Apps Script that logs responses to a Sheet (see header comment). Set `CONFIG.ENDPOINT` in `index.html`.

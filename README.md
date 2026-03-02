# F1 Track Draw 🏎️

**CS50 Final Project** — Web game inspired by [neal.fun/perfect-circle](https://neal.fun/perfect-circle)

## What is it?

Draw F1 circuit layouts from memory using your mouse. The game compares your drawing with the real track template and gives you a score from 0–100%.

## How to Play

1. Open `index.html` in a browser
2. Draw the circuit layout on the canvas
3. Return to the starting point to close the loop
4. See your similarity score!

Or play in [Vercel](https://f1-drawtrack-game.vercel.app/)
## Tech Stack

- HTML5 Canvas API
- Vanilla JavaScript (no libraries)
- CSS3

## Project Structure

```
/final-project
  |-/tracks-generator
    |-- tracks-generator.html  # Tool for creating track templates
    |-- tracks-generator.js    # Logic for track template creation
  ├── index.html   # Page structure
  ├── styles.css   # Styling
  ├── script.js    # Game logic
  ├── tracks.js    # Track template data
  └── README.md    # This file
```

## Implementation Roadmap

- [x] Phase 1: HTML structure + Canvas setup
- [x] Phase 2: Mouse drawing capture
- [x] Phase 3: Loop detection
- [x] Phase 4: Track templates (Monaco, Monza, Suzuka, Spa, Interlagos)
- [x] Phase 5: Drawing normalization
- [x] Phase 6: Scoring algorithm
- [x] Phase 7: Polish & animations
- [x] Phase 8: Track of the day system

## Scoring

| Score | Rating |
|-------|--------|
| 90–100% | Excellent |
| 80–89% | Very Good |
| 70–79% | Good |
| 60–69% | Average |
| < 60% | Needs Work |

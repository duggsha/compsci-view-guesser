# Project Specification - View Guesser

## Problem Statement
Users enjoy music videos but rarely know which songs are more popular on YouTube. This project builds a quiz game where players watch two embedded music videos and guess which has more views.

## Objectives
1. Present two playable YouTube music videos per round
2. Let the user guess which video has more views
3. Score correct answers and show final statistics
4. Support Normal mode and Streak mode
5. Allow replay or exit with summary stats

## Success Criteria
1. User can press Play, see two videos, submit a guess, and receive correct/incorrect feedback with real view counts
2. Score increases by 1 on correct answers; Streak mode resets score to 0 on any wrong answer
3. User can play multiple rounds and end with a final stats screen

## Technology
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js serverless API on Vercel
- Data: YouTube Data API v3 (optional live views) with fallback cached counts
- Version control: GitHub

## Modules
| Module | Description |
|--------|-------------|
| Start UI | Mode selection and Play button |
| Round API | Returns random video pair with view counts |
| Game UI | Embeds videos and handles guesses |
| Scoring | Normal and Streak logic |
| End UI | Play again prompt and final stats |

## Testing Plan
- Positive: correct guess adds 1 point; play again loads new round; final stats accurate
- Negative: wrong guess shows correct counts; Streak mode resets score; API failure shows error

# 🏗️ Bigram-Tower
Arrange shuffled words into **bigram chains**, build towers, and compete on the **leaderboard** in this fun, time-based Reddit web game.
![Puzzle Game](https://res.cloudinary.com/dzzrxqiho/image/upload/v1770664292/logo1_ofbelw.png)

## Table of Contents
- [Features](#features)
- [How to Play](#how-to-play)
- [Demo Screenshots](#demo-screenshots)
- [Tech Stack](#tech-stack)
- [License](#license)

## Features
- **Daily Puzzles:** A new word tower challenge every day
- **Theme-based:** Each day, new tower with new theme
- **Speed-Based Scoring:** The faster you build, the higher your score  
- **Penalty for Mistakes:** Incorrect placements add penalty time  
- **Undo Last Move:** Fix mistakes without restarting  
- **Leaderboards:** Compete with friends and other players  
- **Help & Demo:** Interactive tutorial for new users  
- **Archive:** Revisit past daily puzzles anytime  

## How to Play
1. Drag or click words from the **word pool** to the **tower**.  
2. Arrange words to form correct **bigram chains**. Example: `"machine learning"`.  
3. Correct placements increase your score; wrong placements add **penalty time**.  
4. Complete the tower as **fast as possible** to climb the **daily leaderboard**.  
5. Use the **undo button** if you make a mistake.  
6. **Tips:**  
   - Start with the block mentioned in the hint.
   - Place blocks quickly, but carefully, to maximize your score.  
   - Use the demo/tutorial if you are a new player.
<img src="https://res.cloudinary.com/dzzrxqiho/image/upload/v1770664495/demo_dhllvy.png" width="400" alt="Demo">

## Demo Screenshots
<div style="display: flex; gap: 10px; align-items: center;">
  <img src="https://res.cloudinary.com/dzzrxqiho/image/upload/v1770664986/loading_zydcqz.png" width="300" />
  <img src="https://res.cloudinary.com/dzzrxqiho/image/upload/v1770664780/main_yoow1f.png" width="300" />
  <img src="https://res.cloudinary.com/dzzrxqiho/image/upload/v1770665213/howToPlay_wssg0d.png" width="300" />
</div>

## Tech Stack
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.6-cyan)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![Devvit](https://img.shields.io/badge/Devvit-0.12.10-orange)
![Redis](https://img.shields.io/badge/Redis-7.2-red)
![Reddit Dev](https://img.shields.io/badge/Reddit-Developer-blue)

**Frontend:**  
- React + TypeScript: Component-based UI for tower, word pool, and modals  
- TailwindCSS: Beautiful, responsive styling

**Backend:**  
- Devvit Web Framework: API endpoints for daily puzzles, user progress, and leaderboard  
- Redis: Fast in-memory database for storing user scores and tower states  
- Express: Middleware for routing and request handling   

## License
![License](https://img.shields.io/badge/License-BSD--3--Clause-green)

This project is licensed under the [BSD 3-Clause License](LICENSE).

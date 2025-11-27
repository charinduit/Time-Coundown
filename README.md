# Time-Coundown

A simple, attention-grabbing **countdown timer** for maintenance windows or critical events. Designed for display on a dedicated monitor to keep developers focused.

## 🚀 Features
- **Auto Fullscreen** attempt on load (or press `F11` manually)
- **Urgency Animations**:
  - Glow when > 60 minutes left
  - Amber pulse when ≤ 60 minutes
  - Red pulse when ≤ 15 minutes or at zero
- **Alarm Sound** when countdown reaches zero (toggle with `Space`)
- **Wake Lock** support to prevent screen sleep
- **Banner Alert** (toggle with `B`)

## 🛠 How to Set Target Date & Title
Edit `script.js`:
```javascript
const title = 'Countdown to Next Maintenance Window';
const targetDate = new Date('2025-12-31T23:59:59'); // Change to your event time
```

## ▶️ How to Run Locally
1. Download or clone this repository:
   ```bash
   git clone https://github.com/charinduit/Time-Coundown.git
   ```
2. Open `index.html` in **Chrome** or **Edge**.
3. Press `F11` for fullscreen.

## 🌐 Deploy via GitHub Pages
1. Go to **Settings → Pages** in your repo.
2. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
3. Click **Save**.
4. Access your countdown at:
   ```
   https://charinduit.github.io/Time-Coundown/
   ```

## 📸 Screenshot
![Countdown Screenshot](screenshot.png)
*(Add a screenshot of your countdown page here)*

## ⚖️ License
This project is licensed under the MIT License.

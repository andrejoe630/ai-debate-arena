# 🚀 Quick Start Guide - Enhanced AI Debate Arena

## First Time Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## New Features at a Glance

### 🎨 Top Toolbar (New!)
- **💡** Browse 35+ curated topics
- **📚** View debate history
- **📊** Check model statistics
- **⚙️** Adjust rounds & temperature
- **🌙/☀️** Toggle dark mode

### ⚙️ Settings Panel
Click the gear icon to reveal:
- **Rounds**: 1-5 (default: 2)
- **Temperature**: 0.0-1.0 (default: 0.7)

### 💡 Topic Browser
- 6 categories: Philosophy, Tech, Ethics, Science, Politics, Culture
- Filter by category or difficulty
- 🎲 Random topic button
- Click any topic to auto-fill

### 📚 History Sidebar
- Auto-saves all completed debates
- Filter: All / Debates / Discussions
- Load any past debate with one click
- ⬇️ Export to Markdown
- 🗑️ Delete individual or all
- Shows relative timestamps

### 📊 Stats Modal
- Win/loss/tie tracking per model
- Win rate percentages
- Leaderboard ranking
- Visual progress bars
- Clear all stats option

### 🎭 Message Reactions
- 🔥 Fire (exciting argument)
- 🤔 Thinking (thoughtful point)
- 👏 Clap (well said)
- Click to add, counts displayed

### 🌙 Dark Mode
- Toggle anytime with sun/moon button
- Preference saved automatically
- Full UI coverage including modals
- Custom dark scrollbars

## Quick Actions

| Action | How To |
|--------|--------|
| Start debate | Type topic, press Enter |
| Use curated topic | Click 💡, select topic |
| Random topic | Click 💡, then 🎲 |
| Adjust settings | Click ⚙️, move sliders |
| View history | Click 📚 |
| Export debate | In history, click ⬇️ |
| Check stats | Click 📊 |
| Toggle theme | Click 🌙 or ☀️ |
| React to message | Click emoji below message |
| Load old debate | Click 📚, click debate |

## Keyboard Shortcuts

- `Enter` - Start debate (when topic entered)
- `Shift + Enter` - New line in topic input
- `Esc` - Close any modal

## Storage Info

All data stored locally in your browser:
- **debate_history** - Last 50 debates
- **model_stats** - Win/loss records
- **theme_preference** - Light/dark mode

No server storage needed!

## Pro Tips

1. **Performance Tracking**: Run multiple debates to build meaningful stats
2. **Export First**: Export important debates before clearing history
3. **Dark Mode**: Perfect for night-time viewing
4. **Temperature**: 
   - Low (0.0-0.4): More focused, logical arguments
   - Medium (0.5-0.7): Balanced creativity
   - High (0.8-1.0): More creative, varied responses
5. **Rounds**: More rounds = longer, deeper debates

## Example Workflows

### Quick Debate
1. Click 💡
2. Click 🎲 for random topic
3. Press Enter to start

### Researched Debate
1. Click ⚙️ to open settings
2. Set rounds to 4-5
3. Set temperature to 0.3 (focused)
4. Pick specific models in advanced mode
5. Browse topics by category
6. Export result when done

### Compare Models
1. Run several debates with different models
2. Click 📊 to see leaderboard
3. Check win rates and statistics

## File Structure

```
src/
├── App.tsx                  # Main app with all integrations
├── types.ts                 # TypeScript types
├── utils.ts                 # Helper functions
├── topics.ts                # Curated topics
├── index.css                # Styles with dark mode
└── components/
    ├── HistorySidebar.tsx
    ├── StatsModal.tsx
    ├── TopicsBrowser.tsx
    └── MessageWithReactions.tsx
```

## Troubleshooting

**Q: Dark mode not saving?**  
A: Check browser localStorage is enabled

**Q: History not showing?**  
A: Make sure debates complete successfully

**Q: Stats not updating?**  
A: Stats only track debate mode, not discussions

**Q: Can't export?**  
A: Download permissions may be blocked by browser

## What's Next?

Check `FEATURES.md` for complete feature list  
Check `IMPLEMENTATION.md` for technical details

---

**Happy Debating! 🎭**

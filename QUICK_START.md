# Quick Start Guide - Test Your Updates NOW!

## 🚀 Start in 60 Seconds

### Step 1: Open TWO Terminal Windows

#### Terminal 1 - Start Backend:
```bash
cd "C:\Users\andre\Documents\AI Debate Bot\debate-arena"
npm run serve
```

You should see:
```
Debate API running on http://localhost:5050
```

#### Terminal 2 - Start Frontend:
```bash
cd "C:\Users\andre\Documents\AI Debate Bot\debate-arena\debate-ui"
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

### Step 2: Open Browser
Go to: **http://localhost:5173**

Press **F12** to open Developer Console (for debugging)

### Step 3: Test Simple Mode (Default)

1. You should see the welcome screen with 🎭
2. At the bottom, you'll see:
   - Mode tabs: `🎭 Debate Mode` and `💬 Discussion Mode`
   - One dropdown menu (default: OpenAI) with a ⚙️ button next to it
3. Type any topic, like: **"Is pizza a sandwich?"**
4. Press **Enter** (or click the arrow button)

**What should happen**:
- Check console logs (F12 → Console tab):
  - `Key pressed: Enter`
  - `runDebate called`
  - `Simple mode: Using openai for both sides`
- OpenAI will debate itself (both affirmative and negative)!
- Watch the debate unfold in real-time

### Step 4: Test Advanced Mode

1. Click the `⚙️` (settings) button next to the dropdown
2. Two dropdown menus appear with an ✕ button
3. Select different AIs (e.g., OpenAI vs Claude)
4. Type a topic and press Enter
5. Watch them debate each other!
6. Click ✕ to go back to simple mode

### Step 5: Test Discussion Mode

1. Click `💬 Discussion Mode` tab at bottom
2. Type a topic like: **"What's the best programming language?"**
3. Press Enter
4. Watch all 3 AIs (GPT, Claude, Gemini) discuss
5. See if they reach consensus or need judges!

## ⚠️ Troubleshooting

### Problem: "Nothing happens when I press Enter"

**Check Console (F12)**:
- Do you see: `Key pressed: Enter`? 
  - ✅ If YES: The key is detected
  - ❌ If NO: Focus might not be in the textarea

- Do you see: `runDebate called`?
  - ✅ If YES: Function is executing
  - ❌ If NO: There's a JavaScript error (check console)

**Common fixes**:
1. Click inside the text input to focus it
2. Refresh the page (Ctrl+Shift+R)
3. Check that backend is running (Terminal 1)
4. Check for errors in console

### Problem: "Failed to start debate"

**Check**:
1. Is backend running? (Terminal 1 should show port 5050)
2. Are your API keys set in `.env` file?
3. Check console for network errors

### Problem: "Button is grayed out"

**This is normal when**:
- No text in the input box
- A debate/discussion is already running

## 🧪 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can type in the textarea
- [ ] Pressing Enter triggers console logs
- [ ] Simple mode shows one dropdown (OpenAI by default)
  - [ ] Clicking ⚙️ shows two dropdowns (advanced mode)
  - [ ] Clicking ✕ goes back to one dropdown (simple mode)
- [ ] Discussion mode shows all 3 AI names
- [ ] Debates/discussions actually run
- [ ] Judge verdicts appear at the end

## 📝 Expected Console Output

When you press Enter in **Simple Mode**, you should see:
```javascript
Key pressed: Enter Shift: false Loading: false
Enter pressed, calling runDebate
runDebate called {topic: "Is pizza a sandwich?", mode: "debate", loading: false}
Simple mode: Using openai for both sides
Sending debate request {finalAffModel: "openai", finalNegModel: "openai"}
```

In **Advanced Mode**:
```javascript
Advanced mode: Affirmative: openai vs Negative: anthropic
Sending debate request {finalAffModel: "openai", finalNegModel: "anthropic"}
```

## 🎯 What's New?

1. **Simple Mode** (default): Pick one AI that debates itself
2. **Advanced Mode**: Click ⚙️ to pick two different AIs
3. **Toggleable**: Switch between simple and advanced with buttons (⚙️ and ✕)
4. **Console Logging**: Debug info shows in console
5. **Discussion Mode**: 3 AIs discuss collaboratively
6. **Better Error Handling**: More informative messages

## 💡 Fun Things to Try

### Simple Mode (AI vs Itself):
- "Is water wet?" → Watch AI contradict itself!
- "Should pineapple be on pizza?" → See both sides argued by same AI
- "Is free will real?" → Philosophical self-debate

### Advanced Mode (AI vs AI):
- OpenAI vs Claude: "Which AI is smarter?"
- Gemini vs OpenAI: "Best practices for AI safety"
- Claude vs Gemini: "Best programming language"

### Discussion Mode:
- "What are the top 3 programming languages?"
- "How do we solve climate change?"
- "What's the meaning of life?"

## 🆘 Still Having Issues?

1. **Restart both servers** (Ctrl+C in both terminals, then restart)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Rebuild everything**:
   ```bash
   npm run build
   cd debate-ui
   npm run build
   cd ..
   ```
4. **Check your `.env` file** has valid API keys
5. **Look at the console** for specific error messages

## ✅ Success Indicators

You'll know it's working when:
- ✅ Console shows key press logs
- ✅ Progress indicator appears ("OpenAI responding...")
- ✅ Messages stream in one word at a time
- ✅ Judge verdicts or consensus appear at the end
- ✅ No red errors in console

Enjoy your AI debates! 🎭💬

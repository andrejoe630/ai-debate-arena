# Changelog - Recent Updates

## 2025-11-10 - Bug Fixes & Auto-Debate Feature

### 🐛 Bug Fixes

#### Issue: Enter key not working
**Problem**: Pressing Enter in the textarea did nothing

**Fixes Applied**:
1. Added debug console logging to track key presses
2. Fixed the `runDebate` function scope issue with `finalAffModel` and `finalNegModel` variables
3. Added logging to button clicks for debugging
4. Ensured proper event propagation

**Debug Logs Added**:
- `console.log('Key pressed:', e.key, 'Shift:', e.shiftKey, 'Loading:', loading)`
- `console.log('Enter pressed, calling runDebate')`
- `console.log('runDebate called', { topic, mode, loading })`
- `console.log('Button clicked')`

### ✨ New Features

#### 🎲 Auto-Debate Mode
**What it does**: In Debate Mode, automatically picks one random AI to debate against itself (both affirmative and negative sides).

**Implementation**:
- Added `autoDebate` state (default: `true`)
- When enabled, randomly selects from: `['openai', 'anthropic', 'gemini']`
- Same model is used for both affirmative and negative sides
- Shows a button: "🎲 Auto • Click to pick models"

**User Experience**:
- **Default behavior**: User just types topic and presses Enter → Random AI debates itself
- **Manual mode**: Click the Auto button → Shows dropdown menus to pick two different AIs
- Seamless toggle between auto and manual modes

**Code Changes**:
```typescript
const [autoDebate, setAutoDebate] = useState(true)

// In runDebate function:
if (autoDebate) {
  const models: ModelKey[] = ['openai', 'anthropic', 'gemini']
  const randomModel = models[Math.floor(Math.random() * models.length)]
  finalAffModel = randomModel
  finalNegModel = randomModel
}
```

#### UI Updates
- Auto mode shows: `<button>🎲 Auto • Click to pick models</button>`
- Manual mode shows: Two dropdown menus to select AIs
- Updated placeholder text to match current mode
- Better visual feedback for mode state

### 📝 Files Modified

1. **debate-ui/src/App.tsx**
   - Added `autoDebate` state
   - Added console logging throughout
   - Implemented auto-selection logic
   - Updated UI to show/hide model selectors based on mode
   - Fixed variable scope in `runDebate` function

### 🎯 Testing Checklist

To verify the fixes work:

1. **Test Enter Key**:
   - [ ] Open browser console (F12)
   - [ ] Type a topic in the textarea
   - [ ] Press Enter
   - [ ] Check console for logs: "Key pressed: Enter" and "runDebate called"
   - [ ] Verify debate starts

2. **Test Auto-Debate**:
   - [ ] Ensure "🎭 Debate Mode" is selected
   - [ ] Should see "🎲 Auto" button (default state)
   - [ ] Enter topic and start
   - [ ] Verify a random model is selected (check console log)
   - [ ] Verify debate runs with same model on both sides

3. **Test Manual Mode**:
   - [ ] Click the "🎲 Auto" button
   - [ ] Verify two dropdown menus appear
   - [ ] Select different models (e.g., OpenAI vs Claude)
   - [ ] Start debate and verify correct models are used

4. **Test Discussion Mode**:
   - [ ] Switch to "💬 Discussion Mode"
   - [ ] Enter topic
   - [ ] Verify all 3 AIs participate
   - [ ] Check for consensus or judge voting

### 🔍 Debug Information

If Enter key still doesn't work, check:
1. Browser console for error messages
2. Network tab for failed requests
3. Make sure backend is running on port 5050
4. Check if textarea is actually focused when pressing Enter

### 📚 Documentation Added

- `README_UPDATED.md` - Complete guide to new features
- `CHANGELOG.md` - This file with technical details
- `DISCUSSION_MODE.md` - Details about 3-AI discussion feature

### 🚀 Next Steps

If issues persist:
1. Check browser console for specific errors
2. Verify backend is running: `npm run serve`
3. Verify frontend is running: `npm run dev`
4. Clear browser cache and rebuild: `npm run build`
5. Check that ports 5050 (backend) and 5173 (frontend) are not blocked

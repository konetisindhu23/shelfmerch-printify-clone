# Placeholder Behavior Demo

## Visual Comparison: Before vs After

### BEFORE (Old System)
```
❌ PROBLEM: Dragging handles corrupted production dimensions

Initial State:
┌─────────────────┐
│   Print Area    │  Width: 5.0"
│   5.0" × 5.0"   │  Height: 5.0"
└─────────────────┘

User drags corner handle to resize...

After Drag:
┌───────────────────────┐
│   Print Area          │  Width: 6.8" ← CORRUPTED!
│   6.8" × 6.8"         │  Height: 6.8" ← CORRUPTED!
└───────────────────────┘

💥 The production file would now print at 6.8" × 6.8" instead of 5.0" × 5.0"!
```

---

### AFTER (New System)

#### Scenario A: Size Locked ✅
```
✅ SOLUTION: Scale separates visual from production

Initial State:
┌─────────────────┐
│   Print Area    │  Width: 5.0" (locked 🔒)
│   5.0" × 5.0"   │  Height: 5.0" (locked 🔒)
└─────────────────┘  Scale: 1.0

User drags corner handle...

After Drag:
┌───────────────────────┐
│   Print Area          │  Width: 5.0" ✓ (unchanged!)
│   5.0" × 5.0"         │  Height: 5.0" ✓ (unchanged!)
└───────────────────────┘  Scale: 1.36 (visual only)

✅ Production file still prints at EXACTLY 5.0" × 5.0"
✅ Visual mockup looks bigger, but dimensions are protected
```

#### Scenario B: Size Unlocked 🔓
```
✅ TRADITIONAL: Free resize mode when you want to change both

Initial State:
┌─────────────────┐
│   Print Area    │  Width: 5.0" (unlocked 🔓)
│   5.0" × 5.0"   │  Height: 5.0" (unlocked 🔓)
└─────────────────┘  Scale: 1.0

User drags corner handle...

After Drag:
┌───────────────────────┐
│   Print Area          │  Width: 6.8" (updated)
│   6.8" × 6.8"         │  Height: 6.8" (updated)
└───────────────────────┘  Scale: 1.0 (reset)

✅ Both visual and production dimensions change together
✅ Scale stays at 1.0 for consistency
```

---

## UI Walkthrough

### Step 1: Open Design Tab
```
┌────────────────────────────────────────────────┐
│  1. Catalogue  2. Variants  [3. Design]  ...  │
└────────────────────────────────────────────────┘
```

### Step 2: Add Placeholder
```
┌──────────────────────────────────────┐
│  Front View Mockup                   │
│                                       │
│      ┌─────────────┐                 │
│      │             │ ← Click "Add"   │
│      │  6" × 6"    │                 │
│      │             │                 │
│      └─────────────┘                 │
│                                       │
└──────────────────────────────────────┘
[Add Placeholder] [Delete]
```

### Step 3: Set Exact Dimensions
```
┌─────────────────────────────────────┐
│  Placeholder Properties              │
├─────────────────────────────────────┤
│                                      │
│  ☐ Lock print size (inches)  🔓    │
│                                      │
│  X Position (")     [7.0]            │
│  Y Position (")     [9.0]            │
│                                      │
│  Width (")          [5.0]  ← Type!  │
│  Height (")         [5.0]  ← Type!  │
│                                      │
│  Rotation (degrees) [0]              │
└─────────────────────────────────────┘
```

### Step 4: Lock Size for Production
```
┌─────────────────────────────────────┐
│  Placeholder Properties              │
├─────────────────────────────────────┤
│                                      │
│  ☑ Lock print size (inches)  🔒    │
│                                      │
│  ℹ Print size is locked. Dragging   │
│    handles will only change visual   │
│    scale, not actual print dims.     │
│                                      │
│  X Position (")     [7.0]            │
│  Y Position (")     [9.0]            │
│                                      │
│  Width (") 🔒       [5.0] (disabled) │
│  Height (") 🔒      [5.0] (disabled) │
│                                      │
│  Rotation (degrees) [0]              │
│                                      │
│  Visual scale: 120%  ← NEW!         │
└─────────────────────────────────────┘
```

### Step 5: Drag to Adjust Visual Size
```
Mockup Canvas:
┌──────────────────────────────────────┐
│                                       │
│      ┌─────────────────┐             │
│      │                 │ ← Drag      │
│      │  Still 5" × 5"  │   corner!   │
│      │  (locked 🔒)    │             │
│      │                 │             │
│      └─────────────────┘             │
│                                       │
│  W: 5.0"  H: 5.0"  ← Labels show    │
│  (true dimensions, not scaled!)      │
└──────────────────────────────────────┘
```

---

## Real-World Example

### Scenario: T-Shirt with Logo

**Requirement:** Logo must print at **4.5" wide × 3.0" tall** (brand guidelines)

**Old System Problem:**
1. Designer sets 4.5" × 3.0"
2. Drags corner to make it look better on mockup
3. Dimensions become 5.2" × 3.5" (oops!)
4. T-shirts print with wrong size logo ❌

**New System Solution:**
1. Designer sets 4.5" × 3.0"
2. Checks "Lock print size" 🔒
3. Drags corner to adjust visual placement
4. Dimensions stay **exactly** 4.5" × 3.0" ✅
5. T-shirts print with correct size logo ✅

---

## Data Structure

### Old Format (Deprecated)
```json
{
  "id": "front-123",
  "xIn": 7.0,
  "yIn": 9.0,
  "wIn": 5.0,
  "hIn": 5.0,
  "rotationDeg": 0
}
```

### New Format
```json
{
  "id": "front-123",
  "xIn": 7.0,
  "yIn": 9.0,
  "widthIn": 5.0,      ← Source of truth
  "heightIn": 5.0,     ← Source of truth
  "rotationDeg": 0,
  "scale": 1.2,        ← Visual multiplier
  "lockSize": true     ← Lock flag
}
```

### Migration (Automatic)
```javascript
// When loading old placeholder:
{
  "wIn": 5.0,          // Legacy
  "hIn": 5.0           // Legacy
}

// Automatically becomes:
{
  "widthIn": 5.0,      // Migrated from wIn
  "heightIn": 5.0,     // Migrated from hIn
  "scale": 1.0,        // Default
  "lockSize": false    // Default
}
```

---

## Keyboard Shortcuts (Future Enhancement Idea)

- `L` - Toggle Lock Size
- `R` - Reset scale to 1.0
- `Shift + Drag` - Maintain aspect ratio
- `Ctrl + D` - Duplicate placeholder

---

## Production File Generation

When generating print-ready files:

```javascript
// ALWAYS use widthIn and heightIn (never scale!)
const printWidthPixels = placeholder.widthIn * DPI;
const printHeightPixels = placeholder.heightIn * DPI;

// Example: 5.0" at 300 DPI
// printWidthPixels = 5.0 × 300 = 1500px
// (scale is ignored for production!)
```

---

## Summary

| Feature | Before | After |
|---------|--------|-------|
| **Drag handles** | Changes production size | Choice: Lock = scale only, Unlock = change both |
| **Type dimensions** | Updates immediately | Updates immediately + resets scale to 1.0 |
| **Production accuracy** | ❌ Can be corrupted | ✅ Always protected when locked |
| **Visual flexibility** | ⚠️ Limited | ✅ Independent scale adjustment |
| **User intent** | ❌ Ambiguous | ✅ Clear lock/unlock modes |
| **Data integrity** | ❌ Mixed concerns | ✅ Separate real size from visual |

**Bottom Line:** You can now confidently set exact production dimensions and never worry about accidentally changing them while adjusting the mockup layout! 🎉


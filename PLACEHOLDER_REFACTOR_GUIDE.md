# Placeholder Refactoring Guide

## Overview
The print placeholder system has been refactored to separate **real print size** from **visual scale**, giving admins precise control over production dimensions while allowing flexible visual adjustments in the mockup editor.

---

## Key Changes

### 1. New Placeholder Structure

**Before:**
```typescript
interface Placeholder {
  id: string;
  xIn: number;
  yIn: number;
  wIn: number;  // Width in inches (gets corrupted by drag)
  hIn: number;  // Height in inches (gets corrupted by drag)
  rotationDeg: number;
}
```

**After:**
```typescript
interface Placeholder {
  id: string;
  xIn: number;           // X position (unchanged)
  yIn: number;           // Y position (unchanged)
  widthIn: number;       // TRUE print width - source of truth
  heightIn: number;      // TRUE print height - source of truth
  rotationDeg: number;   // Rotation (unchanged)
  scale?: number;        // Visual scale multiplier (default: 1.0)
  lockSize?: boolean;    // Lock print size flag (default: false)
}
```

---

## How It Works

### Real Print Size vs Visual Scale

- **`widthIn` / `heightIn`**: The actual dimensions that will be used for production printing
- **`scale`**: A multiplier that only affects how big the rectangle appears on the mockup
- **Display formula**: `visualWidth = widthIn × scale × PX_PER_INCH`

### Lock Size Checkbox

#### When **Locked** (`lockSize = true`):
- ✅ Dragging corner handles **only changes `scale`**
- ✅ `widthIn` and `heightIn` **remain unchanged**
- ✅ Width/Height inputs are **disabled** to prevent confusion
- ✅ Production dimensions are **protected**

#### When **Unlocked** (`lockSize = false`):
- ✅ Dragging corner handles **changes `widthIn` and `heightIn`**
- ✅ `scale` is **reset to 1.0** after each transform
- ✅ Width/Height inputs are **editable**
- ✅ Typing new values updates real dimensions and resets scale

---

## UI Changes

### Placeholder Properties Panel

**New Elements:**
1. **Lock Size Checkbox** - Toggle between locked/unlocked modes
2. **Lock Icon** - Visual indicator (🔒 when locked, 🔓 when unlocked)
3. **Info Message** - Explains what happens when size is locked
4. **Scale Display** - Shows current visual scale when ≠ 1.0
5. **Disabled Inputs** - Width/Height inputs disabled when locked

**Input Behavior:**
- When you manually type new Width/Height values, `scale` is automatically reset to 1.0
- Dimensions shown in labels always reflect TRUE print size (`widthIn`/`heightIn`)

---

## Canvas Changes

### Rendering Logic (`CanvasMockup.tsx`)

**Display Calculation:**
```typescript
const scale = placeholder.scale ?? 1.0;
const widthPx = inchesToPixels(placeholder.widthIn) * scale;
const heightPx = inchesToPixels(placeholder.heightIn) * scale;
```

**Transform Handler:**
```typescript
if (lockSize) {
  // Only update scale, keep widthIn/heightIn unchanged
  const newScale = currentScale * (scaleX + scaleY) / 2;
  onPlaceholderChange(id, { scale: newScale });
} else {
  // Update widthIn/heightIn, reset scale to 1.0
  onPlaceholderChange(id, { 
    widthIn: pixelsToUnits(newWidth),
    heightIn: pixelsToUnits(newHeight),
    scale: 1.0 
  });
}
```

**Dimension Labels:**
- Always show TRUE inches: `W: 4.92"` displays `placeholder.widthIn`, not scaled pixels
- This ensures production accuracy

---

## Backend Changes

### Database Schema (`backend/models/Product.js`)

**PlaceholderSchema:**
```javascript
const PlaceholderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  xIn: { type: Number, required: true },
  yIn: { type: Number, required: true },
  // Legacy fields (for backward compatibility)
  wIn: { type: Number },
  hIn: { type: Number },
  // New fields (source of truth)
  widthIn: { type: Number },
  heightIn: { type: Number },
  rotationDeg: { type: Number, default: 0 },
  scale: { type: Number, default: 1.0 },
  lockSize: { type: Boolean, default: false },
}, { _id: false });
```

---

## Migration Strategy

### Automatic Migration (`AdminProductCreation.tsx`)

When loading existing products, old placeholders are automatically migrated:

```typescript
placeholders: view.placeholders.map((p: any) => ({
  id: p.id,
  xIn: p.xIn,
  yIn: p.yIn,
  widthIn: p.widthIn ?? p.wIn ?? 6,    // Migrate old wIn → widthIn
  heightIn: p.heightIn ?? p.hIn ?? 6,  // Migrate old hIn → heightIn
  rotationDeg: p.rotationDeg ?? 0,
  scale: p.scale ?? 1.0,
  lockSize: p.lockSize ?? false,
}))
```

### What Happens to Existing Data?

1. **Old products with `wIn`/`hIn`** → Automatically converted to `widthIn`/`heightIn` on load
2. **Scale defaults to 1.0** → No visual change
3. **LockSize defaults to false** → Preserves old behavior
4. **Next save** → Stores in new format

---

## Use Cases

### Use Case 1: Setting Exact Production Size
**Goal:** Print a logo that's exactly 5.00" × 5.00"

1. Type `5.0` in Width input
2. Type `5.0` in Height input
3. Check "Lock print size"
4. Drag handles to adjust visual size on mockup
5. Production file will use **exactly 5.00" × 5.00"**

### Use Case 2: Visual Layout Adjustment
**Goal:** Make placeholder look bigger on mockup without changing print size

1. Set desired print size: `4.5" × 6.0"`
2. Check "Lock print size"
3. Drag corner handles to make it visually larger
4. Scale changes to `1.2`, but print stays `4.5" × 6.0"`

### Use Case 3: Traditional Free Resize
**Goal:** Quickly adjust both visual and print size together

1. Uncheck "Lock print size"
2. Drag handles to resize freely
3. Width/Height update automatically
4. Scale stays at 1.0

---

## Testing Checklist

- [ ] Create new product with placeholder
- [ ] Set Width: 5.0", Height: 5.0"
- [ ] Check "Lock print size"
- [ ] Drag corner handles → dimensions should stay 5.0" × 5.0"
- [ ] Uncheck "Lock print size"
- [ ] Drag corner handles → dimensions should change
- [ ] Verify dimension labels show true inches, not scaled
- [ ] Load existing product → migration works
- [ ] Save and reload → new format persists

---

## Benefits

✅ **Production Accuracy** - Print dimensions never get corrupted by UI interactions
✅ **Design Flexibility** - Visual scale independent of real size
✅ **User Control** - Clear lock/unlock modes with visual feedback
✅ **Backward Compatible** - Existing products automatically migrate
✅ **Data Integrity** - Source of truth (`widthIn`/`heightIn`) always preserved

---

## Files Changed

### Frontend
- `src/types/product.ts` - Updated `Placeholder` interface
- `src/components/admin/PlaceholderControls.tsx` - Added lock checkbox, scale display, disabled inputs
- `src/components/admin/CanvasMockup.tsx` - Updated rendering and transform logic
- `src/components/admin/ProductImageConfigurator.tsx` - New placeholder defaults
- `src/pages/AdminProductCreation.tsx` - Migration logic on load

### Backend
- `backend/models/Product.js` - Updated `PlaceholderSchema` with new fields

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify placeholder data structure in DB
3. Ensure migration logic runs on product load
4. Test with fresh product vs existing product

**Key Principle:** `widthIn` and `heightIn` are the **only source of truth** for production. `scale` is purely visual.


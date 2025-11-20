# Product Variant Options Guide

## Overview

The variant options system provides appropriate size and color choices based on the product's category and subcategory. This ensures that admins see relevant options when creating products.

---

## How It Works

1. **Admin selects Category** (e.g., "Apparel")
2. **Admin selects Subcategory** (e.g., "Mug")
3. **System automatically shows appropriate variant options:**
   - For T-Shirts: XS, S, M, L, XL sizes + standard apparel colors
   - For Mugs: 11oz, 15oz, 20oz capacities + mug colors
   - For Phone Covers: iPhone models + tech accessory colors
   - And so on...

---

## Category-Specific Variant Options

### 1. Apparel
**Default Sizes:** XS, S, M, L, XL, XXL, 3XL, 4XL  
**Default Colors:** White, Black, Navy, Red, Gray, etc.

**Subcategory-Specific:**
- **T-Shirt:** XS-4XL sizes, standard apparel colors
- **Hoodie:** XS-3XL sizes, darker color palette
- **Tank Top:** XS-XXL sizes, lighter colors including pastels

---

### 2. Accessories
**Default:** One Size fits all

**Subcategory-Specific:**
- **Tote Bag:** Small, Medium, Large | Natural, Black, Navy
- **Cap:** One Size, Youth | Black, Navy, Gray, Camo
- **Phone Cover:** iPhone/Samsung models | Clear, Black, White, colors
- **Gaming Pad:** Size dimensions (9x7 to 18x16) | Tech colors
- **Beanie:** One Size | Cold-weather colors

---

### 3. Home & Living
**Default:** Standard size

**Subcategory-Specific:**
- **Mug:** 11oz, 15oz, 20oz | Ceramic colors
- **Can:** 12oz, 16oz, 20oz | Metallic finishes
- **Cushion:** 14x14 to 20x20 inches | Home decor colors
- **Frame:** 5x7 to 18x24 inches | Frame finishes
- **Coaster:** 4x4, 4.5x4.5 inches | Material-based colors

---

### 4. Print
**Default:** Full Color printing

**Subcategory-Specific:**
- **Business Card:** 3.5x2 inches | Full Color, B&W
- **Poster:** A4, A3, A2, A1, custom | Full Color, B&W, Sepia
- **Sticker:** 2x2 to 6x6 inches | Full Color, Single Color, Clear
- **Flyer:** A4, A5, Letter sizes | Full Color, B&W
- **Notebook:** A4, A5, A6, B5 | White/Cream/Black pages
- **Banner:** 2x4 ft to 5x10 ft | Full Color
- **Canvas:** 8x10 to 24x36 inches | Standard/Gallery wrap

---

### 5. Packaging
**Default:** Small, Medium, Large

**Subcategory-Specific:**
- **Box:** 4x4x4 to 12x12x12 inches | White, Kraft, Black
- **Bottle:** 50ml to 1000ml | Clear, Amber, Blue, Green
- **Pouch:** Small, Medium, Large | Clear, White, Kraft, Silver
- **Tube:** Diameter x Length | White, Kraft, Black

---

### 6. Tech
**Default:** Standard

**Subcategory-Specific:**
- **iPhone:** iPhone 13/14/15 models | Clear, Black, White, colors
- **iPad:** iPad sizes (10.2", 11", 12.9") | Tech accessory colors
- **Macbook:** MacBook Air/Pro models | Clear, Black, Gray
- **Phone:** Generic phone sizes | Universal accessory colors

---

### 7. Jewelry
**Default:** One Size, Adjustable

**Subcategory-Specific:**
- **Ring:** Size 5-11, Adjustable | Silver, Gold, Rose Gold
- **Necklace:** 14" to 24" chain length | Precious metal finishes
- **Earring:** Small, Medium, Large | Metal finishes

---

## Size Labels

The system uses appropriate labels for different product types:

| Category | Size Label | Example |
|----------|------------|---------|
| Apparel | Size | S, M, L |
| Home (Mug) | Capacity | 11oz, 15oz |
| Accessories (Phone) | Model | iPhone 14 Pro |
| Print (Business Card) | Size (inches) | 3.5x2 |
| Frame | Frame Size | 8x10 |
| Jewelry (Ring) | Ring Size | 7, 8, 9 |
| Packaging (Box) | Dimensions (inches) | 6x6x6 |

---

## Custom Options

### When Custom Sizes Are Allowed:
- **Apparel:** No (standardized clothing sizes)
- **Accessories:** Some (e.g., Phone Cover models)
- **Home:** Some (e.g., Frames can have custom sizes)
- **Print:** Yes (most print products allow custom dimensions)
- **Packaging:** Yes (custom box/bottle sizes)
- **Tech:** Yes (new device models can be added)
- **Jewelry:** Yes (custom ring sizes)

### When Custom Colors Are Allowed:
- **Apparel:** Yes (PMS color matching)
- **Accessories:** Yes (custom branded colors)
- **Home:** Yes (custom color requests)
- **Print:** Limited (print has preset color modes)
- **Packaging:** Yes (custom branding colors)
- **Tech:** Yes (custom case colors)
- **Jewelry:** Yes (special finishes)

---

## Color Hex Mapping

The system includes visual color swatches. Colors are mapped to hex values:

```typescript
'White': '#FFFFFF'
'Black': '#000000'
'Navy': '#000080'
'Red': '#FF0000'
'Silver': '#C0C0C0'
'Gold': '#FFD700'
'Rose Gold': '#B76E79'
'Clear': 'rgba(255,255,255,0.3)'
// ... and many more
```

For print products with gradients:
```typescript
'Full Color': 'linear-gradient(90deg, #FF0000, #FFFF00, #00FF00, #0000FF)'
```

---

## Usage Example

When creating a product:

1. **Select Category: "Home & Living"**
   - Default options appear (Standard size, basic colors)

2. **Select Subcategory: "Mug"**
   - Size options change to: 11oz, 15oz, 20oz
   - Label changes to: "Capacity"
   - Color options update to mug-appropriate colors

3. **System generates variants:**
   - 11oz - White
   - 11oz - Black
   - 15oz - White
   - 15oz - Black
   - etc.

---

## Adding New Options

To add options for a new product type:

1. **Open:** `src/config/productVariantOptions.ts`
2. **Find the category section**
3. **Add subcategory-specific options:**

```typescript
'New Product Type': {
  sizes: ['Option 1', 'Option 2', 'Option 3'],
  colors: ['Color 1', 'Color 2'],
  allowCustomSizes: true,
  allowCustomColors: true,
  sizeLabel: 'Custom Label',
}
```

4. **Add color hex values if needed:**

```typescript
export const COLOR_HEX_MAP: Record<string, string> = {
  // ... existing colors
  'New Color': '#HEXCODE',
};
```

---

## Benefits

✅ **Relevant Options:** Admins only see options that make sense for the product type  
✅ **Better UX:** No confusion about what "size" means for different products  
✅ **Consistency:** All mugs use the same capacity options  
✅ **Flexibility:** Custom options can be added when needed  
✅ **Visual Feedback:** Color swatches help with selection  
✅ **Scalability:** Easy to add new product types and options

---

## Testing

### Test Apparel Product:
1. Category: Apparel → Subcategory: T-Shirt
2. Expected: XS-4XL sizes, apparel colors
3. Label: "Available Sizes"

### Test Home Product:
1. Category: Home & Living → Subcategory: Mug
2. Expected: 11oz, 15oz, 20oz options
3. Label: "Capacity"

### Test Tech Product:
1. Category: Tech → Subcategory: iPhone
2. Expected: iPhone model names as sizes
3. Label: "Model"

### Test Custom Options:
1. Select product with allowCustomSizes: true
2. Input field should appear below checkboxes
3. Add custom option → should appear in selected list

---

## Configuration File

All variant options are defined in:
- **Frontend:** `src/config/productVariantOptions.ts`
- **Exports:**
  - `VARIANT_OPTIONS` - Full configuration object
  - `getVariantOptions(categoryId, subcategoryId)` - Fetches options
  - `getColorHex(colorName)` - Gets color hex for display
  - `COLOR_HEX_MAP` - Color name to hex mapping

---

## Component Integration

The `ProductVariantsSection` component:
- Accepts `categoryId` and `subcategoryId` props
- Fetches appropriate options using `getVariantOptions()`
- Dynamically renders size/color checkboxes
- Shows custom input fields when allowed
- Updates label based on product type (Size → Capacity → Model, etc.)

---

## Future Enhancements

1. **Backend Validation:** Validate that submitted variant options match allowed options
2. **Inventory Integration:** Track stock per variant
3. **Pricing Per Variant:** Different prices for different sizes
4. **Variant Images:** Upload images for each variant
5. **Bulk Import:** CSV import for large variant sets
6. **Historical Data:** Show most commonly used options per category


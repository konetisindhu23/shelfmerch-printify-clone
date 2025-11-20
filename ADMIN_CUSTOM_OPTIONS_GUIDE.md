# Admin Custom Options Guide

## 🎯 Overview

Super admins can add custom size and color options to any product, in addition to the pre-configured options. This provides flexibility while maintaining structure.

---

## ✨ Features

### 1. **Pre-Configured Options** (Checkboxes)
- Each product type has curated size and color options
- Example: T-Shirts have XS-4XL, Mugs have 11oz/15oz/20oz
- Simply check the boxes for standard options

### 2. **Custom Options** (Input Fields)
- Add unique sizes or colors not in the pre-configured list
- Examples:
  - Youth sizes for apparel
  - Special PMS colors
  - Custom dimensions
  - New device models
  - Limited edition colors

---

## 📋 How to Add Custom Options

### Adding Custom Sizes:

1. Navigate to **Admin → Add Product**
2. Fill in **Catalogue** (Category + Subcategory)
3. Go to **Variants** tab
4. **Check pre-configured sizes** you want
5. **Scroll to custom input field** below the checkboxes
6. **Type custom size** (e.g., "Youth M", "5.5x8.5", "iPhone 16 Pro")
7. **Click "Add Custom"** or press Enter
8. Custom size appears as a badge with other selected sizes

### Adding Custom Colors:

1. Same steps as above
2. Scroll to **color section**
3. **Check pre-configured colors** you want
4. **Use custom color input** below checkboxes
5. **Type custom color** (e.g., "Forest Blue", "PMS 185C", "Rose Pink")
6. **Click "Add Custom"** or press Enter
7. Custom color appears with other selected colors

---

## 💡 Hint Text

Many product types include helpful hints for custom options:

### Examples:

**T-Shirt Sizes:**
```
💡 Add youth sizes or custom measurements if needed.
```

**Apparel Colors:**
```
💡 Add custom PMS colors or special requests.
```

**Notebook Colors:**
```
💡 Add custom page colors (e.g., Grid, Dotted).
```

**Box Dimensions:**
```
💡 Add custom tube dimensions.
```

---

## 🎨 Use Cases

### 1. **Apparel - Youth Sizes**
- Pre-configured: XS, S, M, L, XL, XXL
- **Custom Add:** Youth S, Youth M, Youth L

### 2. **Mugs - Special Capacities**
- Pre-configured: 11oz, 15oz, 20oz
- **Custom Add:** 8oz (Small), 24oz (Travel)

### 3. **Tech - New Device Models**
- Pre-configured: iPhone 14, 14 Pro, 15, 15 Pro
- **Custom Add:** iPhone 16, iPhone SE 2024

### 4. **Apparel - Brand Colors**
- Pre-configured: White, Black, Navy, Red
- **Custom Add:** Brand Blue (#0066CC), Sunset Orange

### 5. **Print - Non-Standard Sizes**
- Pre-configured: A4, A3, Letter
- **Custom Add:** 5.5x8.5, 7x10, Square 8x8

### 6. **Packaging - Custom Dimensions**
- Pre-configured: 4x4x4, 6x6x6, 8x8x8
- **Custom Add:** 5x7x3, 10x8x4 (Custom Product Box)

---

## 🚨 When Custom Options Are Hidden

**Print Products** with `allowCustomColors: false`:
- Business Cards, Posters, Flyers (Full Color/B&W only)
- Reason: Print specifications are fixed
- Size custom input IS available

**Standard Jewelry**:
- Some specific models may restrict custom options
- Reason: Standardized jewelry sizing

**Most products ALLOW custom options** for maximum flexibility!

---

## ✅ Best Practices

### Do:
✅ Use custom options for legitimate variations  
✅ Add new device models as they release  
✅ Include brand-specific colors  
✅ Specify custom measurements clearly  
✅ Use consistent naming (e.g., "Youth M" not "YM")  

### Don't:
❌ Add duplicate options already in checkboxes  
❌ Use vague names like "Custom" or "Other"  
❌ Add too many custom options (use checkboxes first)  
❌ Misspell standard options  

---

## 📊 Visual Example

### Creating a T-Shirt Product:

**Step 1: Select Pre-Configured Sizes**
```
☑ XS  ☑ S  ☑ M  ☑ L  ☑ XL  ☐ XXL  ☐ 3XL  ☐ 4XL
```

**Step 2: Add Custom Sizes** (if needed)
```
💡 Add youth sizes or custom measurements if needed.
┌─────────────────────────────────────┐
│ Add custom size...                  │  [Add Custom]
└─────────────────────────────────────┘

Type: "Youth M" → Click "Add Custom"
```

**Step 3: Selected Sizes Display**
```
Selected: [XS] [S] [M] [L] [XL] [Youth M]
```

**Step 4: Select Colors**
```
☑ White  ☑ Black  ☑ Navy  ☐ Red  ☐ Gray
```

**Step 5: Add Custom Color**
```
💡 Add custom PMS colors or special requests.
┌─────────────────────────────────────┐
│ Add custom color...                 │  [Add Custom]
└─────────────────────────────────────┘

Type: "Brand Blue" → Click "Add Custom"
```

**Step 6: Final Variants Generated**
```
XS - White     | XS - Black     | XS - Navy     | XS - Brand Blue
S - White      | S - Black      | S - Navy      | S - Brand Blue
M - White      | M - Black      | M - Navy      | M - Brand Blue
L - White      | L - Black      | L - Navy      | L - Brand Blue
XL - White     | XL - Black     | XL - Navy     | XL - Brand Blue
Youth M - White| Youth M - Black| Youth M - Navy| Youth M - Brand Blue

Total: 24 variants
```

---

## 🔄 Editing Custom Options

### To Remove a Custom Option:
1. Find the badge with the custom value
2. Click the **X** icon on the badge
3. Option is removed
4. Variants regenerate automatically

### To Change a Custom Option:
1. Remove the old custom option (click X)
2. Add the corrected version
3. Variants update automatically

---

## 🎯 Per-Category Availability

| Category | Custom Sizes | Custom Colors | Notes |
|----------|--------------|---------------|-------|
| Apparel | ✅ Yes | ✅ Yes | Youth sizes, PMS colors |
| Accessories | ✅ Yes | ✅ Yes | Custom dimensions |
| Home | ✅ Yes | ✅ Yes | Non-standard sizes |
| Print | ✅ Yes | ⚠️ Limited | Size yes, color restricted |
| Packaging | ✅ Yes | ✅ Yes | Custom dimensions/colors |
| Tech | ✅ Yes | ✅ Yes | New device models |
| Jewelry | ✅ Yes | ✅ Yes | Custom sizes/finishes |

---

## 🛡️ Data Persistence

### Custom Options are Saved:
- ✅ Stored in product variants
- ✅ Included in SKU generation
- ✅ Persisted to database
- ✅ Shown in admin product list
- ✅ Available for customer selection

### Custom Options Don't Affect:
- ❌ Global configuration (config files stay unchanged)
- ❌ Other products (each product independent)
- ❌ Pre-configured options (always available)

---

## 💾 SKU Generation with Custom Options

Custom options are included in auto-generated SKUs:

```
Base SKU: PREMIUM-TSHIRT

Variants:
- PREMIUM-TSHIRT-M-WHITE
- PREMIUM-TSHIRT-M-BLACK
- PREMIUM-TSHIRT-YOUTH-M-BRAND-BLUE  ← Custom options in SKU
```

---

## 📱 Frontend Display

Custom options appear alongside standard options:

```javascript
// Product data structure
{
  availableSizes: ['S', 'M', 'L', 'Youth M'],  // Custom 'Youth M'
  availableColors: ['White', 'Black', 'Brand Blue'],  // Custom 'Brand Blue'
  variants: [
    { size: 'Youth M', color: 'Brand Blue', sku: '...' }
  ]
}
```

Customers see all options equally - no distinction between pre-configured and custom.

---

## 🎉 Summary

✨ **Pre-configured options** provide structure and consistency  
✨ **Custom options** provide flexibility for unique needs  
✨ **Hint text** guides admins on what to add  
✨ **Always available** (unless explicitly disabled)  
✨ **Easy to use** - just type and click "Add Custom"  
✨ **Product-specific** - doesn't affect other products  

The best of both worlds: **Structure + Flexibility** 🚀


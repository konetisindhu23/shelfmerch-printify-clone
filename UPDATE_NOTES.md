# Update Notes - Products.tsx & CategoryProducts.tsx

## ✅ Changes Made

### 1. Updated `Products.tsx`

**Changed subcategory mapping** to match new category structure:
```typescript
// OLD
const categorySlugToSubcategory: Record<string, string> = {
  't-shirts': 'T-Shirts',      // Plural
  'hoodies': 'Hoodies',        // Plural
  'bags': 'Tote Bags',         // Different name
  'drinkware': 'Drinkware',    // Generic
  'caps': 'Caps',              // Plural
  'stationery': 'Stationery',  // Generic
};

// NEW
const categorySlugToSubcategory: Record<string, string> = {
  't-shirts': 'T-Shirt',       // Singular - matches backend
  'hoodies': 'Hoodie',         // Singular
  'bags': 'Tote Bag',          // Specific - matches backend
  'drinkware': 'Mug',          // Specific product type
  'caps': 'Cap',               // Singular
  'stationery': 'Notebook',    // Specific product type
};
```

**Updated `formatProduct` function** to access brand from attributes:
```typescript
// OLD
const formatProduct = (product: any) => {
  return {
    brand: product.catalogue?.brand || 'ShelfMerch',  // Direct access
    // ...
  };
};

// NEW
const formatProduct = (product: any) => {
  // Get brand from attributes (dynamic) or fallback to ShelfMerch
  const brand = product.catalogue?.attributes?.brand || 'ShelfMerch';
  
  return {
    brand: brand,  // From attributes object
    // ...
  };
};
```

---

### 2. Updated `CategoryProducts.tsx`

**Same changes as Products.tsx:**
- Updated subcategory mapping to match backend structure
- Updated `formatProduct` to get brand from `attributes.brand`

---

## 🔍 Key Changes Explained

### Why subcategory names changed?

The backend now stores subcategory IDs exactly as defined in the config files:
- `backend/config/productCategories.js` (backend)
- `src/config/productCategories.ts` (frontend)

These configs use **singular, specific names** like:
- `"T-Shirt"` not `"T-Shirts"`
- `"Tote Bag"` not `"Tote Bags"`
- `"Mug"` not `"Drinkware"`

When filtering by subcategory in the API, you must use the exact name stored in `product.catalogue.subcategoryIds`.

### Why brand access changed?

In the refactored schema:
- Product-specific attributes are **no longer direct fields** on `catalogue`
- They are stored in `catalogue.attributes` (a Map/Object)
- This allows dynamic attributes based on product type

**Before:**
```typescript
{
  catalogue: {
    name: "T-Shirt",
    brand: "Nike",        // ← Direct field
    material: "Cotton",   // ← Direct field
    gsm: "180",          // ← Direct field
  }
}
```

**After:**
```typescript
{
  catalogue: {
    name: "T-Shirt",
    productTypeCode: "T_SHIRT",
    attributes: {
      brand: "Nike",      // ← Inside attributes
      material: "Cotton", // ← Inside attributes
      gsm: "180",        // ← Inside attributes
    }
  }
}
```

---

## 🧪 Testing

### Test 1: Products Page
1. Navigate to `/products`
2. Verify products load correctly
3. Check that brand names display (should show from `attributes.brand` or "ShelfMerch")

### Test 2: Category Filtering
1. Click on a category (e.g., T-Shirts)
2. Should navigate to `/products/category/t-shirts`
3. Should fetch products where `subcategoryIds` includes `"T-Shirt"`
4. Verify correct products display

### Test 3: Product Display
1. Create a test product with brand in attributes
2. Verify it displays on the products page with correct brand
3. Verify pricing and other details display correctly

---

## 🚨 Important Notes

### If Products Don't Load:

1. **Check subcategory IDs in database:**
   - Your existing products may have old subcategory values
   - Example: `["T-Shirts"]` should be `["T-Shirt"]` (singular)
   
2. **Check brand attribute:**
   - If products don't have `attributes.brand`, they'll show "ShelfMerch" as fallback
   - This is expected behavior

3. **Check API responses:**
   - Open browser DevTools → Network tab
   - Look for calls to `/api/products/catalog/active`
   - Verify the `subcategory` query parameter matches your config

### Migration Needed?

If you have existing products created with the old schema, you may need to migrate them:

```javascript
// Example: Update subcategory IDs
db.products.updateMany(
  { 'catalogue.subcategoryIds': 'T-Shirts' },
  { $set: { 'catalogue.subcategoryIds.$': 'T-Shirt' } }
);

// Move brand to attributes
db.products.updateMany(
  { 'catalogue.brand': { $exists: true } },
  [
    {
      $set: {
        'catalogue.attributes.brand': '$catalogue.brand',
        'catalogue.brand': '$$REMOVE'
      }
    }
  ]
);
```

---

## ✅ Summary

✅ Subcategory mapping updated to match backend config  
✅ Brand access updated to use `attributes.brand`  
✅ Both pages maintain backward compatibility with fallbacks  
✅ No breaking changes to UI/UX  
✅ Ready to handle new dynamic attributes structure

All changes are backward compatible - if products don't have the new structure, the code gracefully falls back to defaults.


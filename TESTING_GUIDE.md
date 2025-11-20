# Testing Guide - Dynamic Product Attributes

## Quick Test Scenarios

### 1. Create a T-Shirt Product (Apparel Category)

**Steps:**
1. Navigate to Admin → Products → Add Product
2. In the Catalogue tab:
   - **Product Name**: "Premium Cotton T-Shirt"
   - **Description**: "Comfortable 100% cotton t-shirt with modern fit"
   - **Category**: Select "Apparel"
   - **Subcategories**: Select "T-Shirt"
   - **Base Price**: 19.99

**Expected Behavior:**
- After selecting "Apparel" category, subcategories dropdown should show: T-Shirt, Tank Top, Hoodie, Sweatshirt, Jacket, Crop Top, Apron, Scarf, Jersey
- After selecting "T-Shirt" subcategory, the following attribute fields should appear:
  - Material (text)
  - GSM (text)
  - Fit (select: Regular/Oversized/Slim)
  - Brand (text)
  - Fabric Composition (text)
  - Collar Type (select: Crew Neck/V-Neck/Polo/Henley)
  - Sleeve Length (select: Short Sleeve/Long Sleeve/3/4 Sleeve)
- Product Type Code should auto-generate as "T_SHIRT"

**Sample Values:**
- Material: "100% Cotton"
- GSM: "180"
- Fit: "Regular"
- Brand: "Premium Basics"
- Fabric Composition: "100% Combed Cotton"
- Collar Type: "Crew Neck"
- Sleeve Length: "Short Sleeve"

### 2. Create a Mug Product (Home Category)

**Steps:**
1. Navigate to Admin → Products → Add Product
2. In the Catalogue tab:
   - **Product Name**: "Ceramic Coffee Mug"
   - **Description**: "Dishwasher safe ceramic mug"
   - **Category**: Select "Home & Living"
   - **Subcategories**: Select "Mug"
   - **Base Price**: 12.99

**Expected Behavior:**
- After selecting "Home & Living" category, subcategories should show: Can, Mug, Cushion, Frame, Coaster
- After selecting "Mug" subcategory, these attribute fields should appear:
  - Material (text)
  - Brand (text)
  - Capacity (text)
  - Dishwasher Safe (select: Yes/No)
  - Microwave Safe (select: Yes/No)
- Product Type Code should auto-generate as "MUG"
- **Note:** Different fields than T-Shirt!

**Sample Values:**
- Material: "Ceramic"
- Brand: "HomeEssentials"
- Capacity: "11oz"
- Dishwasher Safe: "Yes"
- Microwave Safe: "Yes"

### 3. Create a Business Card Product (Print Category)

**Steps:**
1. Navigate to Admin → Products → Add Product
2. In the Catalogue tab:
   - **Product Name**: "Premium Business Cards"
   - **Description**: "Professional business cards with premium finish"
   - **Category**: Select "Print"
   - **Subcategories**: Select "Business Card"
   - **Base Price**: 49.99

**Expected Behavior:**
- After selecting "Print" category, subcategories should show: Business Card, Book, ID Card, Sticker, Poster, Flyer, Greeting Card, Billboard, Magazine, Brochure, Lanyard, Banner, Canvas, Notebook
- After selecting "Business Card" subcategory, these fields should appear:
  - Paper Type (text)
  - Paper Weight (text)
  - Dimensions (text) *required
  - Finish (select: Matte/Glossy/Textured/Spot UV)
  - Corners (select: Square/Rounded)
- Product Type Code should auto-generate as "BUSINESS_CARD"

**Sample Values:**
- Paper Type: "Premium Cardstock"
- Paper Weight: "350gsm"
- Dimensions: "3.5x2 inches"
- Finish: "Matte"
- Corners: "Rounded"

### 4. Test Category Change Behavior

**Steps:**
1. Start creating a product
2. Select Category "Apparel"
3. Select Subcategory "T-Shirt"
4. Fill in some attribute values (e.g., Material: "Cotton")
5. Change Category to "Home & Living"

**Expected Behavior:**
- Subcategories should clear
- Attribute fields should clear
- Previously entered attribute values should be lost (this is intentional)
- New subcategory dropdown should show Home & Living options

### 5. Test Multiple Subcategories

**Steps:**
1. Select Category "Apparel"
2. Add Subcategory "T-Shirt"
3. Add Subcategory "Hoodie" (if your UI supports multiple)

**Expected Behavior:**
- Both T-Shirt and Hoodie specific fields should appear
- Common apparel fields should appear once
- Product Type Code should use the first subcategory (T_SHIRT)

### 6. Edit Existing Product

**Steps:**
1. Create a product successfully
2. Navigate to edit that product
3. Verify all fields load correctly

**Expected Behavior:**
- Category should be pre-selected
- Subcategories should be shown as badges
- Attribute fields should render based on saved category/subcategory
- Attribute values should populate from saved data
- Product Type Code should display correctly

### 7. Verify Required Field Validation

**Steps:**
1. Select Category "Tech"
2. Select Subcategory "IPhone"
3. Try to submit without filling "Model" field (marked as required*)

**Expected Behavior:**
- Required fields should be marked with red asterisk (*)
- Validation should prevent submission (check browser console)

### 8. Test API Response

**Backend Test:**
```bash
# After creating a product, check the database structure
# The catalogue object should look like:
{
  "catalogue": {
    "name": "Premium Cotton T-Shirt",
    "description": "...",
    "categoryId": "apparel",
    "subcategoryIds": ["T-Shirt"],
    "basePrice": 19.99,
    "tags": [],
    "productTypeCode": "T_SHIRT",
    "attributes": {
      "material": "100% Cotton",
      "gsm": "180",
      "fit": "Regular",
      "brand": "Premium Basics",
      "fabricComposition": "100% Combed Cotton",
      "collarType": "Crew Neck",
      "sleeveLength": "Short Sleeve"
    }
  }
}
```

## Browser Console Tests

### Check Product Type Code Generation
```javascript
// Open browser console on the product creation page
// After selecting a subcategory, check the form state:
console.log(catalogueData.productTypeCode);
// Should show: "T_SHIRT", "MUG", "BUSINESS_CARD", etc.
```

### Check Attribute Structure
```javascript
// After filling in attributes
console.log(catalogueData.attributes);
// Should show an object with key-value pairs
```

## Common Issues & Solutions

### Issue 1: Subcategories not appearing
**Solution:** Make sure a category is selected first

### Issue 2: Attributes not rendering
**Solution:** 
- Check that subcategory is selected
- Verify browser console for errors
- Check that config files are properly imported

### Issue 3: Product Type Code not updating
**Solution:**
- Check browser console for useEffect errors
- Verify subcategory is in the format "T-Shirt" not "t-shirt"

### Issue 4: Old apparel fields showing
**Solution:**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Restart development server

### Issue 5: Backend validation errors
**Solution:**
- Check that `productTypeCode` is being sent
- Verify `attributes` is an object, not undefined
- Check network tab for actual request payload

## Network Tab Inspection

When creating/updating a product, inspect the request payload:

```json
{
  "catalogue": {
    "name": "Product Name",
    "description": "Description",
    "categoryId": "apparel",
    "subcategoryIds": ["T-Shirt"],
    "basePrice": 19.99,
    "tags": [],
    "productTypeCode": "T_SHIRT",
    "attributes": {
      "material": "Cotton",
      "gsm": "180"
    }
  },
  "design": { ... },
  "shipping": { ... },
  "variants": [ ... ],
  ...
}
```

## Success Criteria

✅ All 7 categories load in dropdown  
✅ Subcategories are dynamic based on category  
✅ Attribute fields are dynamic based on category + subcategory  
✅ Product Type Code generates automatically  
✅ Category change resets subcategories and attributes  
✅ Products can be created successfully  
✅ Products can be edited and attributes load correctly  
✅ No hard-coded apparel fields appear  
✅ Backend accepts and stores attributes correctly  
✅ Required fields are marked and validated  

## Database Verification

After creating products, connect to MongoDB and verify:

```javascript
db.products.findOne({ 'catalogue.name': 'Premium Cotton T-Shirt' })
```

Check that:
1. `catalogue.productTypeCode` exists
2. `catalogue.attributes` is an object with the correct fields
3. Old fields (material, gsm, fit, etc.) do NOT exist at the catalogue level
4. `catalogue.categoryId` is valid

## Performance Check

- [ ] Category dropdown loads instantly
- [ ] Subcategory dropdown updates instantly when category changes
- [ ] Attribute fields render without lag
- [ ] Product creation completes in < 3 seconds
- [ ] Product editing loads data in < 2 seconds

## Accessibility Check

- [ ] All fields have proper labels
- [ ] Required fields are marked
- [ ] Select dropdowns are keyboard navigable
- [ ] Form can be filled using only keyboard
- [ ] Screen reader announces field changes


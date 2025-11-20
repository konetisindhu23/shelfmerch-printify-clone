# Dynamic Catalogue Fields Guide

## Overview
Super admins can now add custom product attributes (catalogue fields) dynamically via the Admin UI, similar to how custom variant options (sizes/colors) work. These fields automatically appear in the product creation form for the specified category/subcategory.

---

## 🎯 Key Features

### 1. **Static + Dynamic Fields**
- **Static fields:** Defined in `src/config/productFieldDefinitions.ts` (code-only)
- **Dynamic fields:** Added by super admins via UI, stored in MongoDB
- **Merge behavior:** Both appear in product creation form, dynamic fields added after static ones

### 2. **Category & Subcategory Scoping**
- Fields can be scoped to:
  - **All products in a category** (e.g., all "apparel" products)
  - **Specific subcategory** (e.g., only "T-Shirt" products)

### 3. **Flexible Field Types**
- **Text:** Single-line text input
- **Textarea:** Multi-line text input
- **Number:** Numeric input
- **Select:** Dropdown with predefined options

### 4. **Field Attributes**
- **Key:** Unique identifier (lowercase, underscores) e.g., `print_area`
- **Label:** Display name shown in UI e.g., "Print Area"
- **Required:** Whether field must be filled
- **Placeholder:** Input hint text
- **Unit:** Measurement unit e.g., "cm" or "inches"
- **Options:** For select fields (dropdown choices)

---

## 📁 File Structure

### Backend Files
```
backend/
├── models/
│   └── CatalogueFieldTemplate.js    # MongoDB schema for custom fields
├── routes/
│   └── catalogueFields.js           # API routes (GET, POST, PUT, DELETE)
└── server.js                        # Route registration
```

### Frontend Files
```
src/
├── pages/
│   ├── ManageCatalogueFields.tsx    # Admin UI to manage fields
│   ├── Admin.tsx                     # Updated with new menu link
│   └── App.tsx                       # New route added
├── components/admin/
│   └── ProductCatalogueSection.tsx  # Fetches & renders dynamic fields
└── lib/
    └── api.ts                        # catalogueFieldsApi functions
```

---

## 🚀 How to Use

### For Super Admins: Adding Custom Fields

1. **Navigate to Admin Panel**
   ```
   Admin Dashboard → Catalogue Fields (in sidebar)
   ```

2. **Fill in the Form**
   ```
   Category:      Select target category (e.g., "Apparel")
   Subcategory:   (Optional) Select specific subcategory (e.g., "Hoodie")
   Field Key:     Unique identifier, lowercase_with_underscores
   Display Label: User-facing name
   Field Type:    text | textarea | number | select
   Options:       (For select) Add dropdown choices
   Placeholder:   Input hint
   Unit:          (Optional) Measurement unit
   Required:      Toggle if field must be filled
   ```

3. **Click "Create Field"**
   - Field saved to database
   - Immediately available in product creation form

### For Admins: Using Dynamic Fields

1. **Go to:** Admin → Add New Product → Catalogue Tab
2. **Select Category/Subcategory:** e.g., Apparel → Hoodie
3. **Dynamic fields appear automatically** below static fields
4. **Fill in values** and save product

---

## 🔄 Data Flow

### 1. Admin Adds Custom Field
```
Admin UI (ManageCatalogueFields.tsx)
    ↓ POST /api/catalogue-fields
Backend (catalogueFields.js)
    ↓ Save to MongoDB
CatalogueFieldTemplate collection
```

### 2. Product Creation Form Loads
```
ProductCatalogueSection.tsx
    ↓ GET /api/catalogue-fields?categoryId=apparel&subcategoryId=Hoodie
Backend returns dynamic fields
    ↓ Merge with static fields
Render all fields in form
```

### 3. Admin Saves Product
```
Product form submission
    ↓ catalogue.attributes = { brand: "Nike", print_area: "12x16 inches", ... }
Backend validates & saves
    ↓ Stored in Product.catalogue.attributes (Map)
MongoDB
```

---

## 📊 Database Schema

### CatalogueFieldTemplate Collection
```javascript
{
  _id: ObjectId,
  categoryId: "apparel",              // Required: category identifier
  subcategoryId: "Hoodie",            // Optional: specific subcategory
  key: "print_area",                  // Required: unique field key
  label: "Print Area",                // Required: display label
  type: "text",                       // Required: text | textarea | number | select
  options: ["Option A", "Option B"],  // For select type
  required: false,                    // Whether field is mandatory
  placeholder: "Enter print area...", // Input hint
  unit: "inches",                     // Measurement unit
  createdBy: ObjectId,                // Admin who created it
  isActive: true,                     // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

### Product.catalogue.attributes (Map)
```javascript
{
  // Static fields
  brand: "Nike",
  material: "100% Cotton",
  gsm: "180",
  
  // Dynamic fields
  print_area: "12x16 inches",
  care_instructions: "Machine wash cold",
  custom_field: "Custom value"
}
```

---

## 🔒 Permissions

| Action | Required Role |
|--------|---------------|
| View custom fields in product form | Any admin (read from API) |
| Add new field template | Super Admin |
| Edit field template | Super Admin |
| Delete field template | Super Admin |

---

## 🎨 UI Components

### ManageCatalogueFields Page

**Left Panel: Add New Field Form**
- Category dropdown
- Subcategory dropdown (optional)
- Field configuration inputs
- "Create Field" button

**Right Panel: Existing Fields List**
- Filter by category
- Grouped by category/subcategory
- Delete button for each field
- Field metadata display (key, type, options, etc.)

### ProductCatalogueSection (Product Creation Form)

**Dynamic Rendering:**
- Static fields render first
- Dynamic fields append after
- Same `renderField()` function for both
- Info banner shows current category/subcategory context

---

## 🧪 Testing Checklist

### Backend
- [ ] Create field: `POST /api/catalogue-fields`
- [ ] Get fields by category: `GET /api/catalogue-fields?categoryId=apparel`
- [ ] Get fields by subcategory: `GET /api/catalogue-fields?categoryId=apparel&subcategoryId=Hoodie`
- [ ] Update field: `PUT /api/catalogue-fields/:id`
- [ ] Delete field: `DELETE /api/catalogue-fields/:id`
- [ ] Get stats: `GET /api/catalogue-fields/stats`
- [ ] Duplicate key validation (should fail)

### Frontend
- [ ] Navigate to Admin → Catalogue Fields
- [ ] Add text field for "apparel" category
- [ ] Add select field with options for "Hoodie" subcategory
- [ ] Add number field with unit for "print" category
- [ ] Verify field appears in product creation form
- [ ] Create product and fill in custom field
- [ ] Save product and reload → verify value persists
- [ ] Delete custom field → verify it disappears from form

---

## 🔄 Comparison with Variant Options

| Feature | Variant Options | Catalogue Fields |
|---------|----------------|------------------|
| **Purpose** | Size/color variants | Product attributes |
| **Stored in** | `availableSizes`, `availableColors` | `catalogue.attributes` |
| **UI Location** | Variants tab | Catalogue tab |
| **Field Types** | Checkboxes (predefined + custom) | Text, Textarea, Number, Select |
| **Scope** | Category/subcategory | Category/subcategory |
| **Management Page** | `/admin/variant-options` | `/admin/catalogue-fields` |
| **API Endpoint** | `/api/variant-options` | `/api/catalogue-fields` |

---

## 📝 Example Scenarios

### Scenario 1: Add "Print Area" for Apparel

**Admin Action:**
1. Go to: Admin → Catalogue Fields
2. Fill form:
   - Category: Apparel
   - Subcategory: (leave blank for all apparel)
   - Key: `print_area`
   - Label: "Print Area"
   - Type: text
   - Placeholder: "e.g., 12x16 inches"
   - Unit: inches
   - Required: Yes
3. Click "Create Field"

**Result:**
- Field appears on all apparel product creation forms
- Admins must fill "Print Area" when creating T-Shirt, Hoodie, etc.
- Value saved in `product.catalogue.attributes.print_area`

### Scenario 2: Add "Care Instructions" for Hoodies Only

**Admin Action:**
1. Category: Apparel
2. **Subcategory: Hoodie** (specific)
3. Key: `care_instructions`
4. Label: "Care Instructions"
5. Type: textarea
6. Required: No

**Result:**
- Field only appears for Hoodie products
- Other apparel subcategories don't see it
- Optional field (can be left blank)

### Scenario 3: Add "Paper Type" with Dropdown for Print Products

**Admin Action:**
1. Category: Print
2. Key: `paper_type`
3. Label: "Paper Type"
4. Type: **select**
5. Options: Add "Glossy", "Matte", "Recycled", "Premium"
6. Required: Yes

**Result:**
- Dropdown appears on all print products
- Must select one of 4 options
- Value saved as string (e.g., "Glossy")

---

## 🛠️ API Reference

### GET /api/catalogue-fields
**Query Params:**
- `categoryId` (optional): Filter by category
- `subcategoryId` (optional): Filter by subcategory

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "categoryId": "apparel",
      "subcategoryId": "Hoodie",
      "key": "print_area",
      "label": "Print Area",
      "type": "text",
      "options": [],
      "required": true,
      "placeholder": "Enter print area...",
      "unit": "inches",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "count": 1
}
```

### POST /api/catalogue-fields
**Body:**
```json
{
  "categoryId": "apparel",
  "subcategoryId": "Hoodie",
  "key": "print_area",
  "label": "Print Area",
  "type": "text",
  "required": true,
  "placeholder": "Enter print area...",
  "unit": "inches"
}
```

### PUT /api/catalogue-fields/:id
**Body:** (all fields optional)
```json
{
  "label": "Updated Label",
  "required": false,
  "isActive": false
}
```

### DELETE /api/catalogue-fields/:id
**Response:**
```json
{
  "success": true,
  "message": "Catalogue field template deleted successfully"
}
```

---

## ⚠️ Important Notes

1. **Unique Key Constraint**
   - Field `key` must be unique per category/subcategory combination
   - Example: Can have `print_area` in "apparel" and "print", but not duplicate in "apparel"

2. **Immutable Fields**
   - `categoryId`, `subcategoryId`, and `key` cannot be changed after creation
   - Only `label`, `type`, `options`, `required`, `placeholder`, `unit`, `isActive` can be updated

3. **No Cascading Deletes**
   - Deleting a field template doesn't remove data from existing products
   - Products keep their `attributes` values
   - New products won't show the deleted field

4. **Merge Behavior**
   - If static and dynamic fields have same `key`, static field takes precedence
   - Dynamic fields are appended after static fields

5. **Performance**
   - Dynamic fields fetched on each form load (not cached)
   - Consider caching in production if many fields

---

## 🚀 Future Enhancements

- [ ] Field validation rules (regex, min/max length)
- [ ] Conditional fields (show field B if field A = "value")
- [ ] Field reordering/priority
- [ ] Bulk import/export of field templates
- [ ] Field usage analytics (how many products use this field)
- [ ] Version history for field templates
- [ ] Multi-language labels
- [ ] Rich text editor for textarea fields

---

## 📚 Related Documentation

- [Variant Options Guide](./VARIANT_OPTIONS_GUIDE.md)
- [Product Field Definitions](./src/config/productFieldDefinitions.ts)
- [Product Categories](./src/config/productCategories.ts)
- [Product Model Schema](./backend/models/Product.js)

---

**Status:** ✅ **COMPLETE AND READY FOR USE!**

Super admins can now dynamically add custom product attributes via the UI, providing flexibility while maintaining structure! 🎉


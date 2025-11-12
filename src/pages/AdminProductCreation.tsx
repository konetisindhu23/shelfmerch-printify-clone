import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Product } from '@/types';

const AdminProductCreation = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'White']);
  const [mockupImages, setMockupImages] = useState<string[]>([]);
  const [designAreaFront, setDesignAreaFront] = useState('');
  const [designAreaBack, setDesignAreaBack] = useState('');
  const mockupInputRef = useRef<HTMLInputElement>(null);
  const frontDesignRef = useRef<HTMLInputElement>(null);
  const backDesignRef = useRef<HTMLInputElement>(null);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const availableColors = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Blue', 'Green'];
  const categories = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Tank Tops', 'Long Sleeve', 'Accessories'];

  const handleMockupUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

    try {
      const dataUrls = await Promise.all(Array.from(files).map((file) => toDataUrl(file)));
      setMockupImages((prev) => [...prev, ...dataUrls].slice(0, 10));
      toast.success('Mockup images uploaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload images');
    }
  };

  const handleDesignAreaUpload = async (
    file: File | null,
    setter: (url: string) => void
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setter((reader.result as string) || '');
      toast.success('Design area uploaded');
    };
    reader.onerror = () => toast.error('Failed to upload design area');
    reader.readAsDataURL(file);
  };

  const handleRemoveMockup = (index: number) => {
    setMockupImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a product name');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }
    if (!basePrice || parseFloat(basePrice) <= 0) {
      toast.error('Please enter a valid base price');
      return;
    }
    if (selectedSizes.length === 0) {
      toast.error('Please select at least one size');
      return;
    }
    if (selectedColors.length === 0) {
      toast.error('Please select at least one color');
      return;
    }
    if (mockupImages.length === 0) {
      toast.error('Please upload at least one mockup image');
      return;
    }

    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(basePrice),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      mockupUrl: mockupImages[0],
      mockupUrls: mockupImages,
      baseProduct: category.toLowerCase().replace(/\s+/g, '-'),
      designs: {
        front: designAreaFront || undefined,
        back: designAreaBack || undefined,
      },
      variants: {
        sizes: selectedSizes,
        colors: selectedColors,
      },
      userId: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingProducts = JSON.parse(
      localStorage.getItem('shelfmerch_all_products') || '[]'
    ) as Product[];
    existingProducts.push(newProduct);
    localStorage.setItem('shelfmerch_all_products', JSON.stringify(existingProducts));

    toast.success('Product added to catalog');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-fit gap-2 px-0 text-muted-foreground"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add Base Product</h1>
              <p className="text-sm text-muted-foreground">
                Create a new product for the platform catalog
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add Product</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Product name, description, and category details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Premium Cotton T-Shirt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g. ShelfMerch"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the product details, materials, and features..."
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set base and compare-at pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Base Price *</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare-at Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Design Areas (Optional)</CardTitle>
                <CardDescription>
                  Upload design area templates for front and back
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Front Design Area</Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => frontDesignRef.current?.click()}
                  >
                    {designAreaFront ? 'Change Front Design' : 'Upload Front Design'}
                  </Button>
                  <input
                    ref={frontDesignRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleDesignAreaUpload(e.target.files[0], setDesignAreaFront)
                    }
                  />
                  {designAreaFront && (
                    <img
                      src={designAreaFront}
                      alt="Front design area"
                      className="w-full h-32 object-contain rounded border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Back Design Area</Label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => backDesignRef.current?.click()}
                  >
                    {designAreaBack ? 'Change Back Design' : 'Upload Back Design'}
                  </Button>
                  <input
                    ref={backDesignRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files &&
                      handleDesignAreaUpload(e.target.files[0], setDesignAreaBack)
                    }
                  />
                  {designAreaBack && (
                    <img
                      src={designAreaBack}
                      alt="Back design area"
                      className="w-full h-32 object-contain rounded border"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mockup Images *</CardTitle>
                <CardDescription>
                  Upload product mockup images (up to 10)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => mockupInputRef.current?.click()}
                >
                  <Plus className="h-4 w-4" />
                  Upload Mockup Images
                </Button>
                <input
                  ref={mockupInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleMockupUpload(e.target.files)}
                />

                <div className="grid grid-cols-2 gap-4">
                  {mockupImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Mockup ${index + 1}`}
                        className="w-full aspect-square object-cover rounded border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveMockup(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Sizes *</CardTitle>
                <CardDescription>Select available product sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size}
                      className="flex items-center gap-2 px-3 py-2 rounded border cursor-pointer hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                      />
                      <span className="text-sm font-medium">{size}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Colors *</CardTitle>
                <CardDescription>Select available product colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <label
                      key={color}
                      className="flex items-center gap-2 px-3 py-2 rounded border cursor-pointer hover:bg-accent transition-colors"
                    >
                      <Checkbox
                        checked={selectedColors.includes(color)}
                        onCheckedChange={() => toggleColor(color)}
                      />
                      <span className="text-sm font-medium">{color}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProductCreation;

import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { productApi } from '@/lib/api';
import { categories } from '@/data/products';
import { Package } from 'lucide-react';

// Main categories (these are category-level, not subcategories)
const mainCategories = ['apparel', 'accessories', 'home', 'print', 'packaging', 'tech', 'jewelry'];

// Map category slugs to subcategory names (using new category structure)
const categorySlugToSubcategory: Record<string, string> = {
  // Apparel
  't-shirts': 'T-Shirt',
  'tank-tops': 'Tank Top',
  'hoodies': 'Hoodie',
  'sweatshirts': 'Sweatshirt',
  'jackets': 'Jacket',
  'crop-tops': 'Crop Top',
  'aprons': 'Apron',
  'scarves': 'Scarf',
  'jerseys': 'Jersey',
  
  // Accessories
  'bags': 'Tote Bag',
  'caps': 'Cap',
  'phone-covers': 'Phone Cover',
  'gaming-pads': 'Gaming Pad',
  'beanies': 'Beanie',
  
  // Home & Living
  'cans': 'Can',
  'mugs': 'Mug',
  'drinkware': 'Mug',
  'cushions': 'Cushion',
  'frames': 'Frame',
  'coasters': 'Coaster',
  
  // Print Products
  'business-cards': 'Business Card',
  'books': 'Book',
  'id-cards': 'ID Card',
  'stickers': 'Sticker',
  'posters': 'Poster',
  'flyers': 'Flyer',
  'greeting-cards': 'Greeting Card',
  'billboards': 'Billboard',
  'magazines': 'Magazine',
  'brochures': 'Brochure',
  'lanyards': 'Lanyard',
  'banners': 'Banner',
  'canvas': 'Canvas',
  'notebooks': 'Notebook',
  'stationery': 'Notebook',
  
  // Packaging
  'boxes': 'Box',
  'tubes': 'Tube',
  'dropper-bottles': 'Dropper Bottle',
  'pouches': 'Pouch',
  'cosmetics': 'Cosmetic',
  'bottles': 'Bottle',
  
  // Tech
  'iphone-cases': 'IPhone',
  'laptop-skins': 'Lap Top',
  'ipad-cases': 'IPad',
  'macbook-cases': 'Macbook',
  'phone-cases': 'Phone',
  
  // Jewelry
  'rings': 'Ring',
  'necklaces': 'Necklace',
  'earrings': 'Earring',
};

const CategoryProducts = () => {
  const { slug } = useParams();

  // find the current category from static list
  const category = useMemo(
    () => categories.find((cat) => cat.slug === slug),
    [slug]
  );

  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  // Determine if slug is a main category or subcategory
  const isMainCategory = useMemo(() => {
    return mainCategories.includes(slug || '');
  }, [slug]);

  // derive subcategory EXACTLY once from slug + category
  const subcategory = useMemo(() => {
    if (!slug) return null;

    // If it's a main category, return null (we'll use category filter instead)
    if (isMainCategory) return null;

    // Map slug to subcategory name
    const mapped =
      (slug && categorySlugToSubcategory[slug]) ||
      category?.name ||
      slug;

    return mapped;
  }, [slug, category, isMainCategory]);

  useEffect(() => {
    if (!slug) {
      console.log('No slug provided, skipping');
      return;
    }

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setError(null);

      try {
        // If it's a main category, fetch by category
        // If it's a subcategory, fetch by subcategory
        if (isMainCategory) {
          console.log('Fetching products for main category:', slug);
          
          const response = await productApi.getCatalogProducts({
            page: 1,
            limit: 100,
            category: slug, // Use category filter for main categories
          });
          
          console.log('API response for category:', slug, response);
          
          if (response && response.success && Array.isArray(response.data)) {
            setProducts(response.data);
          } else {
            setProducts([]);
          }
        } else if (subcategory) {
        console.log('Fetching products for subcategory:', subcategory);

        const response = await productApi.getCatalogProducts({
          page: 1,
            limit: 100,
            subcategory: subcategory, // Use subcategory filter for subcategories
        });

        console.log('API response for subcategory:', subcategory, response);

        if (response && response.success && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [slug, subcategory, isMainCategory]);

  // Format product data for display
  const formatProduct = (product: any) => {
    // Get brand from attributes (dynamic) or fallback to ShelfMerch
    const brand = product.catalogue?.attributes?.brand || 'ShelfMerch';
    
    return {
      id: product._id || product.id,
      name: product.catalogue?.name || 'Unnamed Product',
      image: product.galleryImages?.find((img: any) => img.isPrimary)?.url || 
             product.galleryImages?.[0]?.url || 
             '/placeholder.png',
      brand: brand,
      price: product.catalogue?.basePrice?.toFixed(2) || '0.00',
      badge: product.catalogue?.tags?.[0] || null,
      sizesCount: product.availableSizes?.length || 0,
      colorsCount: product.availableColors?.length || 0,
    };
  };

  const productsCount = products.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Products
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {category?.name || 'Category'}
          </h1>
          <p className="text-muted-foreground">
            {isLoadingProducts
              ? 'Loading products...'
              : `${productsCount} product${productsCount !== 1 ? 's' : ''} available`}
          </p>
          {error && (
            <p className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>

        {/* Search (UI only for now) */}
        <div className="mb-8 max-w-md">
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full"
          />
        </div>

        {/* Products Grid / Empty / Loading */}
        {isLoadingProducts && productsCount === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-card rounded-lg overflow-hidden border animate-pulse h-full"
              >
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : productsCount > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const formattedProduct = formatProduct(product);
              return (
                <Link
                  key={formattedProduct.id}
                  to={`/products/${formattedProduct.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img
                          src={formattedProduct.image}
                          alt={formattedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {formattedProduct.badge && (
                          <Badge className="absolute top-2 right-2">
                            {formattedProduct.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground mb-1">
                          {formattedProduct.brand}
                        </p>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {formattedProduct.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span>{formattedProduct.sizesCount} sizes</span>
                          <span>•</span>
                          <span>{formattedProduct.colorsCount} colors</span>
                        </div>
                        <p className="text-lg font-bold text-primary mt-auto">
                          From ${formattedProduct.price}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              No products in this subcategory yet
            </p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CategoryProducts;

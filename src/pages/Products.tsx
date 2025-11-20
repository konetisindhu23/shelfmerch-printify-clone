import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { mockProducts, categories } from '@/data/products';
import { productApi } from '@/lib/api';
import { Package } from 'lucide-react';

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

// Main categories only (no subcategories)
const mainCategories = [
  { 
    id: 'apparel', 
    name: 'Apparel', 
    slug: 'apparel',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
  },
  { 
    id: 'accessories', 
    name: 'Accessories', 
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
  },
  { 
    id: 'home', 
    name: 'Home & Living', 
    slug: 'home',
    image: 'https://images.unsplash.com/photo-1585933646520-2f788bc900a9?w=400',
  },
  { 
    id: 'print', 
    name: 'Print Products', 
    slug: 'print',
    image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?w=400',
  },
  { 
    id: 'packaging', 
    name: 'Packaging', 
    slug: 'packaging',
    image: 'https://images.unsplash.com/photo-1607166452427-7e4477079cb9?w=400',
  },
  { 
    id: 'tech', 
    name: 'Tech', 
    slug: 'tech',
    image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400',
  },
  { 
    id: 'jewelry', 
    name: 'Jewelry', 
    slug: 'jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
  },
];

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any>>({});
  const [mainCategoryProducts, setMainCategoryProducts] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productApi.getCatalogProducts({ page: 1, limit: 20 });
        if (response && response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        // Fallback to mock products on error
        setProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch latest product for each main category
  useEffect(() => {
    const fetchMainCategoryProducts = async () => {
      const mainCategoryMap: Record<string, any> = {};
      
      try {
        await Promise.all(
          mainCategories.map(async (category) => {
            try {
              const response = await productApi.getCatalogProducts({
                page: 1,
                limit: 1,
                category: category.id // Fetch by category ID
              });
              
              if (response && response.success && response.data && response.data.length > 0) {
                mainCategoryMap[category.id] = response.data[0];
              }
            } catch (error) {
              console.error(`Failed to fetch products for main category ${category.id}:`, error);
            }
          })
        );
        
        setMainCategoryProducts(mainCategoryMap);
      } catch (error) {
        console.error('Failed to fetch main category products:', error);
      }
    };

    fetchMainCategoryProducts();
  }, []);

  // Fetch latest product for each category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setIsLoadingCategories(true);
      const categoryMap: Record<string, any> = {};
      
      try {
        // Fetch latest product for each category based on subcategory
        await Promise.all(
          categories.map(async (category) => {
            try {
              // Use subcategory mapping
              const subcategory = categorySlugToSubcategory[category.slug] || category.name;
              const response = await productApi.getCatalogProducts({
                page: 1,
                limit: 1,
                subcategory: subcategory
              });
              
              if (response && response.success && response.data && response.data.length > 0) {
                // Get the latest product (first one, sorted by createdAt desc)
                categoryMap[category.slug] = response.data[0];
              }
            } catch (error) {
              console.error(`Failed to fetch products for category ${category.slug}:`, error);
            }
          })
        );
        
        setCategoryProducts(categoryMap);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategoryProducts();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const response = await productApi.getCatalogProducts({ 
        page: 1, 
        limit: 20,
        search: searchQuery 
      });
      if (response && response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="search"
            placeholder="Search for products, brands, categories, and print providers"
            className="w-full px-4 py-3 border rounded-lg bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
        </div>

        {/* Main Categories Section */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="font-heading text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Browse our main product categories</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {mainCategories.map((category) => {
              const latestProduct = mainCategoryProducts[category.id];
              const productImage = latestProduct?.galleryImages?.find((img: any) => img.isPrimary)?.url || 
                                   latestProduct?.galleryImages?.[0]?.url || 
                                   category.image;
              
              return (
                <Link
                  key={category.id}
                  to={`/category-subcategories/${category.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-elevated transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <img 
                          src={productImage} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="font-semibold text-white text-center text-sm drop-shadow-lg">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Explore Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold">Explore ShelfMerch's best</h2>
              <p className="text-muted-foreground mt-2">Here are some of the most popular product categories in our catalog.</p>
            </div>
            <Link to="/category-subcategories/apparel">
              <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Show All →
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => {
              const latestProduct = categoryProducts[category.slug];
              const productImage = latestProduct?.galleryImages?.find((img: any) => img.isPrimary)?.url || 
                                   latestProduct?.galleryImages?.[0]?.url || 
                                   category.image;
              
              return (
                <Link
                  key={category.name}
                  to={`/products/category/${category.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-elevated transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        {isLoadingCategories ? (
                          <Skeleton className="w-full h-full" />
                        ) : (
                          <>
                            <img 
                              src={productImage} 
                              alt={latestProduct ? latestProduct.catalogue?.name || category.name : category.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {latestProduct && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                            {latestProduct && (
                              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="text-white text-xs font-medium line-clamp-1 drop-shadow-lg">
                                  {latestProduct.catalogue?.name || 'Latest Product'}
                                </p>
                                <p className="text-white/90 text-xs drop-shadow-lg">
                                  ${latestProduct.catalogue?.basePrice?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium">{category.name}</h3>
                        {latestProduct && !isLoadingCategories && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Latest: {latestProduct.catalogue?.name || 'New Product'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Hot New Products */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold">Hot new products</h2>
              <p className="text-muted-foreground">Get ahead of the game with our newest offering of products that just hit our catalog.</p>
            </div>
            <Link to="/products/new" className="text-sm font-medium underline hover:text-primary">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-4 flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products available yet</h3>
                <p className="text-sm text-muted-foreground">Check back soon for new products!</p>
              </div>
            ) : (
              products.slice(0, 4).map((product) => {
                const formatted = formatProduct(product);
                return (
                  <Link key={formatted.id} to={`/products/${formatted.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          {formatted.badge && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                              {formatted.badge}
                            </Badge>
                          )}
                          <img 
                            src={formatted.image} 
                            alt={formatted.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-1">{formatted.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{formatted.brand}</p>
                          <p className="font-semibold">From ${formatted.price}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatted.sizesCount} sizes · {formatted.colorsCount} colors
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Starter Essentials */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-heading text-3xl font-bold">Starter essentials</h2>
              <p className="text-muted-foreground">Kickstart your business with these handpicked products that are ideal for new sellers.</p>
            </div>
            <Link to="/products/starters" className="text-sm font-medium underline hover:text-primary">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-4 flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products available yet</h3>
                <p className="text-sm text-muted-foreground">Check back soon for new products!</p>
              </div>
            ) : (
              products.slice(2).map((product) => {
                const formatted = formatProduct(product);
                return (
                  <Link key={formatted.id} to={`/products/${formatted.id}`} className="group">
                    <Card className="overflow-hidden hover:shadow-elevated transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-muted overflow-hidden">
                          {formatted.badge && (
                            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                              {formatted.badge}
                            </Badge>
                          )}
                          <img 
                            src={formatted.image} 
                            alt={formatted.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-1">{formatted.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{formatted.brand}</p>
                          <p className="font-semibold">From ${formatted.price}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatted.sizesCount} sizes · {formatted.colorsCount} colors
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Products;

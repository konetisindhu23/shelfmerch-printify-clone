import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { productApi } from '@/lib/api';
import { Search, ArrowLeft } from 'lucide-react';
import { CATEGORIES, CategoryId, getSubcategories } from '@/config/productCategories';

// Helper to convert subcategory name to slug
const toSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and');
};

const CategorySubcategories = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryProducts, setCategoryProducts] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Get category info
  const category = useMemo(() => {
    if (!categoryId) return null;
    return CATEGORIES[categoryId as CategoryId];
  }, [categoryId]);

  // Get subcategories for this category
  const subcategories = useMemo(() => {
    if (!categoryId) return [];
    const subList = getSubcategories(categoryId as CategoryId);
    return subList.map(name => ({
      name,
      slug: toSlug(name)
    }));
  }, [categoryId]);

  // Fetch latest product for each subcategory
  useEffect(() => {
    if (!categoryId || subcategories.length === 0) return;

    const fetchCategoryProducts = async () => {
      setIsLoading(true);
      const subcategoryMap: Record<string, any> = {};
      
      try {
        await Promise.all(
          subcategories.map(async (subcategory) => {
            try {
              const response = await productApi.getCatalogProducts({
                page: 1,
                limit: 1,
                category: categoryId, // Fetch from specified category
                subcategory: subcategory.name
              });
              
              if (response && response.success && response.data && response.data.length > 0) {
                subcategoryMap[subcategory.slug] = response.data[0];
              }
            } catch (error) {
              console.error(`Failed to fetch products for subcategory ${subcategory.slug}:`, error);
            }
          })
        );
        
        setCategoryProducts(subcategoryMap);
      } catch (error) {
        console.error(`Failed to fetch ${categoryId} products:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId, subcategories]);

  // Filter subcategories based on search query
  const filteredSubcategories = subcategories.filter((subcategory) =>
    subcategory.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If no category found, show error
  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested category does not exist.</p>
            <Link to="/products" className="text-primary hover:underline">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <h1 className="font-heading text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-muted-foreground">
            Browse through all {subcategories.length} {category.name.toLowerCase()} subcategories available in our catalog
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${category.name.toLowerCase()} subcategories...`}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Subcategories Grid */}
        {searchQuery && filteredSubcategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No subcategories found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredSubcategories.map((subcategory) => {
              const latestProduct = categoryProducts[subcategory.slug];
              const productImage = latestProduct?.galleryImages?.find((img: any) => img.isPrimary)?.url || 
                                   latestProduct?.galleryImages?.[0]?.url || 
                                   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
              
              return (
                <Link
                  key={subcategory.name}
                  to={`/products/category/${subcategory.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-elevated transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        {isLoading ? (
                          <Skeleton className="w-full h-full" />
                        ) : (
                          <>
                            <img 
                              src={productImage} 
                              alt={latestProduct ? latestProduct.catalogue?.name || subcategory.name : subcategory.name}
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
                        <h3 className="font-medium text-sm">{subcategory.name}</h3>
                        {latestProduct && !isLoading && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {latestProduct.catalogue?.name || 'New Product'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {/* Subcategory Count */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredSubcategories.length} of {subcategories.length} {category.name.toLowerCase()} subcategories
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CategorySubcategories;


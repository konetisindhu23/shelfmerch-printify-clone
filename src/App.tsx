import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ---------- CONTEXT PROVIDERS ---------- */
import { AuthProvider } from "./contexts/AuthContext";
import { StoreAuthProvider } from "./contexts/StoreAuthContext";
import { StoreProvider } from "./contexts/StoreContext";
import { DataProvider } from "./contexts/DataContext";

/* ---------- ROUTE GUARDS ---------- */
import { ProtectedRoute } from "./components/ProtectedRoute";

/* ---------- MARKETING / PUBLIC ---------- */
import Index from "./pages/Index";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

/* ---------- SOLUTIONS ---------- */
import CreatorsAgenciesPage from "./pages/solutions/CreatorsAgenciesPage";
import FashionApparelPage from "./pages/solutions/FashionApparelPage";
import EntertainmentMediaPage from "./pages/solutions/EntertainmentMediaPage";
import HomeDecorPage from "./pages/solutions/HomeDecorPage";
import CustomizedMerchPage from "./pages/solutions/CustomizedMerchPage";
import EnterpriseMerchPage from "./pages/solutions/EnterpriseMerchPage";
import BulkOrdersPage from "./pages/solutions/BulkOrdersPage";

/* ---------- ABOUT ---------- */
import OurStoryPage from "./pages/about/OurStoryPage";
import CareersPage from "./pages/about/CareersPage";

/* ---------- SUPPORT ---------- */
import HelpCenterPage from "./pages/support/HelpCenterPage";
import PoliciesPage from "./pages/support/PoliciesPage";
import CurrentProductionShippingTimesPage from "./pages/support/CurrentProductionShippingTimesPage";
import CustomerSupportPolicyPage from "./pages/support/CustomerSupportPolicyPage";
import ContentGuidelinesPage from "./pages/support/ContentGuidelinesPage";
import ContactUsPage from "./pages/support/ContactUsPage";

/* ---------- CORE APP ---------- */
import Products from "./pages/Products";
import AllCategories from "./pages/AllCategories";
import CategoryProducts from "./pages/CategoryProducts";
import CategorySubcategories from "./pages/Apparel";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";

/* ---------- DASHBOARD ---------- */
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Stores from "./pages/Stores";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Customers from "./pages/Customers";

/* ---------- CREATION ---------- */
import DesignerEditor from "./pages/DesignEditor";
import ListingEditor from "./pages/ListingEditor";
import ProductCreation from "./pages/ProductCreation";
import MockupsLibrary from "./pages/MockupsLibrary";

/* ---------- STORES ---------- */
import CreateStore from "./pages/CreateStore";
import PopupStores from "./pages/PopupStores";

/* ---------- WALLET ---------- */
import WalletTopUp from "./pages/WalletTopUp";
import WalletTransactions from "./pages/WalletTransactions";
import MerchantWallet from "./pages/MerchantWallet";

/* ---------- ADMIN ---------- */
import Admin from "@/pages/Admin";
import AdminOrderDetail from "@/pages/AdminOrderDetail";
import AdminProductCreation from "./pages/AdminProductCreation";
import AdminProductDetail from "./pages/AdminProductDetail";
import ManageVariantOptions from "./pages/ManageVariantOptions";
import ManageCatalogueFields from "./pages/ManageCatalogueFields";
import AdminAssets from "./pages/AdminAssets";
import AdminInvoices from "./pages/AdminInvoices";
import AdminWithdrawals from "./pages/AdminWithdrawals";

/* ---------- STOREFRONT ---------- */
import StoreFrontendNew from "./pages/StoreFrontendNew";
import StoreProductsPage from "./pages/StoreProductsPage";
import StoreProductPage from "./pages/StoreProductPage";
import StoreCheckoutPage from "./pages/StoreCheckoutPage";
import StoreCustomerAccountPage from "./pages/StoreCustomerAccountPage";
import StoreAuthPage from "./pages/StoreAuthPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import BuilderDemo from "./pages/BuilderDemo";
import MerchantInvoices from "./pages/MerchantInvoices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <DataProvider>

              <Routes>
                {/* PUBLIC */}
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<PricingPage />} />

                {/* SOLUTIONS */}
                <Route path="/solutions/creators-agencies" element={<CreatorsAgenciesPage />} />
                <Route path="/solutions/fashion-apparel" element={<FashionApparelPage />} />
                <Route path="/solutions/entertainment-media" element={<EntertainmentMediaPage />} />
                <Route path="/solutions/home-decor" element={<HomeDecorPage />} />
                <Route path="/solutions/customized-merch" element={<CustomizedMerchPage />} />
                <Route path="/solutions/enterprise-merch" element={<EnterpriseMerchPage />} />
                <Route path="/solutions/bulk-orders" element={<BulkOrdersPage />} />

                {/* ABOUT */}
                <Route path="/about/our-story" element={<OurStoryPage />} />
                <Route path="/about/careers" element={<CareersPage />} />

                {/* SUPPORT */}
                <Route path="/support/help-center" element={<HelpCenterPage />} />
                <Route path="/support/policies" element={<PoliciesPage />} />
                <Route path="/support/production-shipping-times" element={<CurrentProductionShippingTimesPage />} />
                <Route path="/support/customer-support-policy" element={<CustomerSupportPolicyPage />} />
                <Route path="/support/content-guidelines" element={<ContentGuidelinesPage />} />
                <Route path="/support/contact-us" element={<ContactUsPage />} />

                {/* SHOP */}
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<AllCategories />} />
                <Route path="/category-subcategories/:categoryId" element={<CategorySubcategories />} />
                <Route path="/products/category/:slug" element={<CategoryProducts />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/auth" element={<Auth />} />

                {/* PROTECTED */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/stores" element={<ProtectedRoute><Stores /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                {/* WALLET */}
                <Route path="/wallet" element={<ProtectedRoute><MerchantWallet /></ProtectedRoute>} />
                <Route path="/wallet/top-up" element={<ProtectedRoute><WalletTopUp /></ProtectedRoute>} />
                <Route path="/wallet/transactions" element={<ProtectedRoute><WalletTransactions /></ProtectedRoute>} />

                {/* ADMIN */}
                <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />

                {/* STOREFRONT */}
                <Route path="/store/:subdomain" element={<StoreAuthProvider><StoreFrontendNew /></StoreAuthProvider>} />
                <Route path="/store/:subdomain/products" element={<StoreAuthProvider><StoreProductsPage /></StoreAuthProvider>} />
                <Route path="/store/:subdomain/product/:productId" element={<StoreAuthProvider><StoreProductPage /></StoreAuthProvider>} />
                <Route path="/store/:subdomain/checkout" element={<StoreAuthProvider><StoreCheckoutPage /></StoreAuthProvider>} />
                <Route path="/store/:subdomain/account" element={<StoreAuthProvider><StoreCustomerAccountPage /></StoreAuthProvider>} />
                <Route path="/store/:subdomain/auth" element={<StoreAuthProvider><StoreAuthPage /></StoreAuthProvider>} />

                <Route path="/order-confirmation" element={<OrderConfirmation />} />

                {/* FALLBACK */}
                <Route path="*" element={<NotFound />} />
              </Routes>

            </DataProvider>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import ContactPage from "./pages/ContactPage";
import CustomizePage from "./pages/CustomizePage";
import DesignToolsPage from "./pages/DesignToolsPage";
import DesignCanvasPage from "./pages/DesignCanvasPage";
import DesignHomePage from "./pages/DesignHomePage";
import TShirtDesignerDemo from "./pages/TShirtDesignerDemo";
import ProductsPage from "./pages/ProductsPage";
import SizeChartPage from "./pages/SizeChartPage";
import AdminPage from "./pages/AdminPage"; // Changed from AdminDashboard to AdminPage
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimeMascot from "./components/AnimeMascot";
import { AuthProvider } from "./contexts/AuthContext";
import { PurchaseProvider } from "./contexts/PurchaseContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import UserOrders from "./pages/UserOrders";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import TestPage from "./pages/TestPage";
import AuthCallbackPage from './pages/AuthCallbackPage';
import AccountPage from './pages/AccountPage';
import { initScrollOptimizations, fixMobileScrolling } from "./lib/scroll-optimize";

window.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll("img:not([loading])");
  imgs.forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });
  
  // Initialize scroll optimizations
  initScrollOptimizations();
  fixMobileScrolling();
});

function Router() {
  const [location] = useLocation();
  const isCustomizePage = location === "/customize";
  const isDesignPage = location === "/design" || location === "/design-tools" || location === "/design-canvas";
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={ProductsPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/wishlist" component={WishlistPage} />
          <Route path="/test" component={TestPage} />
          <Route path="/user-orders" component={UserOrders} />
          <Route path="/account" component={AccountPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/customize" component={CustomizePage} />
          <Route path="/design" component={DesignHomePage} />
          <Route path="/design-tools" component={DesignToolsPage} />
          <Route path="/design-canvas" component={DesignCanvasPage} />
          <Route path="/tshirt-designer" component={TShirtDesignerDemo} />
          <Route path="/admin" component={AdminPage} /> {/* Changed to AdminPage */}
          <Route path="/auth/callback" component={AuthCallbackPage} />
          <Route path="/size-chart" component={SizeChartPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {!isCustomizePage && !isDesignPage && <Footer />}
      {!isCustomizePage && !isDesignPage && <AnimeMascot defaultMascot="neko" position="bottom-right" autoGreet={true} />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <PurchaseProvider>
            <CartProvider>
              <WishlistProvider>
                <Router />
              </WishlistProvider>
            </CartProvider>
          </PurchaseProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
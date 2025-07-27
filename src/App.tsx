import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ListingDetail } from "./pages/ListingDetail";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { CreateListing } from "./pages/CreateListing";
import { EditProfile } from "./pages/EditProfile";
import { Category } from "./pages/Category";
import { Search } from "./pages/Search";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/category/:categoryId" element={<Category />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

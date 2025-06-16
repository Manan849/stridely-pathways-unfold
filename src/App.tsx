
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Plan from "./pages/Plan";
import Progress from "./pages/Progress";
import Account from "./pages/Account";
import RoadmapHub from "./pages/RoadmapHub";
import { UserProvider, useUser } from "@/hooks/useUser";
import { PlanProvider } from "@/context/PlanContext";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useUser();

  return (
    <BrowserRouter>
      <Header />
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Index />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <PlanProvider>
          <AppContent />
        </PlanProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

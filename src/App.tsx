import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PlotsProvider } from "./contexts/PlotsContext";
import { ActivitiesProvider } from "./contexts/ActivitiesContext";
import { ResourcesProvider } from "./contexts/ResourcesContext";
import { WorkersProvider } from "./contexts/WorkersContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PlotsPage from "./pages/PlotsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ResourcesPage from "./pages/ResourcesPage";
import WorkersPage from "./pages/WorkersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <PlotsProvider>
            <ActivitiesProvider>
              <ResourcesProvider>
                <WorkersProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/parcelas" element={<PlotsPage />} />
                    <Route path="/actividades" element={<ActivitiesPage />} />
                    <Route path="/recursos" element={<ResourcesPage />} />
                    <Route path="/trabajadores" element={<WorkersPage />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </WorkersProvider>
              </ResourcesProvider>
            </ActivitiesProvider>
          </PlotsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

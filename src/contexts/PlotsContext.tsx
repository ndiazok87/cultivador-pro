import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type CropType = 'maiz' | 'trigo' | 'soja' | 'girasol' | 'otro';
type PlotStatus = 'sembrado' | 'cosechado' | 'en preparacion';

export interface Plot {
  id: string;
  nombre: string;
  superficie: number;
  tipo_cultivo: CropType;
  estado: PlotStatus;
  created_at: string;
  updated_at: string;
}

interface PlotsContextType {
  plots: Plot[];
  loading: boolean;
  fetchPlots: () => Promise<void>;
  createPlot: (plot: Omit<Plot, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updatePlot: (id: string, plot: Partial<Plot>) => Promise<void>;
  deletePlot: (id: string) => Promise<void>;
}

const PlotsContext = createContext<PlotsContextType | undefined>(undefined);

export function PlotsProvider({ children }: { children: ReactNode }) {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlots(data || []);
    } catch (error: any) {
      toast.error('Error al cargar parcelas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createPlot = async (plot: Omit<Plot, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('plots')
        .insert([plot]);

      if (error) throw error;
      toast.success('Parcela creada exitosamente');
      await fetchPlots();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear parcela');
      throw error;
    }
  };

  const updatePlot = async (id: string, plot: Partial<Plot>) => {
    try {
      const { error } = await supabase
        .from('plots')
        .update(plot)
        .eq('id', id);

      if (error) throw error;
      toast.success('Parcela actualizada');
      await fetchPlots();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar parcela');
      throw error;
    }
  };

  const deletePlot = async (id: string) => {
    try {
      const { error } = await supabase
        .from('plots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Parcela eliminada');
      await fetchPlots();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar parcela');
      throw error;
    }
  };

  return (
    <PlotsContext.Provider value={{ plots, loading, fetchPlots, createPlot, updatePlot, deletePlot }}>
      {children}
    </PlotsContext.Provider>
  );
}

export function usePlots() {
  const context = useContext(PlotsContext);
  if (context === undefined) {
    throw new Error('usePlots must be used within a PlotsProvider');
  }
  return context;
}

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ActivityType = 'siembra' | 'cosecha' | 'fertilizacion' | 'riego' | 'fumigacion';
type ActivityStatus = 'pendiente' | 'en progreso' | 'completada';

export interface Activity {
  id: string;
  nombre: string;
  tipo: ActivityType;
  id_parcela: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: ActivityStatus;
  descripcion?: string;
  created_at: string;
  updated_at: string;
  plots?: {
    nombre: string;
  };
}

interface ActivitiesContextType {
  activities: Activity[];
  loading: boolean;
  fetchActivities: () => Promise<void>;
  createActivity: (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'plots'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

export function ActivitiesProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('activities')
        .select('*, plots(nombre)')
        .order('fecha_inicio', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      toast.error('Error al cargar actividades');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at' | 'plots'>) => {
    try {
      const { error } = await supabase
        .from('activities')
        .insert([activity]);

      if (error) throw error;
      toast.success('Actividad creada exitosamente');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear actividad');
      throw error;
    }
  };

  const updateActivity = async (id: string, activity: Partial<Activity>) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', id);

      if (error) throw error;
      toast.success('Actividad actualizada');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar actividad');
      throw error;
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Actividad eliminada');
      await fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar actividad');
      throw error;
    }
  };

  return (
    <ActivitiesContext.Provider value={{ activities, loading, fetchActivities, createActivity, updateActivity, deleteActivity }}>
      {children}
    </ActivitiesContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
}

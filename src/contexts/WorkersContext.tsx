import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Worker {
  id: string;
  especialidad: string;
  id_usuario: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    nombre: string;
    correo: string;
    rol: string;
  };
}

interface WorkersContextType {
  workers: Worker[];
  loading: boolean;
  fetchWorkers: () => Promise<void>;
  createWorker: (worker: Omit<Worker, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => Promise<void>;
  updateWorker: (id: string, worker: Partial<Worker>) => Promise<void>;
  deleteWorker: (id: string) => Promise<void>;
}

const WorkersContext = createContext<WorkersContextType | undefined>(undefined);

export function WorkersProvider({ children }: { children: ReactNode }) {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workers')
        .select('*, profiles(nombre, correo, rol)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkers(data || []);
    } catch (error: any) {
      toast.error('Error al cargar trabajadores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createWorker = async (worker: Omit<Worker, 'id' | 'created_at' | 'updated_at' | 'profiles'>) => {
    try {
      const { error } = await supabase
        .from('workers')
        .insert([worker]);

      if (error) throw error;
      toast.success('Trabajador creado exitosamente');
      await fetchWorkers();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear trabajador');
      throw error;
    }
  };

  const updateWorker = async (id: string, worker: Partial<Worker>) => {
    try {
      const { error } = await supabase
        .from('workers')
        .update(worker)
        .eq('id', id);

      if (error) throw error;
      toast.success('Trabajador actualizado');
      await fetchWorkers();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar trabajador');
      throw error;
    }
  };

  const deleteWorker = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Trabajador eliminado');
      await fetchWorkers();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar trabajador');
      throw error;
    }
  };

  return (
    <WorkersContext.Provider value={{ workers, loading, fetchWorkers, createWorker, updateWorker, deleteWorker }}>
      {children}
    </WorkersContext.Provider>
  );
}

export function useWorkers() {
  const context = useContext(WorkersContext);
  if (context === undefined) {
    throw new Error('useWorkers must be used within a WorkersProvider');
  }
  return context;
}

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ResourceType = 'maquinaria' | 'fertilizantes' | 'semillas' | 'herramientas';

export interface Resource {
  id: string;
  tipo: ResourceType;
  nombre: string;
  cantidad: number;
  id_parcela?: string;
  disponible: boolean;
  created_at: string;
  updated_at: string;
  plots?: {
    nombre: string;
  };
}

interface ResourcesContextType {
  resources: Resource[];
  loading: boolean;
  fetchResources: () => Promise<void>;
  createResource: (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'plots'>) => Promise<void>;
  updateResource: (id: string, resource: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

const ResourcesContext = createContext<ResourcesContextType | undefined>(undefined);

export function ResourcesProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*, plots(nombre)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error: any) {
      toast.error('Error al cargar recursos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createResource = async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at' | 'plots'>) => {
    try {
      const { error } = await supabase
        .from('resources')
        .insert([resource]);

      if (error) throw error;
      toast.success('Recurso creado exitosamente');
      await fetchResources();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear recurso');
      throw error;
    }
  };

  const updateResource = async (id: string, resource: Partial<Resource>) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update(resource)
        .eq('id', id);

      if (error) throw error;
      toast.success('Recurso actualizado');
      await fetchResources();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar recurso');
      throw error;
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Recurso eliminado');
      await fetchResources();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar recurso');
      throw error;
    }
  };

  return (
    <ResourcesContext.Provider value={{ resources, loading, fetchResources, createResource, updateResource, deleteResource }}>
      {children}
    </ResourcesContext.Provider>
  );
}

export function useResources() {
  const context = useContext(ResourcesContext);
  if (context === undefined) {
    throw new Error('useResources must be used within a ResourcesProvider');
  }
  return context;
}

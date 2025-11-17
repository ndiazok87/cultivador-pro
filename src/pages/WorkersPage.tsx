import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkers } from '@/contexts/WorkersContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function WorkersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { workers, loading, createWorker, updateWorker, deleteWorker } = useWorkers();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<any>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    especialidad: '',
    id_usuario: '',
    activo: true
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
    if (profile?.rol === 'admin') {
      fetchAvailableUsers();
    }
  }, [user, authLoading, navigate, profile]);

  const fetchAvailableUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nombre, correo')
        .eq('rol', 'trabajador');
      
      if (error) throw error;
      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const canManage = profile?.rol === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorker) {
        await updateWorker(editingWorker.id, formData as any);
      } else {
        await createWorker(formData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      especialidad: '',
      id_usuario: '',
      activo: true
    });
    setEditingWorker(null);
  };

  const handleEdit = (worker: any) => {
    setEditingWorker(worker);
    setFormData({
      especialidad: worker.especialidad,
      id_usuario: worker.id_usuario,
      activo: worker.activo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este trabajador?')) {
      await deleteWorker(id);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">No tienes permisos para acceder a esta página</p>
          <Button onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AgroPrecision - Trabajadores</h1>
          <Button variant="ghost" onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Trabajadores</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Trabajador
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="id_usuario">Usuario</Label>
                  <select
                    id="id_usuario"
                    value={formData.id_usuario}
                    onChange={(e) => setFormData({ ...formData, id_usuario: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                    disabled={!!editingWorker}
                  >
                    <option value="">Seleccionar usuario</option>
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nombre} ({u.correo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Input
                    id="especialidad"
                    value={formData.especialidad}
                    onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                    placeholder="ej: Maquinista, Agricultor"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo">Activo</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingWorker ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <Card key={worker.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {worker.profiles?.nombre}
                  </div>
                  <Badge variant={worker.activo ? 'default' : 'secondary'}>
                    {worker.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Especialidad:</strong> {worker.especialidad}</p>
                  <p><strong>Email:</strong> {worker.profiles?.correo}</p>
                  <p><strong>Rol:</strong> {worker.profiles?.rol}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(worker)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(worker.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {workers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay trabajadores registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}

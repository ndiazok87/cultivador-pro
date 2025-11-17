import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useActivities } from '@/contexts/ActivitiesContext';
import { usePlots } from '@/contexts/PlotsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ActivitiesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { activities, loading, createActivity, updateActivity, deleteActivity } = useActivities();
  const { plots } = usePlots();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'siembra',
    id_parcela: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'pendiente',
    descripcion: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const canManage = profile?.rol === 'admin' || profile?.rol === 'gestor';
  const canUpdate = canManage || profile?.rol === 'trabajador';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        nombre: formData.nombre,
        tipo: formData.tipo as any,
        id_parcela: formData.id_parcela,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin,
        estado: formData.estado as any,
        descripcion: formData.descripcion
      };
      
      if (editingActivity) {
        await updateActivity(editingActivity.id, activityData);
      } else {
        await createActivity(activityData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      tipo: 'siembra',
      id_parcela: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'pendiente',
      descripcion: ''
    });
    setEditingActivity(null);
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setFormData({
      nombre: activity.nombre,
      tipo: activity.tipo,
      id_parcela: activity.id_parcela,
      fecha_inicio: activity.fecha_inicio,
      fecha_fin: activity.fecha_fin,
      estado: activity.estado,
      descripcion: activity.descripcion || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta actividad?')) {
      await deleteActivity(id);
    }
  };

  const handleStatusChange = async (id: string, estado: string) => {
    await updateActivity(id, { estado } as any);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AgroPrecision - Actividades</h1>
          <Button variant="ghost" onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Actividades</h2>
          {canManage && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Actividad
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select
                        value={formData.tipo}
                        onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="siembra">Siembra</SelectItem>
                          <SelectItem value="cosecha">Cosecha</SelectItem>
                          <SelectItem value="fertilizacion">Fertilización</SelectItem>
                          <SelectItem value="riego">Riego</SelectItem>
                          <SelectItem value="fumigacion">Fumigación</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="id_parcela">Parcela</Label>
                      <Select
                        value={formData.id_parcela}
                        onValueChange={(value) => setFormData({ ...formData, id_parcela: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar parcela" />
                        </SelectTrigger>
                        <SelectContent>
                          {plots.map((plot) => (
                            <SelectItem key={plot.id} value={plot.id}>
                              {plot.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                      <Input
                        id="fecha_inicio"
                        type="date"
                        value={formData.fecha_inicio}
                        onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fecha_fin">Fecha Fin</Label>
                      <Input
                        id="fecha_fin"
                        type="date"
                        value={formData.fecha_fin}
                        onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => setFormData({ ...formData, estado: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="en progreso">En Progreso</SelectItem>
                        <SelectItem value="completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingActivity ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {activity.nombre}
                  </div>
                  <Badge variant={
                    activity.estado === 'completada' ? 'default' :
                    activity.estado === 'en progreso' ? 'secondary' : 'outline'
                  }>
                    {activity.estado}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Tipo:</strong> {activity.tipo}</p>
                  <p><strong>Parcela:</strong> {activity.plots?.nombre}</p>
                  <p><strong>Fecha:</strong> {activity.fecha_inicio} al {activity.fecha_fin}</p>
                  {activity.descripcion && <p><strong>Descripción:</strong> {activity.descripcion}</p>}
                  
                  <div className="flex gap-2 mt-4">
                    {canUpdate && (
                      <>
                        <Select
                          value={activity.estado}
                          onValueChange={(value) => handleStatusChange(activity.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendiente">Pendiente</SelectItem>
                            <SelectItem value="en progreso">En Progreso</SelectItem>
                            <SelectItem value="completada">Completada</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                    {canManage && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(activity)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay actividades registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

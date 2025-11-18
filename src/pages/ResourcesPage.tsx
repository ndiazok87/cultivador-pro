import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useResources } from '@/contexts/ResourcesContext';
import { usePlots } from '@/contexts/PlotsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { generateResourcesList } from '@/lib/pdfGenerator';

export default function ResourcesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { resources, loading, createResource, updateResource, deleteResource } = useResources();
  const { plots } = usePlots();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [formData, setFormData] = useState({
    tipo: 'maquinaria',
    nombre: '',
    cantidad: '',
    id_parcela: '',
    disponible: true
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const canManage = profile?.rol === 'admin' || profile?.rol === 'gestor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resourceData = {
        ...formData,
        cantidad: parseInt(formData.cantidad),
        id_parcela: formData.id_parcela || undefined
      };

      if (editingResource) {
        await updateResource(editingResource.id, resourceData as any);
      } else {
        await createResource(resourceData as any);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: 'maquinaria',
      nombre: '',
      cantidad: '',
      id_parcela: '',
      disponible: true
    });
    setEditingResource(null);
  };

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setFormData({
      tipo: resource.tipo,
      nombre: resource.nombre,
      cantidad: resource.cantidad.toString(),
      id_parcela: resource.id_parcela || '',
      disponible: resource.disponible
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este recurso?')) {
      await deleteResource(id);
    }
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
          <h1 className="text-2xl font-bold">AgroPrecision - Recursos</h1>
          <Button variant="ghost" onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Recursos</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => generateResourcesList(resources)}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            {canManage && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Recurso
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <SelectItem value="maquinaria">Maquinaria</SelectItem>
                        <SelectItem value="fertilizantes">Fertilizantes</SelectItem>
                        <SelectItem value="semillas">Semillas</SelectItem>
                        <SelectItem value="herramientas">Herramientas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      min="0"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="id_parcela">Parcela (Opcional)</Label>
                    <Select
                      value={formData.id_parcela}
                      onValueChange={(value) => setFormData({ ...formData, id_parcela: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin asignar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Sin asignar</SelectItem>
                        {plots.map((plot) => (
                          <SelectItem key={plot.id} value={plot.id}>
                            {plot.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="disponible"
                      checked={formData.disponible}
                      onCheckedChange={(checked) => setFormData({ ...formData, disponible: checked })}
                    />
                    <Label htmlFor="disponible">Disponible</Label>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingResource ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {resource.nombre}
                  </div>
                  <Badge variant={resource.disponible ? 'default' : 'secondary'}>
                    {resource.disponible ? 'Disponible' : 'No disponible'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Tipo:</strong> {resource.tipo}</p>
                  <p><strong>Cantidad:</strong> {resource.cantidad}</p>
                  {resource.plots && <p><strong>Parcela:</strong> {resource.plots.nombre}</p>}
                  {canManage && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(resource)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(resource.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {resources.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay recursos registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}

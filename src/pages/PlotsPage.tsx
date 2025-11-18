import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePlots } from '@/contexts/PlotsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generatePlotsList } from '@/lib/pdfGenerator';

export default function PlotsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { plots, loading, createPlot, updatePlot, deletePlot } = usePlots();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    superficie: '',
    tipo_cultivo: 'maiz',
    estado: 'en preparacion'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const canEdit = profile?.rol === 'admin' || profile?.rol === 'gestor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlot) {
        await updatePlot(editingPlot.id, {
          nombre: formData.nombre,
          superficie: parseFloat(formData.superficie),
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any
        });
      } else {
        await createPlot({
          nombre: formData.nombre,
          superficie: parseFloat(formData.superficie),
          tipo_cultivo: formData.tipo_cultivo as any,
          estado: formData.estado as any
        });
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
      superficie: '',
      tipo_cultivo: 'maiz',
      estado: 'en preparacion'
    });
    setEditingPlot(null);
  };

  const handleEdit = (plot: any) => {
    setEditingPlot(plot);
    setFormData({
      nombre: plot.nombre,
      superficie: plot.superficie.toString(),
      tipo_cultivo: plot.tipo_cultivo,
      estado: plot.estado
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta parcela?')) {
      await deletePlot(id);
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
          <h1 className="text-2xl font-bold">AgroPrecision - Parcelas</h1>
          <Button variant="ghost" onClick={() => navigate('/')}>Volver al Dashboard</Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Gestión de Parcelas</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => generatePlotsList(plots)}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
            {canEdit && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Parcela
                  </Button>
                </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingPlot ? 'Editar Parcela' : 'Nueva Parcela'}</DialogTitle>
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
                  <div>
                    <Label htmlFor="superficie">Superficie (ha)</Label>
                    <Input
                      id="superficie"
                      type="number"
                      step="0.01"
                      value={formData.superficie}
                      onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo_cultivo">Tipo de Cultivo</Label>
                    <Select
                      value={formData.tipo_cultivo}
                      onValueChange={(value) => setFormData({ ...formData, tipo_cultivo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maiz">Maíz</SelectItem>
                        <SelectItem value="trigo">Trigo</SelectItem>
                        <SelectItem value="soja">Soja</SelectItem>
                        <SelectItem value="girasol">Girasol</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="en preparacion">En Preparación</SelectItem>
                        <SelectItem value="sembrado">Sembrado</SelectItem>
                        <SelectItem value="cosechado">Cosechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingPlot ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot) => (
            <Card key={plot.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {plot.nombre}
                  </div>
                  <Badge variant={plot.estado === 'sembrado' ? 'default' : 'secondary'}>
                    {plot.estado}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Superficie:</strong> {plot.superficie} ha</p>
                  <p><strong>Cultivo:</strong> {plot.tipo_cultivo}</p>
                  {canEdit && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(plot)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(plot.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {plots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay parcelas registradas</p>
          </div>
        )}
      </div>
    </div>
  );
}

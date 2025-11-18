import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Plot {
  id: string;
  nombre: string;
  superficie: number;
  tipo_cultivo: string;
  estado: string;
  created_at: string;
}

interface Activity {
  id: string;
  nombre: string;
  tipo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  descripcion?: string;
  plots?: { nombre: string };
}

interface Resource {
  id: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  disponible: boolean;
  plots?: { nombre: string };
}

interface Worker {
  id: string;
  especialidad: string;
  activo: boolean;
  profiles?: {
    nombre: string;
    correo: string;
  };
}

// Generar orden de trabajo por parcela/actividad
export const generateWorkOrder = (activity: Activity, resources: Resource[], workers: Worker[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('ORDEN DE TRABAJO', 105, 20, { align: 'center' });
  
  // Información de la actividad
  doc.setFontSize(12);
  doc.text(`Actividad: ${activity.nombre}`, 20, 40);
  doc.text(`Tipo: ${activity.tipo}`, 20, 50);
  if (activity.plots?.nombre) {
    doc.text(`Parcela: ${activity.plots.nombre}`, 20, 60);
  }
  doc.text(`Fecha Inicio: ${new Date(activity.fecha_inicio).toLocaleDateString()}`, 20, 70);
  doc.text(`Fecha Fin: ${new Date(activity.fecha_fin).toLocaleDateString()}`, 20, 80);
  doc.text(`Estado: ${activity.estado}`, 20, 90);
  
  if (activity.descripcion) {
    doc.text(`Descripción: ${activity.descripcion}`, 20, 100);
  }
  
  // Tabla de recursos asignados
  if (resources.length > 0) {
    doc.setFontSize(14);
    doc.text('Recursos Asignados:', 20, 120);
    
    const resourcesData = resources.map(r => [
      r.nombre,
      r.tipo,
      r.cantidad.toString(),
      r.disponible ? 'Disponible' : 'No disponible',
      r.plots?.nombre || 'Sin asignar'
    ]);
    
    autoTable(doc, {
      startY: 125,
      head: [['Nombre', 'Tipo', 'Cantidad', 'Estado', 'Parcela']],
      body: resourcesData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });
  }
  
  // Tabla de trabajadores asignados
  if (workers.length > 0) {
    const finalY = (doc as any).lastAutoTable?.finalY || 130;
    doc.setFontSize(14);
    doc.text('Trabajadores Asignados:', 20, finalY + 15);
    
    const workersData = workers.map(w => [
      w.profiles?.nombre || 'N/A',
      w.especialidad,
      w.profiles?.correo || 'N/A',
      w.activo ? 'Activo' : 'Inactivo'
    ]);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Nombre', 'Especialidad', 'Correo', 'Estado']],
      body: workersData,
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] },
    });
  }
  
  // Pie de página
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.text(
    `AgroPrecision - Generado el ${new Date().toLocaleString()}`,
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  // Descargar PDF
  doc.save(`orden_trabajo_${activity.nombre.replace(/\s+/g, '_')}.pdf`);
};

// Generar listado de recursos
export const generateResourcesList = (resources: Resource[], plotName?: string) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('LISTADO DE RECURSOS', 105, 20, { align: 'center' });
  
  if (plotName) {
    doc.setFontSize(12);
    doc.text(`Parcela: ${plotName}`, 105, 30, { align: 'center' });
  }
  
  // Tabla de recursos
  const resourcesData = resources.map(r => [
    r.nombre,
    r.tipo,
    r.cantidad.toString(),
    r.disponible ? 'Disponible' : 'No disponible',
    r.plots?.nombre || 'Sin asignar'
  ]);
  
  autoTable(doc, {
    startY: 40,
    head: [['Nombre', 'Tipo', 'Cantidad', 'Estado', 'Parcela']],
    body: resourcesData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  // Resumen
  const finalY = (doc as any).lastAutoTable?.finalY || 45;
  doc.setFontSize(12);
  doc.text(`Total de recursos: ${resources.length}`, 20, finalY + 15);
  const disponibles = resources.filter(r => r.disponible).length;
  doc.text(`Disponibles: ${disponibles}`, 20, finalY + 25);
  doc.text(`No disponibles: ${resources.length - disponibles}`, 20, finalY + 35);
  
  // Pie de página
  doc.setFontSize(10);
  doc.text(
    `AgroPrecision - Generado el ${new Date().toLocaleString()}`,
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  // Descargar PDF
  const filename = plotName 
    ? `recursos_${plotName.replace(/\s+/g, '_')}.pdf`
    : 'recursos.pdf';
  doc.save(filename);
};

// Generar listado de parcelas
export const generatePlotsList = (plots: Plot[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('LISTADO DE PARCELAS', 105, 20, { align: 'center' });
  
  // Tabla de parcelas
  const plotsData = plots.map(p => [
    p.nombre,
    `${p.superficie} ha`,
    p.tipo_cultivo,
    p.estado,
    new Date(p.created_at).toLocaleDateString()
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Nombre', 'Superficie', 'Tipo Cultivo', 'Estado', 'Fecha Creación']],
    body: plotsData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  // Resumen
  const finalY = (doc as any).lastAutoTable?.finalY || 35;
  doc.setFontSize(12);
  doc.text(`Total de parcelas: ${plots.length}`, 20, finalY + 15);
  const totalSuperficie = plots.reduce((sum, p) => sum + Number(p.superficie), 0);
  doc.text(`Superficie total: ${totalSuperficie.toFixed(2)} ha`, 20, finalY + 25);
  
  // Pie de página
  doc.setFontSize(10);
  doc.text(
    `AgroPrecision - Generado el ${new Date().toLocaleString()}`,
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  // Descargar PDF
  doc.save('parcelas.pdf');
};

// Generar listado de actividades
export const generateActivitiesList = (activities: Activity[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('LISTADO DE ACTIVIDADES', 105, 20, { align: 'center' });
  
  // Tabla de actividades
  const activitiesData = activities.map(a => [
    a.nombre,
    a.tipo,
    a.plots?.nombre || 'N/A',
    new Date(a.fecha_inicio).toLocaleDateString(),
    new Date(a.fecha_fin).toLocaleDateString(),
    a.estado
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Actividad', 'Tipo', 'Parcela', 'Inicio', 'Fin', 'Estado']],
    body: activitiesData,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] },
  });
  
  // Resumen
  const finalY = (doc as any).lastAutoTable?.finalY || 35;
  doc.setFontSize(12);
  doc.text(`Total de actividades: ${activities.length}`, 20, finalY + 15);
  const pendientes = activities.filter(a => a.estado === 'pendiente').length;
  const enProgreso = activities.filter(a => a.estado === 'en progreso').length;
  const completadas = activities.filter(a => a.estado === 'completada').length;
  doc.text(`Pendientes: ${pendientes} | En progreso: ${enProgreso} | Completadas: ${completadas}`, 20, finalY + 25);
  
  // Pie de página
  doc.setFontSize(10);
  doc.text(
    `AgroPrecision - Generado el ${new Date().toLocaleString()}`,
    105,
    doc.internal.pageSize.height - 10,
    { align: 'center' }
  );
  
  // Descargar PDF
  doc.save('actividades.pdf');
};

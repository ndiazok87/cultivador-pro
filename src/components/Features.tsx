import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, BarChart3, Plane, Radio, Users, UserCog } from "lucide-react";

const features = [
  {
    icon: Satellite,
    title: "Monitoreo Satelital",
    description: "Imágenes satelitales de alta resolución para análisis detallado de cultivos y detección temprana de problemas.",
  },
  {
    icon: Plane,
    title: "Drones Agrícolas",
    description: "Tecnología de drones para mapeo aéreo, fumigación de precisión y monitoreo visual de cultivos.",
  },
  {
    icon: Radio,
    title: "Sensores IoT",
    description: "Red de sensores a campo para medición en tiempo real de humedad, temperatura y nutrientes del suelo.",
  },
  {
    icon: BarChart3,
    title: "Análisis Predictivo",
    description: "Algoritmos de IA que predicen rendimientos, detectan enfermedades y optimizan el uso de recursos.",
  },
  {
    icon: Users,
    title: "Gestión de Equipos",
    description: "Administra tu equipo de trabajo, asigna tareas y monitorea la actividad de empleados en el campo.",
  },
  {
    icon: UserCog,
    title: "Control de Roles",
    description: "Sistema de permisos para operadores, supervisores y administradores con acceso personalizado.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Tecnología de Vanguardia
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Herramientas profesionales para maximizar tu productividad agrícola
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg group"
              >
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

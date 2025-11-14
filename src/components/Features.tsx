import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, BarChart3, Bell, Smartphone, Database, Cloud } from "lucide-react";

const features = [
  {
    icon: Satellite,
    title: "Monitoreo Satelital",
    description: "Imágenes satelitales de alta resolución para análisis detallado de cultivos y detección temprana de problemas.",
  },
  {
    icon: BarChart3,
    title: "Análisis Predictivo",
    description: "Algoritmos de IA que predicen rendimientos, detectan enfermedades y optimizan el uso de recursos.",
  },
  {
    icon: Bell,
    title: "Alertas Inteligentes",
    description: "Notificaciones en tiempo real sobre condiciones climáticas, plagas y necesidades de riego.",
  },
  {
    icon: Smartphone,
    title: "App Móvil",
    description: "Accede a todos tus datos desde el campo con nuestra aplicación móvil intuitiva.",
  },
  {
    icon: Database,
    title: "Gestión de Datos",
    description: "Almacenamiento seguro y análisis histórico de todos los datos de tus campos.",
  },
  {
    icon: Cloud,
    title: "Sincronización Cloud",
    description: "Todos tus datos sincronizados en la nube, accesibles desde cualquier dispositivo.",
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Thermometer, Wind, Sun, TrendingUp, MapPin } from "lucide-react";

export const Dashboard = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Panel de Control en Tiempo Real
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitorea todos tus campos desde un solo lugar
          </p>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Humedad del Suelo
              </CardTitle>
              <Droplets className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">67%</div>
              <p className="text-xs text-muted-foreground mt-2">
                <span className="text-primary">↑ 5%</span> desde ayer
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Temperatura
              </CardTitle>
              <Thermometer className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">24°C</div>
              <p className="text-xs text-muted-foreground mt-2">
                Rango óptimo: 18-28°C
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Velocidad del Viento
              </CardTitle>
              <Wind className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12 km/h</div>
              <p className="text-xs text-muted-foreground mt-2">
                Dirección: Noreste
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Radiación Solar
              </CardTitle>
              <Sun className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">850 W/m²</div>
              <p className="text-xs text-muted-foreground mt-2">
                Condiciones ideales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Field Status Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Campo Norte - Maíz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Etapa de Crecimiento</span>
                  <span className="font-semibold text-foreground">Floración</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Área</span>
                  <span className="font-semibold text-foreground">15.5 hectáreas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rendimiento Estimado</span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    8.2 ton/ha
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">Estado: Excelente (75%)</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Campo Sur - Trigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Etapa de Crecimiento</span>
                  <span className="font-semibold text-foreground">Maduración</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Área</span>
                  <span className="font-semibold text-foreground">22.3 hectáreas</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rendimiento Estimado</span>
                  <span className="font-semibold text-primary flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    6.8 ton/ha
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">Estado: Muy Bueno (88%)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

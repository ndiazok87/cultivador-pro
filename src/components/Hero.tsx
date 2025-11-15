import { Button } from "@/components/ui/button";
import { ArrowRight, Sprout } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20">
            <Sprout className="h-16 w-16 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Agricultura de Precisión
        </h1>
        
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
          Optimiza tu producción agrícola con tecnología de punta. 
          Monitoreo en tiempo real, análisis de datos y decisiones inteligentes.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-background text-primary hover:bg-background/90 group"
            onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ver Panel de Control
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="p-6 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20">
            <div className="text-4xl font-bold text-primary-foreground mb-2">+30%</div>
            <div className="text-primary-foreground/80">Incremento en Rendimiento</div>
          </div>
          <div className="p-6 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20">
            <div className="text-4xl font-bold text-primary-foreground mb-2">-25%</div>
            <div className="text-primary-foreground/80">Reducción de Costos</div>
          </div>
          <div className="p-6 bg-background/10 backdrop-blur-sm rounded-2xl border border-background/20">
            <div className="text-4xl font-bold text-primary-foreground mb-2">24/7</div>
            <div className="text-primary-foreground/80">Monitoreo Continuo</div>
          </div>
        </div>
      </div>
    </section>
  );
};

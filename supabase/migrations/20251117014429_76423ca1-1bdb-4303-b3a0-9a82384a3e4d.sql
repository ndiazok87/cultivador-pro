-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'gestor', 'trabajador');
CREATE TYPE public.plot_status AS ENUM ('sembrado', 'cosechado', 'en preparacion');
CREATE TYPE public.activity_status AS ENUM ('pendiente', 'en progreso', 'completada');
CREATE TYPE public.activity_type AS ENUM ('siembra', 'cosecha', 'fertilizacion', 'riego', 'fumigacion');
CREATE TYPE public.resource_type AS ENUM ('maquinaria', 'fertilizantes', 'semillas', 'herramientas');
CREATE TYPE public.crop_type AS ENUM ('maiz', 'trigo', 'soja', 'girasol', 'otro');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  rol user_role NOT NULL DEFAULT 'trabajador',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plots table
CREATE TABLE public.plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  superficie DECIMAL(10,2) NOT NULL CHECK (superficie > 0),
  tipo_cultivo crop_type NOT NULL,
  estado plot_status NOT NULL DEFAULT 'en preparacion',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  tipo activity_type NOT NULL,
  id_parcela UUID NOT NULL REFERENCES public.plots(id) ON DELETE CASCADE,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado activity_status DEFAULT 'pendiente',
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (fecha_fin >= fecha_inicio)
);

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo resource_type NOT NULL,
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad >= 0),
  id_parcela UUID REFERENCES public.plots(id) ON DELETE SET NULL,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workers table
CREATE TABLE public.workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  especialidad TEXT NOT NULL,
  id_usuario UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity assignments (many-to-many between activities and workers)
CREATE TABLE public.activity_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_actividad UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  id_trabajador UUID NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  asignado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id_actividad, id_trabajador)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_assignments ENABLE ROW LEVEL SECURITY;

-- Function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT rol FROM public.profiles WHERE id = user_id;
$$;

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plots_updated_at BEFORE UPDATE ON public.plots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON public.workers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, correo, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'rol')::user_role, 'trabajador')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can insert profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for plots
CREATE POLICY "Everyone can view plots"
  ON public.plots FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can do everything with plots"
  ON public.plots FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Gestores can insert plots"
  ON public.plots FOR INSERT
  WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'gestor'));

CREATE POLICY "Gestores can update plots"
  ON public.plots FOR UPDATE
  USING (public.get_user_role(auth.uid()) IN ('admin', 'gestor'));

-- RLS Policies for activities
CREATE POLICY "Everyone can view activities"
  ON public.activities FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and gestores can manage activities"
  ON public.activities FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'gestor'));

CREATE POLICY "Workers can update their assigned activities"
  ON public.activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.activity_assignments aa
      JOIN public.workers w ON w.id = aa.id_trabajador
      WHERE aa.id_actividad = activities.id
      AND w.id_usuario = auth.uid()
    )
  );

-- RLS Policies for resources
CREATE POLICY "Everyone can view resources"
  ON public.resources FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and gestores can manage resources"
  ON public.resources FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'gestor'));

-- RLS Policies for workers
CREATE POLICY "Everyone can view workers"
  ON public.workers FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage workers"
  ON public.workers FOR ALL
  USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for activity_assignments
CREATE POLICY "Everyone can view assignments"
  ON public.activity_assignments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and gestores can manage assignments"
  ON public.activity_assignments FOR ALL
  USING (public.get_user_role(auth.uid()) IN ('admin', 'gestor'));
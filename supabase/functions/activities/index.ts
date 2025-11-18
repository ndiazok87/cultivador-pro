import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No autorizado" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const activityId = pathParts[pathParts.length - 1];

    // GET /activities - Listar todas las actividades
    if (req.method === "GET" && !activityId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      const { data, error } = await supabase
        .from("activities")
        .select("*, plots(nombre)")
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /activities - Crear nueva actividad (admin y gestores)
    if (req.method === "POST") {
      const body = await req.json();
      const { nombre, tipo, id_parcela, fecha_inicio, fecha_fin, descripcion, estado = 'pendiente' } = body;

      if (!nombre || !tipo || !id_parcela || !fecha_inicio || !fecha_fin) {
        return new Response(
          JSON.stringify({ error: "Nombre, tipo, parcela, fecha inicio y fecha fin son requeridos" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("activities")
        .insert([{ nombre, tipo, id_parcela, fecha_inicio, fecha_fin, descripcion, estado }])
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PUT /activities/:id - Actualizar actividad (admin y gestores)
    if (req.method === "PUT") {
      const body = await req.json();
      const { nombre, tipo, id_parcela, fecha_inicio, fecha_fin, descripcion, estado } = body;

      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (tipo !== undefined) updateData.tipo = tipo;
      if (id_parcela !== undefined) updateData.id_parcela = id_parcela;
      if (fecha_inicio !== undefined) updateData.fecha_inicio = fecha_inicio;
      if (fecha_fin !== undefined) updateData.fecha_fin = fecha_fin;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (estado !== undefined) updateData.estado = estado;

      const { data, error } = await supabase
        .from("activities")
        .update(updateData)
        .eq("id", activityId)
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify(data),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE /activities/:id - Eliminar actividad (solo admin)
    if (req.method === "DELETE") {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activityId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Actividad eliminada exitosamente" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in activities:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

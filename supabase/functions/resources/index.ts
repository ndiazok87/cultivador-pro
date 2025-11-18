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
    const resourceId = pathParts[pathParts.length - 1];
    const id_parcela = url.searchParams.get('id_parcela');

    // GET /resources - Listar recursos (con filtro opcional por parcela)
    if (req.method === "GET" && !resourceId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      let query = supabase
        .from("resources")
        .select("*, plots(nombre)")
        .order("created_at", { ascending: false });

      if (id_parcela) {
        query = query.eq("id_parcela", id_parcela);
      }

      const { data, error } = await query;

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

    // POST /resources - Crear nuevo recurso (admin y gestores)
    if (req.method === "POST") {
      const body = await req.json();
      const { nombre, tipo, cantidad, id_parcela, disponible = true } = body;

      if (!nombre || !tipo || cantidad === undefined) {
        return new Response(
          JSON.stringify({ error: "Nombre, tipo y cantidad son requeridos" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data, error } = await supabase
        .from("resources")
        .insert([{ nombre, tipo, cantidad, id_parcela, disponible }])
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

    // PUT /resources/:id - Actualizar recurso (admin y gestores)
    if (req.method === "PUT") {
      const body = await req.json();
      const { nombre, tipo, cantidad, id_parcela, disponible } = body;

      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (tipo !== undefined) updateData.tipo = tipo;
      if (cantidad !== undefined) updateData.cantidad = cantidad;
      if (id_parcela !== undefined) updateData.id_parcela = id_parcela;
      if (disponible !== undefined) updateData.disponible = disponible;

      const { data, error } = await supabase
        .from("resources")
        .update(updateData)
        .eq("id", resourceId)
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

    // DELETE /resources/:id - Eliminar recurso (solo admin)
    if (req.method === "DELETE") {
      const { error } = await supabase
        .from("resources")
        .delete()
        .eq("id", resourceId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Recurso eliminado exitosamente" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in resources:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

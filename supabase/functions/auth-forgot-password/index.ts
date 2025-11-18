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
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email es requerido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generar token de recuperación usando Supabase Auth
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (error) {
      console.error("Error generating recovery link:", error);
      return new Response(
        JSON.stringify({ error: "Error al generar token de recuperación" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Enviar email con SendGrid
    const sendgridApiKey = Deno.env.get("SENDGRID_API_KEY");
    const resetUrl = `${Deno.env.get("SUPABASE_URL")}/auth/v1/verify?token=${data.properties?.hashed_token}&type=recovery&redirect_to=${new URL(req.url).origin}/auth`;

    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: "Recuperación de contraseña - AgroPrecision",
        }],
        from: { email: "noreply@agroprecision.com", name: "AgroPrecision" },
        content: [{
          type: "text/html",
          value: `
            <h1>Recuperación de contraseña</h1>
            <p>Has solicitado restablecer tu contraseña en AgroPrecision.</p>
            <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
            <a href="${resetUrl}">Restablecer contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
          `,
        }],
      }),
    });

    if (!emailResponse.ok) {
      console.error("SendGrid error:", await emailResponse.text());
      return new Response(
        JSON.stringify({ error: "Error al enviar el email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Email de recuperación enviado exitosamente" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

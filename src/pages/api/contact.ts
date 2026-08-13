import { Resend } from "resend";

// Desactiva el prerenderizado estático en Astro para este endpoint
export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export async function POST({ request }: { request: Request }) {
  try {
    // Validar que la petición contenga datos
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "El cuerpo de la petición está vacío o no es un JSON válido." }),
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "El email del cliente es obligatorio." }),
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Sitio web Power Cien <onboarding@resend.dev>",
      to: "daniel.payan.contacto@gmail.com",
      subject: "Nueva solicitud de presupuesto",
      html: `
        <h2>Nueva solicitud de presupuesto</h2>
        <p>Se recibió una nueva solicitud desde el sitio web.</p>
        <p><strong>Correo del cliente:</strong> ${email}</p>
        <p>El cliente solicita información sobre un servicio.</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error al enviar email:", error);
    return new Response(JSON.stringify({ success: false, error }), {
      status: 500,
    });
  }
}
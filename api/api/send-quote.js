import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { service, area, description, name, phone, email } = req.body;

    const msg = {
      to: process.env.TO_EMAIL, // a quién se envía
      from: process.env.FROM_EMAIL, // remitente verificado
      subject: `Nueva cotización - ${service}`,
      html: `
        <h2>Solicitud de Cotización</h2>
        <p><b>Servicio:</b> ${service}</p>
        <p><b>Área:</b> ${area}</p>
        <p><b>Descripción:</b> ${description}</p>
        <hr>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Teléfono:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
      `
    };

    await sendgrid.send(msg);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al enviar el correo" });
  }
}

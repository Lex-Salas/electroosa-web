import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { service, area, description, name, phone, email } = req.body;

    if (!service || !name || !email) {
      res.setHeader("Content-Type", "application/json");
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `Nueva solicitud de cotización - ${service || "Servicio"}`,
      html: `
        <h2>Solicitud de Cotización</h2>
        <p><b>Servicio:</b> ${service}</p>
        <p><b>Área del proyecto:</b> ${area || "No especificada"} m²</p>
        <p><b>Descripción:</b> ${description || "Sin descripción"}</p>
        <hr>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Teléfono:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
      `,
    };

    await sendgrid.send(msg);
    console.log("✅ Cotización enviada correctamente");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al enviar cotización:", error.response?.body || error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({ error: "Error al enviar la cotización" });
  }
}

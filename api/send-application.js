import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { position, name, email, phone, experience } = req.body;

    const msg = {
      to: process.env.TO_EMAIL,
      from: process.env.FROM_EMAIL,
      subject: `Nueva solicitud de empleo - ${position || "Posición no especificada"}`,
      html: `
        <h2>Solicitud de Empleo</h2>
        <p><b>Posición:</b> ${position || "No indicada"}</p>
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${phone}</p>
        <p><b>Experiencia:</b> ${experience || "No indicada"} años</p>
      `
    };

    await sendgrid.send(msg);
    console.log("✅ Solicitud de empleo enviada correctamente");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al enviar solicitud:", error.response?.body || error);
    return res.status(500).json({ error: "Error al enviar la solicitud" });
  }
}

const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN =
  process.env.VERIFY_TOKEN || "clinicaofta2026";

/*
========================================
VERIFICACION DEL WEBHOOK
========================================
*/
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN
  ) {
    console.log("✅ Webhook verificado correctamente");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/*
========================================
RECEPCION DE MENSAJES
========================================
*/
app.post("/webhook", (req, res) => {
  try {

    console.log(
      "========== EVENTO RECIBIDO =========="
    );

    const value =
      req.body?.entry?.[0]?.changes?.[0]?.value;

    if (!value) {
      console.log("⚠️ Evento sin contenido");
      return res.sendStatus(200);
    }

    const contacto = value.contacts?.[0];
    const mensaje = value.messages?.[0];

    if (!mensaje) {
      console.log(
        "ℹ️ Evento recibido sin mensaje"
      );
      return res.sendStatus(200);
    }

    const nombre =
      contacto?.profile?.name ||
      "Sin nombre";

    const telefono =
      contacto?.wa_id ||
      "Sin telefono";

    const texto =
      mensaje?.text?.body ||
      "Mensaje no textual";

    console.log("");
    console.log("📱 TELEFONO:", telefono);
    console.log("👤 NOMBRE:", nombre);
    console.log("💬 MENSAJE:", texto);
    console.log("");

    console.log(
      "====================================="
    );

    return res.sendStatus(200);

  } catch (error) {

    console.error(
      "❌ ERROR WEBHOOK:",
      error
    );

    return res.sendStatus(200);
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `✅ Servidor iniciado en puerto ${PORT}`
  );
});

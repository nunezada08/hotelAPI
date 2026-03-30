import express from "express";
import "dotenv/config";
import quartosRoutes from "./routes/quartosRoutes.js";
import docApiSwagger from "express-jsdoc-swagger";

import pdfRoute from "./routes/pdfRoutes.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

docApiSwagger(app)({
  info: {
    title: "API de Hotel - Documentação Sweagger",
    version: "1.0.0",
    description:
      "Uma API de gestão hoteleira projetada para o controle essencial de cadastros de hóspedes e inventário de quartos.",
  },
  baseDir: import.meta.dirname,
  filesPattern: "./**/*.js",
});

app.get("/", (req, res) => {
  res.send("🚀 API funcionando");
});

app.use("/quartos", quartosRoutes);

app.use("/quartos", pdfRoute);
app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

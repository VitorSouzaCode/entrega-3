import cors from "cors";
import express from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import RotasUsuario from "./rotas/rotas-usuario"; 
import RotasOrganizador from "./rotas/rotas-organizador"; 
import RotasParticipante from "./rotas/rotas-participante"; 

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());


app.use("/usuarios", RotasUsuario);
app.use("/organizadores", RotasOrganizador); 
app.use("/participantes", RotasParticipante); 

app.listen(PORT || 3333, () => { 
});
const conexao = createConnection();
export default conexao;
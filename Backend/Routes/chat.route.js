import { chatController , FamerAIChatController } from "../Controller/Chat.controller.js";
import Router from "express";

const app = Router();

app.post("/chat", chatController);
app.post("/FamerAIChatController", FamerAIChatController);

export default app; 

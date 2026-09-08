import express from 'express';
import { Router } from 'express';
import { addAadhar} from "../Controller/Addharr.controller.js";

const app = Router();
// GET /api/aadhaar/check
app.get('/check', addAadhar);

export default app;
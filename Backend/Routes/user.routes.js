import express, { Router } from "express"
import { farmerRegistration, adminRegistration, govtRegistration, adminLogin, farmerLogin, govtLogin ,  } from "../Controller/user.controller.js"

const app = Router()

app.post("/farmer_register", farmerRegistration)
app.post("/admin_register", adminRegistration)
app.post("/govt_register", govtRegistration)
app.post("/admin_login", adminLogin)
app.post("/farmer_login", farmerLogin)
app.post("/govt_login", govtLogin)

export default app
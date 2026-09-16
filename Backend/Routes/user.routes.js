import express, { Router } from "express"
import { farmerRegistration, adminRegistration, govtRegistration, adminLogin, farmerLogin, govtLogin, getAllFarmers, getAllGovt, getAdminProfile, updateAdminProfile, getFarmerProfile, verifyFarmerQr, updateFarmerProfile, getGovtProfile, updateGovtProfile } from "../Controller/user.controller.js"

const app = Router()

app.post("/farmer_register", farmerRegistration)
app.post("/admin_register", adminRegistration)
app.post("/govt_register", govtRegistration)
app.post("/admin_login", adminLogin)
app.get("/admin/:id", getAdminProfile)
app.put("/admin/:id", updateAdminProfile)
app.post("/farmer_login", farmerLogin)
app.get("/farmer/verify/:id", verifyFarmerQr)
app.get("/farmer/:id", getFarmerProfile)
app.put("/farmer/:id", updateFarmerProfile)
app.post("/govt_login", govtLogin)
app.get("/govt/:id", getGovtProfile)
app.put("/govt/:id", updateGovtProfile)
app.get("/get_farmer/:id", getAllFarmers)
app.get("/get_govt", getAllGovt)

export default app
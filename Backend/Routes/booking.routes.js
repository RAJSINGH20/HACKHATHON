import express, { Router } from "express"
import {createBooking,getBookings} from "../Controller/booking.controller.js"
const app = Router()

app.post("/createBooking", createBooking)
app.get("/getBookings", getBookings)
export default app
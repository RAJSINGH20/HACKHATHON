import express, { Router } from "express"
import {
	createBooking,
	createIVRBooking,
	getBookings,
} from "../Controller/booking.controller.js";
const app = Router()

app.post("/createBooking", createBooking)
app.post("/ivr/createBooking", createIVRBooking)
app.get("/getBookings", getBookings)
app.get("/ivr/getBookings", getBookings)
export default app
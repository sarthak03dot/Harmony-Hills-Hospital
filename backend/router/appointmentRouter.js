import express from "express";
import {
  deleteAppointment,
  postAppointment,
  updateAppointmentStatus,
  getDoctorAppointments,
  getAllAppointments,
  getPatientAppointments,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
  isDoctorAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/my-appointments", isPatientAuthenticated, getPatientAppointments);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.get("/doctor-appointments", isDoctorAuthenticated, getDoctorAppointments);

export default router;

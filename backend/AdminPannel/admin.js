import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import { Appointment } from "../models/appointmentSchema.js";

export const getAdminStats = catchAsyncErrors(async (req, res, next) => {
    const totalDoctors = await User.countDocuments({ role: "Doctor" });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: "Pending" });
    const acceptedAppointments = await Appointment.countDocuments({ status: "Accepted" });
    const rejectedAppointments = await Appointment.countDocuments({ status: "Rejected" });

    res.status(200).json({
        success: true,
        stats: {
            totalDoctors,
            totalAppointments,
            pendingAppointments,
            acceptedAppointments,
            rejectedAppointments,
        }
    });
});

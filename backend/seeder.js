import mongoose from "mongoose";
import { config } from "dotenv";
import { User } from "./models/userSchema.js";
import { dbConnection } from "./database/dbConnection.js";

// Load environment variables
config({ path: "./config/config.env" });

const seedAdmin = async () => {
    try {
        console.log("Connecting to database...");

        // Connect directly using mongoose here to control connection lifecycle in the script.
        await mongoose.connect(process.env.MONGO__URI, {
            dbName: "MERN_STACK_HOSPITAL_MANAGEMENT_SYSTEM",
        });

        console.log("Database connected successfully. Checking for existing admins...");

        await User.deleteMany().then(() => {
            console.log("All users deleted successfully.");
        });
        // Check if an admin already exists
        const adminExists = await User.findOne({ role: "Admin", email: "admin@hospital.com" });

        if (adminExists) {
            console.log("Admin user already exists. Skipping seeder.");
        } else {
            console.log("Creating new Admin user...");

            const admin = new User({
                firstName: "Super",
                lastName: "Admin",
                email: "admin@hospital.com",
                phone: "1234567890",
                dob: new Date("1990-01-01"),
                gender: "Male",
                password: "admin123",
                role: "Admin",
            });

            await admin.save();
            console.log("Admin created successfully!");
        }

        console.log("Seeding doctors...");
        const doctorData = [
            { firstName: "John", lastName: "Doe", email: "johndoe@hospital.com", phone: "9876543210", dob: new Date("1980-05-15"), gender: "Male", password: "password123", role: "Doctor", doctorDepartment: "Cardiology", docAvatar: { public_id: "avatar1", url: "/doc.png" } },
            { firstName: "Jane", lastName: "Smith", email: "janesmith@hospital.com", phone: "9876543211", dob: new Date("1982-08-20"), gender: "Female", password: "password123", role: "Doctor", doctorDepartment: "Neurology", docAvatar: { public_id: "avatar2", url: "/doc.png" } },
            { firstName: "Robert", lastName: "Brown", email: "robertbrown@hospital.com", phone: "9876543212", dob: new Date("1975-11-10"), gender: "Male", password: "password123", role: "Doctor", doctorDepartment: "Orthopedics", docAvatar: { public_id: "avatar3", url: "/doc.png" } },
            { firstName: "Emily", lastName: "Davis", email: "emilydavis@hospital.com", phone: "9876543213", dob: new Date("1988-03-25"), gender: "Female", password: "password123", role: "Doctor", doctorDepartment: "Pediatrics", docAvatar: { public_id: "avatar4", url: "/doc.png" } },
            { firstName: "Michael", lastName: "Jordan", email: "michaelj@hospital.com", phone: "9876543214", dob: new Date("1970-02-12"), gender: "Male", password: "password123", role: "Doctor", doctorDepartment: "ENT", docAvatar: { public_id: "avatar5", url: "/doc.png" } },
            { firstName: "Sarah", lastName: "Connor", email: "sarahc@hospital.com", phone: "9876543215", dob: new Date("1985-06-30"), gender: "Female", password: "password123", role: "Doctor", doctorDepartment: "Dermatology", docAvatar: { public_id: "avatar6", url: "/doc.png" } },
            { firstName: "William", lastName: "Turner", email: "williamt@hospital.com", phone: "9876543216", dob: new Date("1990-12-05"), gender: "Male", password: "password123", role: "Doctor", doctorDepartment: "Radiology", docAvatar: { public_id: "avatar7", url: "/doc.png" } },
            { firstName: "Olivia", lastName: "Benson", email: "oliviab@hospital.com", phone: "9876543217", dob: new Date("1981-04-18"), gender: "Female", password: "password123", role: "Doctor", doctorDepartment: "Cardiology", docAvatar: { public_id: "avatar8", url: "/doc.png" } }
        ];

        for (const doc of doctorData) {
            const exists = await User.findOne({ email: doc.email });
            if (!exists) {
                await new User(doc).save();
                console.log(`Doctor ${doc.firstName} created.`);
            }
        }

        console.log("Seeding patients...");
        const patientData = [
            { firstName: "Alice", lastName: "Johnson", email: "alicej@example.com", phone: "8876543210", dob: new Date("1995-02-14"), gender: "Female", password: "password123", role: "Patient" },
            { firstName: "Bob", lastName: "Williams", email: "bobw@example.com", phone: "8876543211", dob: new Date("1990-07-30"), gender: "Male", password: "password123", role: "Patient" },
            { firstName: "Charlie", lastName: "Miller", email: "charliem@example.com", phone: "8876543212", dob: new Date("2000-12-05"), gender: "Male", password: "password123", role: "Patient" },
            { firstName: "Diana", lastName: "Wilson", email: "dianaw@example.com", phone: "8876543213", dob: new Date("1985-09-18"), gender: "Female", password: "password123", role: "Patient" },
            { firstName: "Ethan", lastName: "Hunt", email: "ethanh@example.com", phone: "8876543214", dob: new Date("1992-11-22"), gender: "Male", password: "password123", role: "Patient" },
            { firstName: "Fiona", lastName: "Gallagher", email: "fionag@example.com", phone: "8876543215", dob: new Date("1998-03-10"), gender: "Female", password: "password123", role: "Patient" },
            { firstName: "George", lastName: "Costanza", email: "georgec@example.com", phone: "8876543216", dob: new Date("1987-01-29"), gender: "Male", password: "password123", role: "Patient" },
            { firstName: "Hannah", lastName: "Abbott", email: "hannaha@example.com", phone: "8876543217", dob: new Date("1994-08-15"), gender: "Female", password: "password123", role: "Patient" }
        ];

        for (const patient of patientData) {
            const exists = await User.findOne({ email: patient.email });
            if (!exists) {
                await new User(patient).save();
                console.log(`Patient ${patient.firstName} created.`);
            }
        }

        // Disconnect from database
        console.log("Disconnecting from database...");
        await mongoose.disconnect();

        process.exit(0);

    } catch (error) {
        console.error("Error seeding the database:", error);
        process.exit(1);
    }
};

seedAdmin();

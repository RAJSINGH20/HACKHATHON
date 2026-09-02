import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.model.js";
import { Farmer } from "../models/farmer.model.js";
import { Govt } from "../models/govt.model.js";

// ==========================================
// FARMER REGISTRATION  &&    LOGIN
// ==========================================

export const farmerRegistration = async (req, res) => {
    try {
        const {
            name,
            mobile,
            aadhaar,
            village,
            district,
            state,
            password,
        } = req.body;

        if (
            !name ||
            !mobile ||
            !aadhaar ||
            !village ||
            !district ||
            !state ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check existing farmer
        const existingUser = await Farmer.findOne({
            $or: [{ mobile }, { aadhaar }],
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Farmer already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const farmer = await Farmer.create({
            name,
            mobile,
            aadhaar,
            village,
            district,
            state,
            password: hashedPassword,
            role: "farmer",
        });

        return res.status(201).json({
            success: true,
            message: "Farmer registered successfully",
            user: {
                id: farmer._id,
                name: farmer.name,
                mobile: farmer.mobile,
                role: farmer.role,
            },
        });
    } catch (error) {
        console.error("FARMER REGISTRATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const farmerLogin = async (req, res) => {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
        return res.status(400).json({
            success: false,
            message: "Mobile number and password are required",
        });
    }

    const farmer = await Farmer.findOne({ mobile });

    if (!farmer) {
        return res.status(404).json({
            success: false,
            message: "Farmer not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, farmer.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Farmer logged in successfully",
        user: {
            id: farmer._id,
            name: farmer.name,
            mobile: farmer.mobile,
            role: farmer.role,
        },
    });
}


// ==========================================
// ADMIN REGISTRATION  &&    LOGIN
// ==========================================

export const adminRegistration = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            department,
            adminId,
            password,
        } = req.body;

        if (
            !name ||
            !email ||
            !mobile ||
            !department ||
            !adminId ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check existing admin
        const existingAdmin = await Admin.findOne({
            $or: [
                { email },
                { mobile },
                { adminId },
            ],
        });

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Admin already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            mobile,
            department,
            adminId,
            password: hashedPassword,
            role: "admin",
        });

        return res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        console.error("ADMIN REGISTRATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const adminLogin = async (req, res) => {
    
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const admin = await Admin.findOne({ email });

    if(!admin) {
        return res.status(404).json({
            success: false,
            message: "Admin not found",
        });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if(!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    });
}

// ==========================================
// GOVERNMENT REGISTRATION   &&    LOGIN
// ==========================================

export const govtRegistration = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            department,
            governmentId,
            office,
            password,
        } = req.body;

        if (
            !name ||
            !email ||
            !mobile ||
            !department ||
            !governmentId ||
            !office ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingGovt = await Govt.findOne({
            $or: [
                { email },
                { mobile },
                { governmentId },
            ],
        });

        if (existingGovt) {
            return res.status(409).json({
                success: false,
                message: "Government account already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const govt = await Govt.create({
            name,
            email,
            mobile,
            department,
            governmentId,
            office,
            password: hashedPassword,
            role: "government",
        });

        return res.status(201).json({
            success: true,
            message: "Government account registered successfully",
            user: {
                id: govt._id,
                name: govt.name,
                email: govt.email,
                role: govt.role,
            },
        });
    } catch (error) {
        console.error("GOVERNMENT REGISTRATION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const govtLogin = async (req, res) => {

    const { email, password } = req.body;
    console.log(email,",",password)

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const govt = await Govt.findOne({ email });

    const isPasswordValid = await bcrypt.compare(password, govt.password);

    if(!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password",
        });
    }

    if(!govt) {
        return res.status(404).json({
            success: false,
            message: "Government account not found",
        });
    }
    return res.status(200).json({
        success: true,
        message: "Government account logged in successfully",
        user: {
            id: govt._id,
            name: govt.name,
            email: govt.email,
            role: govt.role,
        },
    });
}
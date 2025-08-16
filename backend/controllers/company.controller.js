import { Company } from "../models/company.model.js";
import mongoose from "mongoose";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ============================
// Register a new company
// ============================
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false,
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company twice.",
                success: false,
            });
        }

        company = await Company.create({
            name: companyName,
            userId: req.id,
        });

        return res.status(201).json({
            message: "Company registered successfully",
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error in registerCompany:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ============================
// Get companies created by the logged-in user
// ============================
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });

        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found.",
                success: false,
            });
        }

        return res.status(200).json({
            companies,
            success: true,
        });
    } catch (error) {
        console.error("Error in getCompany:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ============================
// Get company by ID
// ============================
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID",
                success: false,
            });
        }

        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false,
            });
        }

        return res.status(200).json({
            company,
            success: true,
        });
    } catch (error) {
        console.error("Error in getCompanyById:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

// ============================
// Update company information
// ============================
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid company ID",
                success: false,
            });
        }

        let logo;
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        const company = await Company.findOneAndUpdate(
            { _id: req.params.id },
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Company information updated",
            success: true,
            company,
        });
    } catch (error) {
        console.error("Error in updateCompany:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

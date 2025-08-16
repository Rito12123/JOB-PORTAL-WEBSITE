import { Job } from "../models/job.model.js";
import mongoose from "mongoose"; // Import to check ObjectId validity
import { Company } from "../models/company.model.js";

// Post a new job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    // Validate required fields
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({
        message: "Something is missing!",
        success: false,
      });
    }

    // Validate company ID
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        return res.status(400).json({
            message: "Invalid company ID",
            success: false,
        });
    }
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(400).json({
        message: "Company not found",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      experienceLevel: experience,
      jobType,
      position,
      company: companyId,
      created_by: userId,
    });

    return res.status(201).json({
      message: "New job created successfully!",
      job,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all jobs for students
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ]
    };

    const jobs = await Job.find(query)
      .populate({
        path: "company",
        select: "name description website location logo"
      })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
          path:"applications"
      });
      if (!job) {
          return res.status(404).json({
              message: "Jobs not found.",
              success: false
          })
      };

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get jobs posted by an admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await Job.find({ created_by: adminId })
      .populate({
        path: "company",
        select: "name description website location logo"
      })
      .sort({ createdAt: -1 });

    if (!jobs.length) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false,
      });
    }

    return res.status(200).json({
      jobs,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};




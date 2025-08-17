import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewires/isAuthenticated.js";
import { singleUpload } from "../middlewires/multer.js";

const router = express.Router();

// ✅ Register route
router.post("/register", (req, res, next) => {
  singleUpload(req, res, async (err) => {
    if (err) return next(err); // multer errors
    try {
      await register(req, res, next);
    } catch (error) {
      next(error);
    }
  });
});

// ✅ Login route
router.post("/login", async (req, res, next) => {
  try {
    await login(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ✅ Logout route
router.get("/logout", async (req, res, next) => {
  try {
    await logout(req, res, next);
  } catch (err) {
    next(err);
  }
});

// ✅ Update profile
router.post("/profile/update", isAuthenticated, (req, res, next) => {
  singleUpload(req, res, async (err) => {
    if (err) return next(err);
    try {
      await updateProfile(req, res, next);
    } catch (error) {
      next(error);
    }
  });
});

export default router;

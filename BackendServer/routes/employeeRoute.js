const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { addEmployee, deleteEmployee, updateEmployee, getAllEmployees } = require("../controllers/employeeController.js");
const middleware = require("../middlewares/middleware.js");

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.post("/add", middleware, upload.single("image"), addEmployee);
router.delete("/delete/:id", middleware, deleteEmployee);
router.put("/update/:id", middleware, upload.single("image"), updateEmployee);
router.get("/getEmployees", middleware, getAllEmployees);

module.exports = router;

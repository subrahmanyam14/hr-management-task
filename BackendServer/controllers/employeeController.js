const EmployeeSchema = require("../models/employeeModel.js");  

const isEmail = (email) => { 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailPattern.test(email); 
};

const isNumeric = (num) => { 
    return !isNaN(num); 
};

const addEmployee = async (req, res) => {
    try {
        const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
        console.log("req.file, ", req.file);
        console.log("req.body, ", req.body);

        if (!req.file || !f_Name || !f_Email || !f_Mobile || !f_Designation || !f_gender || !f_Course) {
            return res.status(400).send({ error: "Please provide all the fields..." });
        }

        if (!isEmail(f_Email)) {
            return res.status(400).send({ error: "Please provide a valid email..." });
        }

        if (!isNumeric(f_Mobile)) {
            return res.status(400).send({ error: "Please provide a valid mobile number..." });
        }

        const isEmailExisting = await EmployeeSchema.findOne({ f_Email });
        if (isEmailExisting) {
            return res.status(400).send({ error: "Email already exists..." });
        }

        const count = await EmployeeSchema.countDocuments();
        const newEmployee = new EmployeeSchema({
            f_Id: count + 1,
            f_Image: req.file.path,
            f_Name,
            f_Email,
            f_Mobile,
            f_Designation,
            f_gender,
            f_Course
        });

        await newEmployee.save();
        return res.status(200).send({ message: "Employee added successfully..." });
    } catch (error) {
        console.log("error in the addEmployee, ", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ error: "Please provide a valid id..." });
        }

        const employee = await EmployeeSchema.findByIdAndDelete(id);
        if (!employee) {
            return res.status(400).send({ error: "Employee not found..." });
        }

        return res.status(200).send({ message: "Employee deleted successfully..." });
    } catch (error) {
        console.log("Error in the delete Employee, ", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { f_Name, f_Email, f_Mobile, f_Designation, f_gender, f_Course } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ error: "Employee ID is required..." });
        }

        const existingEmployee = await EmployeeSchema.findById(id);
        if (!existingEmployee) {
            return res.status(404).send({ error: "Employee not found..." });
        }

        const updates = {};

        if (f_Name && f_Name !== existingEmployee.f_Name) updates.f_Name = f_Name;
        if (f_Email && f_Email !== existingEmployee.f_Email) {
            if (!isEmail(f_Email)) {
                return res.status(400).send({ error: "Please provide a valid email..." });
            }
            const isEmailExisting = await EmployeeSchema.findOne({ f_Email });
            if (isEmailExisting) {
                return res.status(400).send({ error: "Email already exists..." });
            }
            updates.f_Email = f_Email;
        }
        if (f_Mobile && f_Mobile !== existingEmployee.f_Mobile) {
            if (!isNumeric(f_Mobile)) {
                return res.status(400).send({ error: "Please provide a valid mobile number..." });
            }
            updates.f_Mobile = f_Mobile;
        }
        if (f_Designation && f_Designation !== existingEmployee.f_Designation) {
            updates.f_Designation = f_Designation;
        }
        if (f_gender && f_gender !== existingEmployee.f_gender) {
            updates.f_gender = f_gender;
        }
        if (f_Course && f_Course !== existingEmployee.f_Course) {
            updates.f_Course = f_Course;
        }

        if (req.file) {
            updates.f_Image = req.file.path; // Updated image path
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).send({ message: "No changes detected..." });
        }

        const updatedEmployee = await EmployeeSchema.findByIdAndUpdate(id, updates, { new: true });
        return res.status(200).send({ message: "Employee updated successfully...", data: updatedEmployee });

    } catch (error) {
        console.error("Error in updateEmployee:", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const baseUrl = (process.env.BASE_URL || "http://localhost:5000/").replace(/\/$/, "/");
        const employees = await EmployeeSchema.find().lean();

        const employeeWithImgUrls = employees.map(employee => ({
            ...employee,
            f_Image: employee.f_Image ? baseUrl + employee.f_Image.replace(/\\/g, "/") : null
        }));

        return res.status(200).send({ data: employeeWithImgUrls });
    } catch (error) {
        console.error("Error in the getAllEmployees: ", error);
        return res.status(500).send({ error: "Internal Server Error..." });
    }
};

module.exports = { addEmployee, deleteEmployee, updateEmployee, getAllEmployees };

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CreateEmployee.css"; // Optional for custom styling
import { toast } from "react-toastify";

const EditEmployee = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeData = location.state || {}; // Retrieve employee data from navigation state

  const [formData, setFormData] = useState({
    name: employeeData.f_Name || "",
    email: employeeData.f_Email || "",
    mobile: employeeData.f_Mobile || "",
    designation: employeeData.f_Designation || "",
    gender: employeeData.f_gender || "",
    course: employeeData.f_Course || [],
    image: null, // Handle new image separately
    existingImage: employeeData.f_Image || null, // Store the existing image URL or filename
  });

  const [originalData, setOriginalData] = useState(formData); // To track changes
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false); // Track if form has changes

  // Check if form has changes
  useEffect(() => {
    const hasChanges = Object.keys(formData).some((key) => {
      if (key === "image") return formData[key] !== null; // Only check if a new image was uploaded
      if (key === "course") return JSON.stringify(formData.course) !== JSON.stringify(originalData.course);
      return formData[key] !== originalData[key];
    });

    setIsChanged(hasChanges);
  }, [formData, originalData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      // Handle checkbox inputs (Courses)
      setFormData((prevData) => {
        const updatedCourses = checked
          ? [...prevData.course, value]
          : prevData.course.filter((course) => course !== value);
        return { ...prevData, course: updatedCourses };
      });
    } else if (type === "file") {
      // Handle file input (Image Upload)
      setFormData({ ...formData, image: files[0], existingImage: null }); // Clear existing image
    } else {
      // Handle text, radio, and dropdown inputs
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" }); // Clear errors for the field
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      const data = new FormData();

      // Append form data fields
      data.append("f_Name", formData.name);
      data.append("f_Email", formData.email);
      data.append("f_Mobile", formData.mobile);
      data.append("f_Designation", formData.designation);
      data.append("f_gender", formData.gender);
      data.append("f_Course", formData.course);

      if (formData.image) {
        data.append("image", formData.image); // Only include new image if uploaded
      }

      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/employee/update/${employeeData._id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.status === 200) {
          toast.success("Employee updated successfully!", { position: "top-center" });
          navigate("/list"); // Redirect to employee list page
        }
      } catch (error) {
        console.error("Error updating employee:", error);
        toast.error("Error updating employee", { position: "top-center" });
      }
    } else {
      setErrors(validationErrors);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!formData.mobile.trim()) errors.mobile = "Mobile number is required.";
    if (!formData.designation) errors.designation = "Designation is required.";
    if (!formData.gender) errors.gender = "Gender is required.";
    if (formData.course.length === 0) errors.course = "At least one course must be selected.";
    return errors;
  };

  return (
    <>
    <div style={styles.header}>
                <h1 style={styles.headerText}>Edit Employee</h1>
            </div>
    <div className="form-container">
      
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* Mobile No */}
        <div className="form-group">
          <label>Mobile No:</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={errors.mobile ? "input-error" : ""}
          />
          {errors.mobile && <p className="error-message">{errors.mobile}</p>}
        </div>

        {/* Designation */}
        <div className="form-group">
          <label>Designation:</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={errors.designation ? "input-error" : ""}
          >
            <option value="">Select</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.designation && <p className="error-message">{errors.designation}</p>}
        </div>

        {/* Gender */}
        <div className="form-group">
          <label>Gender:</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
          {errors.gender && <p className="error-message">{errors.gender}</p>}
        </div>

        {/* Course */}
        <div className="form-group">
          <label>Course:</label>
          <div>
            <label>
              <input
                type="checkbox"
                name="course"
                value="MCA"
                checked={formData.course.includes("MCA")}
                onChange={handleChange}
              />
              MCA
            </label>
            <label>
              <input
                type="checkbox"
                name="course"
                value="BCA"
                checked={formData.course.includes("BCA")}
                onChange={handleChange}
              />
              BCA
            </label>
            <label>
              <input
                type="checkbox"
                name="course"
                value="BSC"
                checked={formData.course.includes("BSC")}
                onChange={handleChange}
              />
              BSC
            </label>
          </div>
          {errors.course && <p className="error-message">{errors.course}</p>}
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Image Upload:</label>
          {formData.existingImage && !formData.image && (
            <p>
              Current Image: <strong>{formData.existingImage}</strong>
            </p>
          )}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className={errors.image ? "input-error" : ""}
          />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" disabled={!isChanged}>
            Update
          </button>
        </div>
      </form>
    </div>
    </>
  );
};


const styles = { header: {
  backgroundColor: 'yellow',
  padding: '10px',
  textAlign: 'left',
},
headerText: {
  margin: 0,
},
};

export default EditEmployee;

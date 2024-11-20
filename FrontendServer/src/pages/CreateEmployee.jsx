import React, { useState } from "react";
import "../styles/CreateEmployee.css"; 
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    course: [],
    image: null,
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

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
      setFormData({ ...formData, image: files[0] });
    } else {
      // Handle text, radio, and dropdown inputs
      setFormData({ ...formData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" }); // Clear errors for the field
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length === 0) {
        console.log("Form Data:", formData);
        const form = new FormData();
        form.append("f_Name", formData.name);
        form.append("f_Email", formData.email);
        form.append("f_Mobile", formData.mobile);
        form.append("f_Designation", formData.designation);
        form.append("f_gender", formData.gender);
        form.append("f_Course", formData.course);
        form.append("image", formData.image);
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/employee/add`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          }
        });
        console.log(res);
        if(res.status !== 200) throw new Error("Error while creating employee");
        toast.success("Employee created successfully!", { position: "top-center" });
        setFormData({
          name: "",
          email: "",
          mobile: "",
          designation: "",
          gender: "",
          course: [],
          image: null,
        })

        // Perform further actions like API calls here
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      console.log("Error while creating employee", error);
      toast.error("Error while creating employee", { position: "top-center" });
    }
    finally{
      navigate("/list");
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
    if (!formData.image) errors.image = "Image upload is required.";
    return errors;
  };

  return (
    <>
    <div style={styles.header}>
                <h1 style={styles.headerText}>Create Employee</h1>
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
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className={errors.image ? "input-error" : ""}
          />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit">Submit</button>
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

export default CreateEmployee;

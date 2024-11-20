import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch all employees on component mount
  useEffect(() => {
    if (!token) {
      toast.error("User is not authenticated.", { position: "top-center" });
      return;
    }

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/employee/getEmployees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setEmployees(response.data.data);
          setFilteredEmployees(response.data.data);
        } else {
          throw new Error("Failed to fetch employees");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to fetch employees", { position: "top-center" });
      }
    };
    fetchEmployees();
  }, [token]);

  // Handle search functionality
  const handleSearch = () => {
    if (!searchKeyword.trim()) {
      setFilteredEmployees(employees); // Reset to full list
    } else {
      const filtered = employees.filter((employee) =>
        Object.values(employee)
          .join(" ")
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  // Handle employee deletion
  const handleDelete = async (id) => {
    if (!token) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/employee/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Employee deleted successfully!", { position: "top-center" });

        // Update the state to remove the deleted employee
        const updatedEmployees = employees.filter((emp) => emp._id !== id);
        setEmployees(updatedEmployees);
        setFilteredEmployees(updatedEmployees);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee", { position: "top-center" });
    }
  };

  // Trigger search on `searchKeyword` change
  useEffect(() => {
    handleSearch();
  }, [searchKeyword]);

  return (
    <>
    <div style={styles.header}>
                <h1 style={styles.headerText}>Employee List</h1>
            </div>
    <div className="employee-dashboard">
      {/* Header Section */}
      

      {/* Search Section */}
      <div className="controls">
      
        <div className="search">
          <input
            type="text"
            placeholder="Search by name, email, mobile, designation, gender, course, or unique ID"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          
        </div>
        
        <div className="create-employee">
          <button onClick={() => navigate("/create")}>Create Employee</button>
      </div>
      </div>

      {/* Employee Table */}
      <table>
        <thead>
          <tr>
            <th>Unique ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Create Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.f_Id}</td>
                <td>
                  <img
                    src={employee.f_Image}
                    alt={employee.f_Name}
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  />
                </td>
                <td>{employee.f_Name}</td>
                <td>{employee.f_Email}</td>
                <td>{employee.f_Mobile}</td>
                <td>{employee.f_Designation}</td>
                <td>{employee.f_gender}</td>
                <td>{employee.f_Course}</td>
                <td>{employee.f_Createdate}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() =>
                      navigate("/edit", { state: employee })
                    }
                  >
                    Edit
                  </button>
                  {" - "}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
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

export default EmployeeList;

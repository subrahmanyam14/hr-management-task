import React from 'react'
import "../styles/NavBar.css"
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();
    return (
        <div className='nav-bar'>
            <div className='left-section'>
                <a href="/" >Home</a>
                <a href='/list'>EmployeeList</a>
            </div>
            <div className='right-section'>
                <h1>{localStorage.getItem("username")} - </h1>
                <button onClick={() => {localStorage.clear(); navigate("/login")}}>Logout</button>
            </div>

        </div>
    )
}

export default NavBar
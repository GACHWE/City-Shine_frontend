import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isUserAdmin } from '../../utils/jwt-helper'; // <-- IMPORT THE NEW FUNCTION

const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();

    useEffect(()=>{
        if(!isUserAdmin()){ // <-- USE THE NEW FUNCTION
            navigate("/v1/login")
        }
    },[navigate]);

    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute
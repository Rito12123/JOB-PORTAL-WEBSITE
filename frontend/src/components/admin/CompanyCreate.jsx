import React, { useState } from 'react'
import Navbar from '../ui/shared/Navbar'
// Reusable Navbar component used for page navigation

import { Label } from '../ui/label'
// Styled label component for form inputs

import { Input } from '../ui/input'
// Styled input field component for user text entry

import { Button } from '../ui/button'
// Styled button component for form submission or user actions

import { useNavigate } from 'react-router-dom'
// Hook used to navigate to different routes/pages programmatically

import axios from 'axios'
// HTTP client used to send API requests to the backend

import { COMPANY_API_END_POINT } from '@/utils/constant'
// Constant storing the base URL or endpoint for company-related API calls

import { toast } from 'sonner'
// Library used to display toast notifications (e.g., success/error messages)

import { useDispatch } from 'react-redux'
// Hook to dispatch actions to the Redux store (for state management)

import { setSingleCompany } from '@/redux/companySlice'
// Redux action used to update the state with a single company's data



const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName,setCompanyName]  = useState("");


    const registerNewCompany = async()  =>{
        try{
          console.log("Sending companyName:", companyName);
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`,{companyName},{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                dispatch(setSingleCompany(res?.data?.company));
                toast.success(res.data.message);
                const companyId = res.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
           
        }catch(error)
        {
          console.log(error);
        }
    }
  return (
    <div>
      <Navbar/>
      <div className='max-w-4xl mx-auto '>
      <div className='my-10'>
      <h1 className='font-bold text-2xl'>Your Company Name</h1>
      <p className='text-gray-500'>What would you like to give your comapny Name? you can chnage this letter</p>
      </div>
       
        <Label>Comapany Name</Label>
        <Input
        type="text"
         className="my-2"
         placeholder="JobHunt , Microsoft etc"
         onChange={(e) => setCompanyName(e.target.value)}
        />
        <div className='flex items-center gap-2 my-10'>
            <Button variant="outline"onClick = {()=> navigate("/admin/companies")}>Cancel</Button>
            <Button onClick={registerNewCompany}>Continue</Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate

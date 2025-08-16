import React, { useEffect, useState } from "react";
// React core and hooks:
// - useEffect: to perform side effects after component mounts or updates
// - useState: to manage local state (e.g., form inputs)

import Navbar from "../ui/shared/Navbar";
// Reusable top navigation bar component

import { Label } from "@radix-ui/react-label";
// Accessible form label component from Radix UI

import { Input } from "../ui/input";
// Styled input component for user text entry

import { RadioGroup } from "@radix-ui/react-radio-group";
// Grouped radio buttons from Radix UI for selecting options like gender/type

import { Button } from "../ui/button";
// Styled button component for form submission or other actions

import { Link, useNavigate } from "react-router-dom";
// React Router:
// - Link: for navigation via anchor-like elements
// - useNavigate: to navigate programmatically between routes

import { toast } from "sonner";
// Library for displaying toast notifications (e.g., for feedback on actions)

import axios from "axios";
// HTTP client to send requests to a backend API

import { USER_API_END_POINT } from "@/utils/constant";
// Constant defining the base URL for user-related API calls

import { useDispatch, useSelector } from "react-redux";
// Redux hooks:
// - useDispatch: to dispatch actions to the global state
// - useSelector: to access values from the global Redux store

import { setLoading } from "@/redux/authSlice";
// Redux action to toggle loading state (e.g., during API calls)

import { Loader2 } from "lucide-react";
// Spinner icon used to indicate a loading state (e.g., while submitting a form)


const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const {loading,user}=useSelector(store=>store.auth);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData=new FormData();
    formData.append("fullname",input.fullname);
    formData.append("email",input.email);
    formData.append("phoneNumber",input.phoneNumber);
    formData.append("password",input.password);
    formData.append("role",input.role);
    if(input.file){
      formData.append("file",input.file);

    }
    try{
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true,
      });
      if(res.data.success){
        navigate("/login");
        toast.success(res.data.message);
      }
      
    }catch (error) {
      console.log("Signup error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }finally{
      dispatch(setLoading(false));
    }
    
  };
  useEffect(()=>{
      if(user){
        navigate("/");
      }
    })

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign up</h1>

          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="manisha"
            />
          </div>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="manisha@gmail.com"
            />
          </div>

          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="80080990"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>

            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>

          {input.file && (
            <p className="text-sm text-gray-600 mt-2">
              Selected file: {input.file.name}
            </p>
          )}

          {
 loading? <Button className="w-full my-4"> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>: <Button type="submit" className="w-full my-4">
            Signup
          </Button>
}

          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;

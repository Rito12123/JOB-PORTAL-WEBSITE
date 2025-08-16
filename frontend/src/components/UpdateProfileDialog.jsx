import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'



const UpdateProfileDialog = ({ open, setOpen }) => {
  const {user} = useSelector(store=>store.auth);

  const [input,setInput]=useState({
    fullname:user?.fullname,
    email:user?.email,
    phoneNumber:user?.phoneNumber,
    Bio:user?.profile?.Bio,
  Skills: user?.profile?.Skills?.map(Skills => Skills) || "",
         file: user?.profile?.resume || ""
  });
  const dispatch = useDispatch();
const  changeEventHandler = (e) =>{
  setInput({...input,[e.target.name]:e.target.value});
}

const fileChangeHandler = (e) =>{
  const file = e.target.files?.[0];
  setInput({...input,file})
}
const submitHandler =async (e) =>{
  e.preventDefault();
  const formData = new FormData();
  formData.append("fullname",input.fullname);
  formData.append("email",input.email);
  formData.append("phoneNumber",input.phoneNumber);
  formData.append("Bio",input.Bio);
  formData.append("Skills",input.Skills);
  if(input.file){
    formData.append("file",input.file);
  }
  try{
    setLoading(true);
const res = await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
  headers:{
    'Content-Type':'multipart/form-data'
  },
  withCredentials:true
});
if(res.data.success){
  dispatch(setUser(res.data.user));
  toast.success(res.data.message);
}

  }catch(error){
    console.log(error);
    toast.error(error?.response?.data?.message || "Something went wrong");

  } finally{
    setLoading(false);
  }
  setOpen(false);
  console.log(input);
}


  const [loading,setLoading]= useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Name</Label>
            <Input
             id="fullname" 
             fullname="fullname"
             type="text"
             value={input.fullname}
             onChange={changeEventHandler}
              className="col-span-3" />
          </div>
          
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Email</Label>
            <Input
             id="email" 
             name="email"
             type="email"
             value={input.email}
             onChange={changeEventHandler}
              className="col-span-3" />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Phone Number</Label>
            <Input
             id="phoneNumber" 
             name="phoneNumber"
             value={input.phoneNumber}
             onChange={changeEventHandler}
              className="col-span-3" />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Bio</Label>
            <Input
             id="Bio" 
             name="Bio"
             value={input.Bio}
             onChange={changeEventHandler}
              className="col-span-3" />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Skills</Label>
            <Input
             id="Skills" 
             name="Skills"
             value={input.Skills}
             onChange={changeEventHandler}
              className="col-span-3" />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor="name">Resume</Label>
            <Input
             id="file" 
             name="file"
             type="file"
             accept="application/pdf"
             
             onChange={fileChangeHandler}
              className="col-span-3" />
          </div>
            
          </div>
          <DialogFooter>
          {
 loading? <Button className="w-full my-4"> <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait</Button>: <Button type="submit" className="w-full my-4">
            Update
          </Button>
}
           
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog

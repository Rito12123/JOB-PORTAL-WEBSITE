import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query,setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serchJobHandler = () => {
dispatch(setSearchedQuery(query));
navigate("/browse")
  }
  return (
    <div className='text-center'>
    <div className='flex flex-col gap-5 my-10'>
    <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
    <h1 className='text-5xl font-bold'>Search,Apply & <br></br>Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
      <p>Your dream job path away is right here!</p>
    <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
      <input 
      type="text"
      placeholder='Find Your Dream Jobs'
    onChange={(e) => setQuery(e.target.value)}
  className='outline-none border-none w-full'
      />
      <Button onClick={serchJobHandler}className="bg-slate-900 bg-[#6A38C2] hover:bg-black rounded-r-full px-6 py-2">
  <Search className="h-5 w-5 text-white" />
</Button>

      </div>
    </div>
    </div>
  )
}

export default HeroSection

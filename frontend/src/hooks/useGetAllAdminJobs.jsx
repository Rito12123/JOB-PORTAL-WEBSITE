import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios'; // ✅ MISSING IMPORT FIXED

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
 

  useEffect(() => {
    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
  withCredentials: true,
});

        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.jobs));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllAdminJobs();
  }, []); // ✅ Fixed dependency array
};

export default useGetAllAdminJobs;
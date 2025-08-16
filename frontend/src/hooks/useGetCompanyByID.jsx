import { COMPANY_API_END_POINT } from '@/utils/constant';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios'; // ✅ Fixed missing import
import { setSingleCompany } from '@/redux/companySlice';

const useGetCompanyByID = (companyId) => { // ✅ Added companyId as parameter
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (companyId) {
      fetchSingleCompany();  // ✅ Make sure to call the function if companyId exists
    }
  }, [companyId, dispatch]); // ✅ Added companyId to the dependency array
};

export default useGetCompanyByID;

'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateUserName } from '@/lib/user';
import { Loader } from 'lucide-react';

import { message } from 'antd';
import '@ant-design/v5-patch-for-react-19';

const Profile = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [originalFirstName, setOriginalFirstName] = useState('');
  const [originalLastName, setOriginalLastName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [loadingName, setNameLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [wrongPassword, setWrongPasswordError] = useState(false);

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/');
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('Users')
        .select('first_name, last_name, bu_email')
        .eq('user_id', user?.id)
        .single();
  
      if (!error) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setOriginalFirstName(data.first_name)
        setOriginalLastName(data.last_name)
        setEmail(data.bu_email);
      } else {
        console.log(error);
      }
    };
  
    fetchUserData();

  }, [router, user]);

  const handleSaveName = async () => {
    if (!user) return;

    setNameLoading(true);
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

  // Prevent save if fields are empty
  if (trimmedFirst.length <= 0 || trimmedLast.length <= 0) {
    setNameError(true);
    setNameLoading(false);
    return;
  }

  // Prevent save if nothing changed
  if (
    trimmedFirst === originalFirstName.trim() &&
    trimmedLast === originalLastName.trim()
  ) {
    setNameError(true);
    setNameLoading(false);
    return;
  }

    const { error } = await updateUserName(user.id, firstName, lastName);

    if (error){
      console.log(error)
      message.error("Something went wrong while saving.");
    } else {
      setNameLoading(false)
      message.success("Your changes have been saved!");
    }
  };

  const handleSaveNameClear = () => {
    setFirstName('');
    setLastName('');
    setNameError(false);
  }

  return (
    <div className='my-6 w-full max-w-6xl mx-auto'>
      {/** Header */}
      <div className='mb-6'>
        <div>
          <h1 className='text-text-primary font-bold font-montserrat text-xl lg:text-3xl'>User Preferences</h1>
          <p className='text-text-primary font-inter text-sm lg:text-base'>Manage your account settings</p>
        </div>
      </div>

      {/** Change Name */}
      <div className='border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 shadow-lg'>
        <div className='max-w-xl mx-auto'> 
          <h1 className='text-text-primary font-bold font-montserrat text-xl mb-6'>Profile Information</h1>
          <div className=''>
            <input
              type="text"
              name="first name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${nameError ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
            />
            <input
              type="text"
              name="last name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${nameError ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
            />
          </div>
          {nameError && (
            <p className="text-red-500 font-inter text-sm italic mb-4">
              No changes detected or fields are empty.
            </p>
          )}
          <div className='flex justify-end gap-4'>
            <button 
            onClick={handleSaveNameClear}
            className='bg-white 
            text-brand-primary 
              font-poppins font-black 
              py-1.5 px-5 
              rounded-md border border-brand-primary
              duration-300 ease-in hover:bg-brand-primary hover:text-white 
              flex items-center justify-center'
            
            >
              Cancel
            </button>
            <button 
            onClick={handleSaveName}
            className='bg-brand-primary 
            text-white font-poppins font-black 
              py-1.5 px-5 
              rounded-md 
              duration-300 ease-in hover:bg-hover-primary 
              flex items-center justify-center'
            
            >
              {loadingName ?  
              <Loader className="animate-spin" size={30} style={{ animationDuration: '3s' }}/>
              : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/** Change Password */}
      <div>

      </div>

      {/** Change Email */}
      <div>

      </div>

    </div>
  );
};

export default Profile;
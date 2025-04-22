'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { updateUserName, updateEmail, updatePassword } from '@/lib/user';
import { Loader, Sun, Moon } from 'lucide-react';
import ProfilePictureUpload from '@/component/ProfilePictureUpload';
import NotificationToggle from '@/component/NotificationToggle';

import { useTheme } from '@/context/ThemeContext';

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

  const [email, setEmail] = useState('');
  const [emailCurrentPass, setEmailPass] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);
  const [emailWrongPassword, setEmailWrongPassword] = useState(false);
  const [invalidEmailDomain, setInvalidEmailDomain] = useState(false);
  const [noEmail, setNoEmail] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState(false);
  const [wrongPassword, setWrongPasswordError] = useState(false);
  const [emptyPassword, setEmptyPasswordError] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordTooShort, setPasswordTooShort] = useState(false);
  const [samePassword, setSamePassword] = useState(false);
  const { theme, toggleTheme } = useTheme(); 


  useEffect(() => {
    if (!user) {
      router.push('/');
    }

    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('Users')
        .select('first_name, last_name, bu_email, phone_num')
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

  // Start of save name section 

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

  // End of save name section 

  // Start of email change

  const handleUpdateEmail = async () => {
    if (!user) return;
  
    const trimmedEmail = email.trim();
    const currentEmail = user.email;

    if(!currentEmail) return;
  
    setEmailLoading(true);

    // Clear errors
    setEmailAlreadyUsed(false);
    setEmailWrongPassword(false);
    setInvalidEmailDomain(false);
    setNoEmail(false);
  
    // Case 1: No change
    if (trimmedEmail === currentEmail) {
      setEmailLoading(false);
      setEmailAlreadyUsed(true);
      return;
    }

    // Case 2: No email
    if (trimmedEmail.length <= 0){
      setEmailLoading(false);
      setNoEmail(true);
      return;
    }
  
    // Case 3: No password entered
    if (!emailCurrentPass) {
      setEmailLoading(false);
      setEmailWrongPassword(true);
      return;
    }
  
    const { error } = await updateEmail(currentEmail, emailCurrentPass, trimmedEmail);
  
    if (error) {
      if (error.message.includes("already registered")) {
        setEmailAlreadyUsed(true);
        message.error("That email is already in use.");
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setEmailWrongPassword(true);
        message.error("Incorrect password.");
      } else {
        message.error("Failed to update email. Please try again.");
      }
    } else {
      message.success("Please check your email to confirm the change.");
    }
  
    setEmailLoading(false);
  };

  const handleEmailClear = () => {
    setEmail('');
    setEmailPass('');
    setEmailAlreadyUsed(false);
    setEmailWrongPassword(false);
    setInvalidEmailDomain(false);
    setNoEmail(false);
  }

  // End of the email change

  // Start of password change 

  const handleChangePassword = async () => {
    if (!user) return;
  
    setPasswordLoading(true);

    setPasswordConfirmError(false);
    setWrongPasswordError(false);
    setEmptyPasswordError(false);
    setPasswordTooShort(false);
    setSamePassword(false);
  
    if(newPassword.length <= 0){
      setEmptyPasswordError(true);
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordTooShort(true);
      setPasswordLoading(false);
      return;
    }
  
    if (oldPassword === newPassword) {
      setSamePassword(true);
      message.warning("New password must be different from the current one.");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordConfirmError(true);
      setPasswordLoading(false);
      return;
    }
  
    const { error } = await updatePassword(user.email!, oldPassword, newPassword);
  
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        setWrongPasswordError(true);
      } else {
        message.error("Something went wrong while updating your password.");
      }
    } else {
      message.success("Password updated successfully!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  
    setPasswordLoading(false);
  };

  const handlePasswordClear = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordConfirmError(false);
    setWrongPasswordError(false);
    setEmptyPasswordError(false);
    setPasswordTooShort(false);
    setSamePassword(false);
  }

  // End of password change

  return (
    <div className='my-6 w-full max-w-6xl mx-auto'>
      {/** Header */}
      <div className='mb-6'>
        <div>
          <h1 className='text-text-primary font-bold font-montserrat text-xl lg:text-3xl'>User Preferences</h1>
          <p className='text-text-primary font-inter text-sm lg:text-base'>Manage your account settings</p>
        </div>
      </div>

        {/* Dark Mode Toggle Card */}
        <div className='border-2 border-text-primary text-text-primary rounded-lg px-6 py-6 mb-10 shadow-lg'>
      <div className='max-w-xl mx-auto flex items-center justify-between'>
        <div>
          <h1 className='text-text-primary font-bold font-montserrat text-xl mb-1'>Appearance</h1>
          <p className='text-sm font-inter text-gray-600 dark:text-gray'>Toggle between light and dark themes</p>
        </div>
    
        {/* Toggle Switch with Icon Inside */}
        <label className="relative inline-block w-16 h-9 cursor-pointer">
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
        className="sr-only peer"
      />
      {/* Background */}
      <span className="block bg-gray-300 peer-checked:bg-gray-800 w-full h-full rounded-full transition-colors duration-300" />
    
      {/* Sliding Icon Handle */}
      <span
        className={`
          absolute top-0.5 left-0.5 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center 
          transition-all duration-300
          ${theme === 'dark' ? 'translate-x-7' : ''}
        `}
      >
        {theme === 'dark' ? (
          <Moon size={18} className="text-brand-primary" />
        ) : (
          <Sun size={18} className="text-brand-primary" />
        )}
      </span>
    </label>
      </div>
    </div>


      <ProfilePictureUpload />

      {/** Notification Preferences */}
      <div className='border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 mb-10 shadow-lg'>
        <div className='max-w-xl mx-auto'>
          <h1 className='text-text-primary font-bold font-montserrat text-xl mb-6'>Notification Preferences</h1>
          <div className='flex items-center justify-between'>
            <p className='text-text-primary font-inter text-sm lg:text-base'>Enable event notifications</p>
            <NotificationToggle />
          </div>
        </div>
      </div>

      {/** Change Name */}
      <div className='border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 mb-10 shadow-lg'>
        <div className='max-w-xl mx-auto'> 
          <h1 className='text-text-primary font-bold font-montserrat text-xl mb-6'>Profile Information</h1>

          {/** Field Inputs */}
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

          {/** Errors and Buttons */}
          {nameError && (
            <p className="text-red-500 font-inter text-sm italic mb-4">
              No changes detected or fields are empty.
            </p>
          )}
          <div className='flex justify-end gap-4'>
            <button 
            onClick={handleSaveNameClear}
            className='bg-translucent 
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

      {/** Change Email */}
      <div className='border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 shadow-lg'>
        <div className='max-w-xl mx-auto'> 
          <h1 className='text-text-primary font-bold font-montserrat text-xl mb-6'>Email Information</h1>

          {/** Field Inputs */}
          <div className=''>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmailAlreadyUsed(false);
                setNoEmail(false);
                setEmail(e.target.value);
                setInvalidEmailDomain(!e.target.value.toLowerCase().endsWith('@bu.edu'));
              }}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${invalidEmailDomain || emailAlreadyUsed ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
            />
            <input
              type="password"
              name="email password"
              placeholder="Current Password"
              value={emailCurrentPass}
              onChange={(e) => setEmailPass(e.target.value)}
              className={`w-full text-text-primary font-inter border border-gray-300 px-4 py-3 rounded-md focus:outline-none ${emailWrongPassword ? "focus:border-red-500": " focus:border-text-primary"} mb-6`}
            />
          </div>

          {invalidEmailDomain && (
            <p className="text-red-500 font-inter text-sm italic mb-1">
              Email must be a BU email address.
            </p>
          )}

          {emailAlreadyUsed && (
            <p className="text-red-500 font-inter text-sm italic mb-1">
              This email is already in use.
            </p>
          )}

          {emailWrongPassword && (
            <p className="text-red-500 font-inter text-sm italic mb-4">
              Incorrect password. Please try again.
            </p>
          )}

          {noEmail && (
            <p className="text-red-500 font-inter text-sm italic mb-4">
              Please enter a BU email.
            </p>
          )}

          <div className='flex justify-end gap-4'>
            <button 
            onClick={handleEmailClear}
            className='bg-white 
            dark:bg-transparent
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
            onClick={handleUpdateEmail}
            className='bg-brand-primary 
            text-white font-poppins font-black 
              py-1.5 px-5 
              rounded-md 
              duration-300 ease-in hover:bg-hover-primary 
              flex items-center justify-center'
            
            >
              {emailLoading ?  
              <Loader className="animate-spin" size={30} style={{ animationDuration: '3s' }}/>
              : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/** Change Password */}
      <div className='border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 mt-10 shadow-lg'>
        <div className='max-w-xl mx-auto'> 
          <h1 className='text-brand-primary font-bold font-montserrat text-xl mb-6'>Change Password</h1>

          {/** Field Inputs */}
          <div className=''>
            <input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 rounded-md text-text-primary focus:outline-none ${
                wrongPassword ? 'focus:border-red-500' : 'focus:border-text-primary'
              } mb-4`}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full font-inter border border-gray-300 px-4 py-3 text-text-primary rounded-md focus:outline-none ${
                emptyPassword || passwordConfirmError ? 'focus:border-red-500' : 'focus:border-text-primary'
              } mb-4`}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full font-inter border text-text-primary border-gray-300 px-4 py-3 rounded-md focus:outline-none ${
                passwordConfirmError ? 'focus:border-red-500' : 'focus:border-text-primary'
              } mb-4`}
            />
          </div>

          {wrongPassword && (
            <p className="text-red-500 font-inter text-sm italic mb-2">Incorrect current password.</p>
          )}
          
          {passwordConfirmError && (
            <p className="text-red-500 font-inter text-sm italic mb-4">Passwords do not match.</p>
          )}
          
          {emptyPassword && (
            <p className="text-red-500 font-inter text-sm italic mb-4">Please enter a new password</p>
          )}
          
          {passwordTooShort && (
            <p className="text-red-500 font-inter text-sm italic mb-2">Password must be at least 8 characters long.</p>
          )}

          {samePassword && (
            <p className="text-red-500 font-inter text-sm italic mb-2">New password must be different from current password.</p>
          )}

          <div className='flex justify-end gap-4'>
            <button 
              onClick={handlePasswordClear}
              className='bg-white 
                dark:bg-transparent
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
              onClick={handleChangePassword}
              className='bg-brand-primary text-white font-poppins font-black py-1.5 px-5 rounded-md duration-300 ease-in hover:bg-hover-primary flex items-center justify-center'
            >
              {passwordLoading ?  
                <Loader className="animate-spin" size={30} style={{ animationDuration: '3s' }} />
                : 'Save'
              }
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Profile;
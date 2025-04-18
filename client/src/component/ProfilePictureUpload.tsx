'use client'

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const ProfilePictureUpload: React.FC = () => {
  const { user, avatarUrl, setAvatarUrl } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // react-dropzone onDrop callback
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // Handler function for uploading the avatar
  const handleUpload = async () => {
    if (!user || !selectedFile) return;

    setUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${user.id}/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setUploading(false);
      return;
    }

    // Retrieve the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update the avatar_path field in the database
    const { error: updateError } = await supabase
      .from('Users')
      .update({ avatar_path: filePath })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError.message);
      setUploading(false);
      return;
    }

    // Update the global state so that the header immediately reflects the new avatar
    setAvatarUrl(publicUrl);

    setUploading(false);
  };

  return (
    <div className="border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 mb-10 shadow-lg">
      <div className="max-w-xl mx-auto">
        <h2 className="text-text-primary font-bold font-montserrat text-xl mb-6">Profile Picture</h2>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <span>No Avatar</span>
          </div>
        )}

        {/* Use react-dropzone to select a file */}
        <section className="container">
          <div
            {...getRootProps({ className: 'dropzone border-dashed border-2 border-gray-400 p-4 rounded mb-4 cursor-pointer' })}
          >
            <input {...getInputProps()} />
            <p>Upload your avatar file. We recommend that you upload a square photo.</p>
          </div>
          {/* Display the selected file */}
          {selectedFile && (
            <aside>
              <h4 className="font-bold">Selected file:</h4>
              <ul>
                <li key={selectedFile.name}>
                  {selectedFile.name} - {selectedFile.size} bytes
                </li>
              </ul>
            </aside>
          )}
        </section>
        <div className='flex justify-end'>
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
            className={`bg-brand-primary 
              text-white font-poppins font-black 
                py-1.5 px-5 
                rounded-md 
                duration-300 ease-in hover:bg-hover-primary 
                flex items-center justify-center ${selectedFile ? "mt-4" : "mt-0"}`}
          >
            {uploading ?  
                <Loader className="animate-spin" size={30} style={{ animationDuration: '3s' }}/>
                : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;

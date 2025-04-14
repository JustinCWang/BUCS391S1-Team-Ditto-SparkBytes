// app/(app)/profile/ProfilePictureUpload.tsx
'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

const ProfilePictureUpload: React.FC = () => {
  const { user } = useAuth(); // 只使用 user
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 页面加载时获取当前用户头像信息
  useEffect(() => {
    if (!user) return;
    const fetchAvatar = async () => {
      const { data } = await supabase
        .from('Users')
        .select('avatar_path')
        .eq('user_id', user.id)
        .single();
      if (data && data.avatar_path) {
        const { data: { publicUrl } } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(data.avatar_path);
        setAvatarUrl(publicUrl);
      }
    };
    fetchAvatar();
  }, [user]);

  // react-dropzone 的 onDrop 回调
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  // 上传头像处理函数
  const handleUpload = async () => {
    if (!user || !selectedFile) return;

    setUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${user.id}/${fileName}`;

    // 上传到 Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      setUploading(false);
      return;
    }

    // 获取公开 URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    // 更新数据库中 avatar_path 字段
    const { error: updateError } = await supabase
      .from('Users')
      .update({ avatar_path: filePath })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError.message);
      setUploading(false);
      return;
    }

    // 更新本地显示
    setAvatarUrl(publicUrl);
    setUploading(false);
  };

  return (
    <div className="border-2 border-text-primary text-text-primary rounded-lg px-4 py-6 mb-10 shadow-lg">
      <div className='max-w-xl mx-auto'>
        <h2 className="text-text-primary font-bold font-montserrat text-xl mb-6">Profile Picture</h2>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full mb-4" />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <span>No Avatar</span>
          </div>
        )}

        {/* 使用 react-dropzone 进行文件选择 */}
        <section className="container">
          <div
            {...getRootProps({ className: 'dropzone border-dashed border-2 border-gray-400 p-4 rounded mb-4 cursor-pointer' })}
          >
            <input {...getInputProps()} />
            <p>Upload your avatar file. We recommend that you upload a square photo.</p>
          </div>
          {/* 可选：显示已选择的文件 */}
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

        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="mt-4 px-4 py-2 bg-brand-primary text-white rounded"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {uploading && <Loader className="animate-spin ml-2" size={24} />}
      </div>
    </div>
  );
};

export default ProfilePictureUpload;

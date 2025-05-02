'use client';

import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { userRole, fetchAllUsers } from "@/lib/user";
import { Loader } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { useTheme } from "@/context/ThemeContext";
import { UserRecord } from "@/types/supabase";

// Main Page component that wraps the content in a Suspense boundary
export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchName, setSearchName] = useState('');

  // Filter users based on first name search
  const filteredUsers = users.filter((u) =>
    u.first_name.toLowerCase().includes(searchName.toLowerCase())
  );

  // Toggle between admin and student roles for a given user
  const toggleAdmin = async (userId: string, currentRole: string) => {
    setIsUpdating(userId);
    const newRole = currentRole === 'admin' ? 'student' : 'admin';
  
    const { error } = await supabase
      .from('Users')
      .update({ role: newRole })
      .eq('user_id', userId);
  
    if (error) {
      console.error('Failed to update role:', error.message);
    } else {
      // Update local state with new role
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, role: newRole } : u
        )
      );

      // If current user demoted themselves, update their role state
      if (userId === user?.id) {
        const { data, error } = await userRole(user.id);
        if (!error) {
          setRole(data.role);
        }
      }
    }
  
    setIsUpdating(null);
  };  

  // Fetch current user's role when component mounts
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await userRole(user.id);
        if (error) {
          console.error("Error fetching role:", error.message);
        } else {
          setRole(data.role)
        }
      }
    };

    // Only redirect if auth is not loading and user is not logged in
    if (!authLoading && !user) {
      router.push('/');
    } else if (user) {
      fetchRole();
    }
  }, [user, authLoading, router]);

  // Redirect if user is not admin, otherwise fetch all users
  useEffect(() => {
    if (role && role !== "admin") {
      router.push('/dashboard');
    }

    const fetchUsers = async () => {
      const data = await fetchAllUsers();
      console.log(data)
      setUsers(data);
      setLoading(false);
    };

    fetchUsers();

  }, [role, router]);
  
  // Show loading state while authentication is being determined
  if (authLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
      </div>
    );
  }
  
  return (
    <div className="my-6">
      <div className="w-full max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-text-primary font-bold font-montserrat text-2xl lg:text-3xl">
          Admin Dashboard
        </h1>
        <p className="text-text-primary font-inter text-xs lg:text-base">
          Edit users status
        </p>

        {/* Search bar */}
        <div className="flex justify-end mt-6">
          <input
            type="text"
            placeholder="Search by first name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={`w-full font-inter px-4 py-3 rounded-md border focus:outline-none focus:border-text-primary ${
              isDark
                ? 'bg-[#1e1e1e] text-white placeholder-gray-500 border-gray-600'
                : 'bg-white text-black placeholder-gray-400 border-gray-300'
            }`}
          />
        </div>

        {/* Conditional loading spinner or user table */}
        {loading ? (
          <div className="w-full flex justify-center items-center h-[50vh]">
            <Loader className="animate-spin text-brand-primary" size={40} style={{ animationDuration: '3s' }} />
          </div>
        ) : (
          <div className="mt-4 border border-gray-200 rounded-lg text-text-primary overflow-hidden">
            <div className="overflow-x-auto w-full">
              <div className="max-h-[600px] overflow-y-auto w-full">
                <table className="min-w-[600px] w-full table-fixed text-left border-collapse">
                  <thead className={`${isDark ? 'bg-[#2a2a2c]' : 'bg-gray-100'}`}>
                    <tr className="text-sm font-semibold capitalize font-poppins tracking-wide">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`${isDark ? 'text-white' : 'text-text-primary'}`}>
                    {filteredUsers.map((u) => (
                      <tr key={u.user_id} className="border-t">
                        <td className="p-4 font-poppins text-sm whitespace-nowrap">{u.first_name} {u.last_name}</td>
                        <td className="p-4 font-poppins text-sm break-all">{u.bu_email}</td>
                        <td className="p-4 font-poppins text-sm capitalize">{u.role}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleAdmin(u.user_id, u.role)}
                            disabled={isUpdating === u.user_id}
                            className="bg-brand-primary 
                            text-white font-poppins font-black text-sm
                            cursor-pointer
                            py-1.5 px-3 
                            rounded-md 
                            duration-300 ease-in hover:bg-hover-primary 
                            flex items-center justify-center"
                          >
                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
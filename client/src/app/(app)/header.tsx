import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter, usePathname } from "next/navigation";
import '@ant-design/v5-patch-for-react-19';

import { Logout } from "@/lib/auth";

const { Header } = Layout;
const CustomHeader = () => {
  // Define the menu items with their keys, labels, and hrefs
  const menuItems: { key: string; label: string; href: string }[] = [
    { key: '0', label: 'Dashboard', href: '/dashboard' },
    { key: '1', label: 'Events', href: '/events' },
    { key: '2', label: 'Profile', href: '/profile' },
    { key: '3', label: 'Logout', href:''}
  ];

  // Get the router and pathname from Next.js navigation
  const router = useRouter();
  const pathname = usePathname();
  // State to keep track of the selected menu item key
  const [selectedKey, setSelectedKey] = useState('0');

  // Effect to update the selected key based on the current pathname
  useEffect(() => {
    const currentKey = menuItems.findIndex((item) => item.href === pathname).toString();
    setSelectedKey(currentKey);
  }, [pathname]);

  // Handle menu item click events
  const handleClick = (e: MenuInfo) => {
    if (e.key === '3') {
      Logout();
      return;
    }

    const parsedKey = parseInt(e.key); // Parse the key from the event to an integer
    if (parsedKey < 0 || parsedKey >= menuItems.length) return; // Check if the key is out of bounds
    router.push(menuItems[parsedKey].href); // Navigate to the href of the selected menu item
  };

  return (
    // Render the header with a logo and menu
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px', fontWeight: 'bold', marginRight: '20px' }}>
        Spark!Bytes
      </div>
      {/* Menu component with dark theme and horizontal mode */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]} // Highlights the menu item that matches the selectedKey
        onClick={handleClick} // Function to handle click events on menu item
        items={menuItems.map(item => ({
          key: item.key,
          label: item.label,
        }))}
        // Keeps all three titles on the same line (without collapsing into a dropdown)
        style={{ flex: 1 }}
      />
    </Header>
  );
};

export default CustomHeader;
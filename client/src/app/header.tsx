import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useRouter, usePathname } from "next/navigation";
import './globals.css';

const { Header } = Layout;

const CustomHeader = () => {
  const menuItems: { key: string; label: string; href: string }[] = [
    { key: '0', label: 'Home', href: '/' },
    { key: '1', label: 'Events', href: '/events' },
    { key: '2', label: 'About', href: '/about' },
    { key: '3', label: 'Profile', href: '/profile' },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState('0');

  useEffect(() => {
    const currentKey = menuItems.findIndex((item) => item.href === pathname).toString();
    setSelectedKey(currentKey);
  }, [pathname]);

  const handleClick = (e: MenuInfo) => {
    const parsedKey = parseInt(e.key);
    if (parsedKey < 0 || parsedKey >= menuItems.length) return;
    router.push(menuItems[parsedKey].href);
  };

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div className="logo" style={{ float: 'left', color: 'white', fontSize: '24px', fontWeight: 'bold', marginRight: '20px' }}>
        Spark!Bytes
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        items={menuItems.map(item => ({
          key: item.key,
          label: item.label,
        }))}
        style={{ flex: 1 }}
      />
    </Header>
  );
};

export default CustomHeader;
import { MenuOutlined } from "@ant-design/icons";
import { Menu, PageHeader } from "antd";
import { Header } from "antd/lib/layout/layout";
import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import { MenuNavs } from "./interface";

export default function Navbar() {
  const [currentPath, setCurrentPath] = React.useState("");
  const location = useLocation();

  const navLinks: MenuNavs[] = [
    {
      title: "Linear Regression",
      link: "/linear",
    },
    {
      title: "Object Detection",
      link: "/object_detection",
    },
    {
      title: "Image Generation",
      link: "/image_generation",
    },
  ];

  React.useEffect(() => {
    let paths = location.pathname.split("/");
    if (paths.length > 1) {
      setCurrentPath("/" + paths[1]);
    } else {
      setCurrentPath("");
    }
  }, [location]);

  return (
    <Header style={{ backgroundColor: "white", zIndex: 100 }}>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        selectedKeys={[currentPath]}
      >
        {navLinks.map((c, i) => (
          <Menu.Item key={c.link}>
            <NavLink to={c.link}>{c.title} </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Header>
  );
}

import { Menu, Layout } from "antd";
import React from "react";
import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { MenuNavs } from "./interface";
import { NavLink, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

/**
 *
 * Everything is under linear link
 */
export function LinearRegressionSider() {
  const [currentPath, setCurrentPath] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const navLinks: MenuNavs[] = [
    {
      title: "Simple Linear Regression",
      link: "/linear/simple-regression",
    },
  ];

  return (
    <Sider
      theme="light"
      style={{
        overflow: "auto",
        height: "100%",
        position: "fixed",
        left: 0,
      }}
    >
      <Menu theme="light" mode="vertical-left" selectedKeys={[currentPath]}>
        {navLinks.map((c, i) => (
          <Menu.Item key={c.link}>
            <NavLink to={c.link}>{c.title} </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

/**
 *
 * Everything is under object detection link
 */
export function ObjectDetectionSidebar() {
  const [currentPath, setCurrentPath] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const navLinks: MenuNavs[] = [
    {
      title: "SSD Model",
      link: "/object_detection/ssd",
    },
    {
      title: "Mobile Net",
      link: "/object_detection/mobile_net",
    },
    {
      title: "Facemask Detection",
      link: "/object_detection/facemask",
    },
  ];

  return (
    <Sider
      theme="light"
      style={{
        overflow: "auto",
        height: "100%",
        position: "fixed",
        left: 0,
      }}
    >
      <Menu theme="light" mode="vertical-left" selectedKeys={[currentPath]}>
        {navLinks.map((c, i) => (
          <Menu.Item key={c.link}>
            <NavLink to={c.link}>{c.title} </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

/**
 *
 * Everything is under image generation link
 */
export function ImageGenerationSidebar() {
  const [currentPath, setCurrentPath] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const navLinks: MenuNavs[] = [
    {
      title: "Style Transfer",
      link: "/image_generation/style",
    },
  ];

  return (
    <Sider
      theme="light"
      style={{
        overflow: "auto",
        height: "100%",
        position: "fixed",
        left: 0,
      }}
    >
      <Menu theme="light" mode="vertical-left" selectedKeys={[currentPath]}>
        {navLinks.map((c, i) => (
          <Menu.Item key={c.link}>
            <NavLink to={c.link}>{c.title} </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
}

import React from 'react';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, CodeOutlined, UserOutlined } from '@ant-design/icons';

const { Sider, Content, Footer } = Layout;

export const App: React.FC = () => {
  return (
    <Layout className="h100">
      <AppSideNavigation />
      <Layout>
        <Content id="app-content" />
        <Footer id="app-footer">Your Copyright Here ©2020</Footer>
      </Layout>
    </Layout>
  );
};

const AppSideNavigation: React.FC = () => {
  return (
    <Sider id="app-side-nav" trigger={null} collapsible collapsed={false}>
      <div className="logo" />
      <Menu theme="dark" mode="inline">
        <Menu.Item
          key="1"
          onClick={() => {
            window.location.href = '/dashboard';
          }}
        >
          <UserOutlined />
          <span>Dashboard</span>
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            window.location.href = '/dashboard/services';
          }}
        >
          <CodeOutlined />
          <span>Services</span>
        </Menu.Item>
        <Menu.Item
          key="3"
          onClick={() => {
            window.location.href = '/dashboard/servers';
          }}
        >
          <AppstoreOutlined />
          <span>Game Servers</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

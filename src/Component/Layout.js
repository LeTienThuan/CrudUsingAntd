import {Layout, Menu, Breadcrumb} from 'antd';
import {
    FormatPainterOutlined, ShoppingCartOutlined, UserOutlined,
} from '@ant-design/icons';

import {useEffect, useState} from "react";
import Customer from "./Customer";
import {NavLink, Redirect, Route, Routes, Switch, useLocation} from "react-router-dom";
import Product from "./Product";
import Order from "./Order";

const {Header, Content, Footer, Sider} = Layout;

const SiderDemo = () => {
    const [collapsed, setCollapsed] = useState(false);

    const onCollapse = collapsed => {
        setCollapsed(collapsed);
    };

    let location =  useLocation().pathname.replace('/','').trim()
    location === '' ? location='customer' : location = `${location}` ;

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={location} mode="inline">
                    <Menu.Item key="customer" icon={<UserOutlined/>}>
                        <NavLink to="/customer">Customer</NavLink>
                    </Menu.Item>
                    <Menu.Item key="product" icon={<FormatPainterOutlined/>}>
                        <NavLink to="/product">Product</NavLink>
                    </Menu.Item>
                    <Menu.Item key="order" icon={<ShoppingCartOutlined/>}>
                        <NavLink to="/order">Order</NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{location}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        <Switch>
                            <Route path="/" exact>
                                <Redirect to='/customer'/>
                            </Route>
                            <Route path='/customer'>
                                <Customer/>
                            </Route>
                            <Route path='/product'>
                                <Product/>
                            </Route>
                            <Route path='/order'>
                                <Order/>
                            </Route>
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
            </Layout>
        </Layout>
    );
}
export default SiderDemo;
// import NavigationHeader from "app/components/NavigationHeader/NavigationHeader";
import React from "react";
import { Outlet } from "react-router-dom";


export const Layout = () => (
    <>
    {/* <NavigationHeader></NavigationHeader> */}
    <Outlet />
    </>
)

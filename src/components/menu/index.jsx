import React, { memo } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import routeList from '@router/route';
import './index.scss';

export default memo(function Menu() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const selectNav = (route) => {
        navigate(route.path)
    };
    console.log(`Menu render: ${pathname}`);
    return (
        <ul className="nav">
            {
                routeList.map(route => {
                    return route.isNav && (
                        <li className={ pathname == route.path ? 'is-active' : ''} onClick={() => selectNav(route)} key={route.name}>
                            <i className={`iconfont icon-${route.icon}`}></i>
                            <span>{route.name}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
})

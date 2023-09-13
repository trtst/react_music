import React, { memo } from 'react';
import { Link } from "react-router-dom";
import Menu from '@components/menu'
import sideSty from './index.module.scss';
import LOGO from '@assets/img/logo.jpg';

export default memo(function Sidebar() {
    console.log('Sidebar render');
    return (
        <div className={sideSty.sidebar}>
            <Link className={sideSty.logo} to='/'><img src={LOGO} /></Link>
            <Menu />
        </div>
    )
})

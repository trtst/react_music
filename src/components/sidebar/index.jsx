import React, { memo } from 'react';
import { Link } from "react-router-dom";
import Menu from '@components/menu'
import sideSty from './index.module.scss';

export default memo(function Sidebar() {
    console.log('Sidebar render');
    return (
        <div className={sideSty.sidebar}>
            <Link className={sideSty.logo} to='/'><img src="src/assets/img/logo.jpg" /></Link>
            <Menu />
        </div>
    )
})

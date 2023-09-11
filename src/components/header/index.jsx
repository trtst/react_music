import React, { memo, useState } from 'react';
import { Dropdown } from 'antd';
import SearchBox from '@components/search';
import HeaderSty from './index.module.scss';
import { loginStore } from '@store/login';

const  items = [
    {
        key: 'preson',
        label: '个人主页'
    }, {
        key: 'logout',
        label: '退出'
    }
];

export default memo(function Header() {
    const [ themeMode, setThemeMode ] = useState(true);
    const [ isLogin, userInfo, loginModle, setLoginModle, setLogout ] = loginStore(state => [ 
        state.isLogin, 
        state.userInfo,
        state.loginModle,
        state.setLoginModle,
        state.setLogout
    ]);

    // 切换明暗主题
    const toggleTheme = () => {
        setThemeMode(!themeMode);
    }

    // 点击显示登录框
    const loginHandler = () => {
        setLoginModle(!loginModle);
    };

    // 退出登录操作
    const logoutHandler = () => {
        setLogout();
        localStorage.removeItem('isLogin');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cookie');
    };

    // 登录后，头像下拉菜单的操作
    const menuHandler = ({ key }) => {
        // 退出
        if (key == 'logout') {
            logoutHandler();
        }
    };
    
    console.log('Header render');
    return (
        <>
            <div className={HeaderSty.header}>
                {/* 搜索框 */}
                <SearchBox />
                
                {/* 用户操作：登录注册退出 */}
                <div className={HeaderSty['user-info']}>
                    {
                        isLogin ?
                            <Dropdown menu={{
                                items,
                                onClick: menuHandler
                            }}>
                                <div>
                                    <img className={HeaderSty.avatar} src={userInfo.avatarUrl} alt="" />
                                    <span>{userInfo.nickname}</span>
                                </div>
                            </Dropdown>
                        : <span className={HeaderSty['login-btn']} onClick={loginHandler}>登录</span>
                    }
                    
                </div>
                
                {/* 切换主题 */}
                <div className={HeaderSty['toggle-theme']}>
                    <div className={`${HeaderSty['theme-box']} ${themeMode ? ' active' : ''}`} onClick={toggleTheme}>
                        <div className={HeaderSty['theme-icon']}>
                            <i className="iconfont icon-light"></i>
                            <i className="iconfont icon-dark"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
});

import React, { useState } from 'react';
import { Modal } from 'antd';
import { loginStore } from '@store/index';
import QrLogin from './qr';
import PwdLogin from './pwd';
import PhoneLogin from './phone';
import loginSty from './scss/index.module.scss';

export default function Login() {
    const [ type, setType ] = useState('phone'); // 登录的方式，默认二维码登录 qr: 二维码登录  pwd: 账号密码登录  phone: 手机号快捷登录
    const loginModle = loginStore((state) => state.loginModle); 
    const setLoginModle = loginStore((state) => state.setLoginModle);

    // 取消登录弹窗
    const handleCancel = () => {
        setLoginModle(!loginModle);
    };

    const switchLogin = (type) => {
        return () => {
            setType(type);
        }
    }

    return (
        <Modal open={loginModle} footer={null} onCancel={handleCancel} width={'300px'}>
            <div className={loginSty.loginMain}>
                { type == 'qr' ? <QrLogin /> : ''}
                { type == 'pwd' ? <PwdLogin /> : ''}
                { type == 'phone' ? <PhoneLogin /> : ''}
            </div>
            <div className={loginSty.footer}>
                { type != 'qr' ? <span className={loginSty.loginBtn} onClick={switchLogin('qr')}>APP扫码登录</span> : '' }
                { type != 'pwd' ? <span className={loginSty.loginBtn} onClick={switchLogin('pwd')}>账号密码登录</span> : '' }
                { type != 'phone' ? <span className={loginSty.loginBtn} onClick={switchLogin('phone')}>手机号快捷登录</span> : '' }
            </div>
        </Modal>
    )
}

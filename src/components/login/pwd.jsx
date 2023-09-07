import React from 'react';
import { Button, Form, Input } from 'antd';
import { loginPwd } from '@apis/http';
import { loginStore } from '@store/index';
import PwdSty from './scss/pwd.module.scss';

export default function Pwd() {
    const setLogin = loginStore((state) => state.setLogin); 
    const setUserInfo = loginStore((state) => state.setUserInfo);
    const setLoginModle = loginStore((state) => state.setLoginModle);

    //账号密码登录
    const submitForm = async(val) => {
        if (val) {
            const { data: res } = await loginPwd(val);
    
            if (res.code !== 200) {
                proxy.$msg.error(res.message)
            } else {
                const userInfo = Object.assign({}, res.account, res.profile);

                window.localStorage.setItem('cookie', res.cookie);

                setLogin(true);
                setUserInfo(userInfo);
                setLoginModle(false);
            }
        }
    }
    return (
        <div className={PwdSty.pwd}>
            <div className={PwdSty.title}>邮箱账号登录</div>
            <div className={PwdSty.pwdMain}>
                <Form onFinish={submitForm}>
                    <Form.Item
                        name="email"
                        rules= {[
                            {
                              type: 'email',
                              message: '登录邮箱格式错误，请重新输入!',
                            },
                            {
                              required: true,
                              message: '请输入登录账号!',
                            },
                          ]}
                    >
                        <Input placeholder="请输入登录账号" allowClear className={PwdSty.ipt} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: '请输入登录密码!',
                        }]}
                    >
                        <Input.Password placeholder="请输入密码" allowClear className={PwdSty.ipt} />
                    </Form.Item>
                    <div className={PwdSty.forgetPwd}>忘记密码？</div>
                    <Button type="primary" htmlType="submit" className={PwdSty.submit}>登录</Button>
                </Form>
            </div>
        </div>
    )
}

import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, message } from 'antd';
import { sentCode, loginPhone } from '@apis/http';
import { countrycode } from '@utils/index';
import { loginStore } from '@store/index';
import phoneSty from './scss/phone.module.scss';

const { Option } = Select;
const prefixSelector = (
    <Form.Item name="ctcode" noStyle>
        <Select style={{ width: '80px' }} >
            {
                countrycode.map(item => <Option value={item.value} key={item.value}>+{item.value}</Option>)
            }
        </Select>
    </Form.Item>
);

export default function Phone() {
    const [ form ] = Form.useForm();
    const [ messageApi, contextHolder ] = message.useMessage();
    const phone = Form.useWatch('phone', form);
    const ctcode = Form.useWatch('ctcode', form);
    const [ count, setCount ] = useState(null);
    const setLogin = loginStore((state) => state.setLogin); 
    const setUserInfo = loginStore((state) => state.setUserInfo);
    const setLoginModle = loginStore((state) => state.setLoginModle);
    const timer = useRef(); // 定时器

    // 获取验证码
    const getCode = async() => {
        if (count) return;
        if (phone) {
            setCount(10);
            const { data: res } = await sentCode({ phone, ctcode });

            if (res.code !== 200) {
                messageApi.open({
                    type: 'error',
                    content: res.message
                });
            }
        } else {
            form.validateFields(['phone']);
        }
    };

    // 倒计时
    useEffect(()=>{
    	//如果设置倒计时且倒计时不为0
        if(count && count !== 0) {
            timer.current = setTimeout(()=>{
                setCount(count => count - 1)
            }, 1000);
        }

        //清楚延时器
        return () => {
            clearTimeout(timer.current);
        }
    },[count]);

    //手机号快捷登录
    const submitForm = async(val) => {

        if (val) {
            const { data: res } = await loginPhone(val);

            if (res.code !== 200) {
                messageApi.open({
                    type: 'error',
                    content: res.message
                });
            } else {
                const userInfo = Object.assign({}, res.account, res.profile);

                window.localStorage.setItem('cookie', res.cookie);

                setLogin(true);
                setUserInfo(userInfo);
                setLoginModle(false);

                messageApi.open({
                    type: 'success',
                    content: '登录成功'
                });
            }
        }
    }

    return (
        <div className={phoneSty.phone}>
            {contextHolder}
            <div className={phoneSty.title}>手机号快捷登录</div>
            <div className={phoneSty.phoneMain}>
                <Form
                    form={form}
                    initialValues={{ ctcode: '86' }}
                    onFinish={submitForm}
                >
                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号',
                            },
                        ]}
                    >
                        <Input
                            addonBefore={prefixSelector}
                            className='ipt'
                            placeholder="请输入手机号"
                        />
                    </Form.Item>
                    <Form.Item
                        name="captcha"
                        rules={[
                            {
                                required: true,
                                message: '验证码不能为空',
                            },
                        ]}
                    >
                        <div>
                            <Input className='ipt' style={{ width: 'calc(100% - 110px)'}} placeholder="请输入验证码" />
                            <span className={phoneSty.codeBtn} onClick={getCode}>
                                {
                                    count > 0 ?
                                    `${count}s` :
                                    '获取验证码'
                                }
                            </span>
                        </div>
                    </Form.Item>
                    <div className={phoneSty.forgetPwd}>接收语音验证码</div>
                    <Button type="primary" htmlType="submit" className={phoneSty.submit}>登录</Button>
                </Form>
            </div>
        </div>
    )
}

import React, { memo, useCallback, useEffect, useState } from 'react';
import { Image, App } from 'antd';
import { getQRkey, createQR, checkQR, getQRLogin } from '@apis/http';
import { loginStore } from '@store/index';
import QrSty from './scss/qr.module.scss';

let timer = null;        // 定时器，轮询扫码状态
export default memo(function QrLogin() {
    const { message } = App.useApp();
    const [ info, setInfo ] = useState({
        unikey: '',       // 初始登录生成的key
        oSrc: '',         // 通过key生成的二维码图片
        isShowExpired: false, // 二维码是否过期
    });
    const [ loading, setLoading ] = useState(true);
    const [ loginModle, setLogin, setUserInfo, setLoginModle ] = loginStore((state) => [ state.loginModle, state.setLogin, state.setUserInfo, state.setLoginModle ]); 

    // 组件进入初始化
    useEffect(() => {
        if (loginModle) {
            // 初始化查询key，渲染新的二维码
            refreshQR();
        }

        return () => {
            // 切换登录方式时，组件卸载，二维码不再轮询查看用户是否扫码，减少请求量
            clearInterval(timer);
        }
    }, [loginModle]);

    // 监听二维码的key是否变化，生成新的二维码图片
    useEffect(() => {
        // 二维码未过期的状态下，轮询检测二维码状态
        if(!info.isShowExpired && info.unikey) {
            createQRHandler();
            loginHandler();
        }
    }, [info.unikey, info.isShowExpired]);

    // 1、获取二维码登录需要 key
    const getQRHandler = async() => {
        const { data: res } = await getQRkey();

        if (res.code !== 200) {
            message.error({
                content: res.message
            });
        } else {
            setInfoHandler('unikey', res.data.unikey);
        }
    };
    // 2、根据获取的key，生成二维码图片
    const createQRHandler = async() => {
        const { data: res } = await createQR({ key: info.unikey});
    
        if (res.code !== 200) {
            message.error({
                content: res.message
            });
        } else {
            setInfoHandler('oSrc', res.data.qrimg);
            setLoading(false);
        }
    };
    // 3、轮询检测扫码状态接口
    const loginHandler = () => {
        clearInterval(timer);
        timer = setInterval(async () => {
            const { data: res } = await checkQR({ key: info.unikey });

            // 二维码过期
            if (res.code === 800) {
                clearInterval(timer);
                setInfoHandler('isShowExpired', true);
            }

            // 扫码授权成功，这一步会返回cookie
            if (res.code === 803) {
                clearInterval(timer);
                getQRLoginHandler(res.cookie);
            }
        }, 3000)
    };
    // 4、获取登录状态及用户信息
    const getQRLoginHandler = async(cookie) => {
        const { data: res } = await getQRLogin({ cookie });
    
        if (res.data.code !== 200) {
            message.error({
                content: res.message
            });
        } else {
            const userInfo = Object.assign({}, res.data.account, res.data.profile);

            // window.localStorage.setItem('cookie', cookie);

            setLogin(true);
            setUserInfo(userInfo);
            setLoginModle(false);
        }
    }

    // 当二维码重新过期后，点击刷新一下二维码
    const refreshQR = () => {
        setInfoHandler('isShowExpired', false);
        setLoading(true);
        getQRHandler();
    };

    // 统一处理设置二维码信息，避免异步处理，导致获取的信息不能及时更新
    const setInfoHandler = (type, val) => {
        setInfo(obj => {
            return Object.assign({}, obj, { [type]: val})
        })
    };

    return (
        <div className={QrSty.qr}>
            <div className={QrSty.title}>扫码登录</div>
            <div className={QrSty.tips}>使用 网易云音乐APP 扫码登录</div>
            <div className={`${QrSty.qrMain} ${info.isShowExpired && !loading ? 'qrExpired' : ''}`}>
                <div className={QrSty.qrImg}>
                    {
                        info.oSrc ?
                        <Image className={QrSty.img} preview={false} src={info.oSrc} alt="扫码登录" onClick={refreshQR} />
                        :
                        <i className="iconfont icon-placeholder"></i>
                    }
                </div>
                {
                    info.isShowExpired && !loading ?
                    <span className={QrSty.expiredBtn} onClick={refreshQR}>二维码过期，点击刷新</span>
                    : ''
                }
                {
                    loading || info.isShowExpired ?
                    <div className={`${QrSty.loadQR} ${info.isShowExpired ? 'active' : ''}`}></div>
                    : ''
                }
            </div>
        </div>
    )
});
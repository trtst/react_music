import React, { useEffect, useState } from 'react';
import { Image } from 'antd';
import { getQRkey, createQR, checkQR, getQRLogin } from '@apis/http';
import { loginStore } from '@store/index';
import QrSty from './scss/qr.module.scss';

let timer = null;        // 定时器，轮询扫码状态
export default function QrLogin() {
    const [ info, setInfo ] = useState({
        unikey: '',       // 二维码登录生成的key
        oSrc: '',         // 生成的二维码图片
        isShowExpired: true, // 二维码是否过期
    });
    const [ loading, setLoading ] = useState(true);
    const setLogin = loginStore((state) => state.setLogin); 
    const setUserInfo = loginStore((state) => state.setUserInfo);
    const setLoginModle = loginStore((state) => state.setLoginModle);

    // 组件进入初始化
    useEffect(() => {
        // 如果二维码过期了，需要重新查询key，渲染新的二维码；否则可以继续沿用二维码，直接去轮询检测二维码状态
        if (info.isShowExpired) {
            getQRHandler();
        } else {
            loginHandler();
        }

        return () => {
            // 切换登录方式时，组件卸载，二维码不再轮询查看用户是否扫码，减少请求量
            clearInterval(timer);
        }
    }, []);

    // 监听二维码的key是否变化，生成新的二维码图片
    useEffect(() => {
        if(info.unikey) {
            createQRHandler();
            loginHandler();
        }
    }, [info.unikey]);

    // 监听二维码是否过期
    useEffect(() => {
        if(!info.isShowExpired) {
            setLoading(false);
        }
    }, [info.isShowExpired]);

    // 1、获取二维码登录需要 key
    const getQRHandler = async() => {
        const { data: res } = await getQRkey();

        if (res.code !== 200) {
            proxy.$msg.error(res.message)
        } else {
            const obj = Object.assign({}, info, { unikey: res.data.unikey})
            setInfo(obj);
        }
    };
    // 2、根据获取的key，生成二维码图片
    const createQRHandler = async() => {
        const { data: res } = await createQR({ key: info.unikey});
    
        if (res.code !== 200) {
            proxy.$msg.error(res.message)
        } else {
            const obj = Object.assign({}, info, { oSrc: res.data.qrimg, isShowExpired: false })
            setInfo(obj);
        }
    };
    // 3、轮询检测扫码状态接口
    const checkQRHandler = async() => {
        const { data: res } = await checkQR({ key: info.unikey });
    
        return res;
    };

    // 4、获取登录状态及用户信息
    const getQRLoginHandler = async(cookie) => {
        const { data: res } = await getQRLogin({ cookie });
    
        if (res.data.code !== 200) {
            proxy.$msg.error(res.message)
        } else {
            const userInfo = Object.assign({}, res.data.account, res.data.profile);

            window.localStorage.setItem('cookie', cookie);

            setLogin(true);
            setUserInfo(userInfo);
            setLoginModle(false);
        }
    }

    const loginHandler = () => {
        clearInterval(timer);
        timer = setInterval(async () => {
            const statusRes = await checkQRHandler();
            
            // 二维码过期
            if (statusRes.code === 800) {
                clearInterval(timer);
                setInfo(...info, { isShowExpired: true });
            }

            // 扫码授权成功，这一步会返回cookie
            if (statusRes.code === 803) {
                clearInterval(timer);
                getQRLoginHandler(statusRes.cookie);
            }
        }, 3000)
    };

    // 当二维码重新过期后，点击刷新一下二维码
    const refreshQR = () => {
        setLoading(true);
        getQRHandler();
    }

    return (
        <div className={QrSty.qr}>
            <div className={QrSty.title}>扫码登录</div>
            <div className={QrSty.tips}>使用 网易云音乐APP 扫码登录</div>
            <div className={`${QrSty.qrMain} ${info.isShowExpired && !loading ? 'qrExpired' : ''}`}>
                <div className={QrSty.qrImg}>
                    {
                        info.oSrc ?
                        <Image className={QrSty.img} preview={false} src={info.oSrc} alt="扫码登录" /> :
                        <i className="iconfont icon-placeholder"></i>
                    }
                </div>
                {
                    info.isShowExpired && !loading ?
                    <span className={QrSty.expiredBtn} onClick={refreshQR}>二维码过期，点击刷新</span>
                    : ''
                }
                {
                    loading ?
                    <div className={QrSty.loadQR}></div>
                    : ''
                }
            </div>
        </div>
    )
}

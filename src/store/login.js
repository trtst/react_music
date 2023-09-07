import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const loginStore = create(
    persist((set) => ({
        isLogin: false,   // 是否登录状态 
        userInfo: null,   // 登录账户伈伈睍睍
        loginModle: false,// 登录框显隐状态
        setLogin: (flag) => set(() => ({ isLogin: flag})),
        setUserInfo: (info) => set(() => ({ userInfo: info})),
        setLoginModle: (flag) => set(() => ({ loginModle: flag})),
        setLogout: () => set(() => ({ isLogin: false, userInfo: null }))
    }), {
        name: 'USERINNFO',
        partialize: (state) => ({ 
            isLogin: state.isLogin,
            userInfo: state.userInfo,
        }),
    })
)

mountStoreDevtool('loginStore', loginStore);
export { loginStore }
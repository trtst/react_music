import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';

const playerSetStore = create(
    persist((set) => ({
        mode: 0,       // 播放模式  0循环播放、1单曲循环、2随机播放
        volume: .8,    // 播放音量
        lock: false,    // 播放条是否固定
        themeMode: '',    // 网站配色

        setPlayerSetting: (type, val) => {
            set({
                [type]: val
            });
        },
    }), {
        name: 'PLAYERSET',
    })
)

mountStoreDevtool('playerSetStore', playerSetStore);
export { playerSetStore }
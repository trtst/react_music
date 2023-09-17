import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { concatPlayList } from '@utils/util';

// 合并歌曲到播放列表查重
const concatList = (list, playList = []) => {
    const arr = list.filter(item => { return !item.license && !item.vip });
    console.log(arr);
    // filter过滤无版权及vip歌曲
    return concatPlayList(arr, playList)
};
// 当前歌曲在播放列表的索引
const findIndex = (list, playList) => {
    return playList.findIndex(d => { return d.id === list.id })
};

let timer = null;

const playListInfoStore = create(
    persist((set, get) => ({
        playList: [],        // 当前播放列表
        playIndex: 0,        // 当前音乐播放索引
        isPlayed: false,     // 当前是否播放歌曲

        tipsInfo: {
            visiable: false,
            text: ''
        },
    
        setPlayed: (flag) => set(() => ({ isPlayed: flag})),
        // 播放当前选中的歌曲
        selectPlay: (list) => {
            const playList = concatList(list, get().playList);
            const playIndex = findIndex(list[0], playList);
    
            set({
                playList,
                playIndex,
                tipsInfo: {
                    visiable: true,
                    text: '已开始播放'
                },
                isPlayed: true
            });

            clearTimer(set);
        },
        // 添加歌曲到当前播放列表
        addToList: (list) => {
            const playList = concatList(list, get().playList);
    
            set({
                playList,
                tipsInfo: {
                    visiable: true,
                    text: '已添加到播放列表'
                },
            });

            clearTimer(set);
        },
        // 播放歌曲列表里全部歌曲（清空当前播放列表）
        playAllSong (list) {
            const playList = concatList(list);
    
            set({
                playList,
                isPlayed: true,
                tipsInfo: {
                    visiable: true,
                    text: '已添加到播放列表'
                },
                playIndex: 0
            });

            clearTimer(set);
        },
        // 当前播放歌曲的索引值
        setPlayIndex(val = 0) {
            set({
                playIndex: val
            });
        },
        // 设置当前播放列表
        setPlayList(val = []) {
            set({
                playList: val
            });
        }
    }), {
        name: 'PLAYLIST',
        partialize: (state) => ({ 
            playList: state.playList,
            playIndex: state.playIndex,
        }),
    })
)

const clearTimer = (set) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
        set({
            tipsInfo: {
                visiable: false,
                text: ''
            },
        });
        clearTimeout(timer);
    }, 3000);
}

mountStoreDevtool('playListInfoStore', playListInfoStore);
export { playListInfoStore }

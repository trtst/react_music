import React, { useCallback, useState } from 'react';
import { Select, Spin } from 'antd';
import { serachSuggest } from '@apis/http';
import sty from './index.module.scss';

const TYPES = { songs: '单曲', artists: '歌手', albums: '专辑', playlists: '歌单' };
let timeout;
const getSerachInfo = (value, callback) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    
    if (value) {
        timeout = setTimeout(serachInfo(value, callback), 300);
    } else {
        callback([]);
    }
};

const serachInfo = (val, cb) => {
    return async() => {
        const { data: res } = await serachSuggest({ keywords: val })

        if (res.code !== 200) {
            return this.$msg.error('数据请求失败')
        }

        const newLists = res.result.order?.map(item => {
            return {
                label: TYPES[item],
                options: res.result[item].map(itm => {
                    let name = '';
                    if (item == 'songs' && itm.artists.length > 0 ) {
                        let arr = itm.artists.map(n => n.name)
                        name = ` - ${arr.join('/')}`
                    }
                    if (item == 'albums' && itm.artist ) {
                        name = ` - ${itm.artist.name}`
                    }
                    return {
                        label: `${itm.name} ${name}`,
                        value: itm.id,
                    }
                })
            }
        }) || [];

        cb(newLists);
    }
}

export default function SearchBox() {
    const [ suggest, setSuggest ] = useState([]);
    const [lists, setLists] = useState([]);
    const [value, setValue] = useState();

    const handleSearch = (val) => {
        getSerachInfo(val, setSuggest);
    }

    const handleChange = (val) => {
        setValue(val);
        console.log(val);
    }

//     const getSerachInfo = useCallback(async(val) => {
        
// console.log(newLists);
//         setSuggest(newLists);
//         setValue(val);
//     });

    return (
        <div className={sty.search}>
            <Select
                style={{
                    width: 200,
                }}
                showSearch
                value={value}
                placeholder = "音乐/视频/电台/用户"
                defaultActiveFirstOption={false}
                suffixIcon={null}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                options={suggest}
                getPopupContainer={triggerNode => triggerNode.parentElement}
            />
        </div>
    )
}

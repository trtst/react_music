import React, { useEffect, useState } from 'react';
import { Carousel, Skeleton, Image } from 'antd';
import { topArtists } from '@apis/http.js';
import singerSty from './scss/singer.module.scss';
import { Link } from 'react-router-dom';

const LIMIT = 36, COUNT = 12;
const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
export default function Singer() {
    const [ lists, setLists ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // 热门歌手
    const getArtists = async() => {
        setLoading(true);
        const { data: res } = await topArtists({ limit: LIMIT })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        setLists(() => splitGroup(res.artists, COUNT))
        setLoading(false);
    }

    const splitGroup = (array, subGroupLength) => {
        let index = 0;
        let newArray = [];
        while(index < array.length) {
            newArray.push(array.slice(index, index += subGroupLength));
        }
        return newArray;
    }

    useEffect(() => {
        getArtists();
    }, []);

    return (
        <div className={singerSty.singer}>
            <div className={singerSty.singerTitle}>
                热门歌手
            </div>
            <div className={singerSty.singerMain}>
                {
                    loading ?
                        <div className={singerSty.box}>
                            {
                                [...new Array(COUNT)].map((itm, idx) => 
                                    <Skeleton.Image active={true} key={idx} />
                                )
                            }
                        </div>
                    :
                    <Carousel effect="fade" autoplay >
                    {
                        lists.map((list, index) =>
                            <div className={singerSty.box} style={contentStyle} key={index}>
                                {
                                    list.map(item => 
                                        <Link className={singerSty.avatar} to="" key={item.id}>
                                            <Image preview={false} src={`${item.picUrl}?param=96y96`} />
                                        </Link>
                                    )
                                }
                            </div>
                        )
                    }
                    </Carousel>
                }
                
            </div>
        </div>
    )
}

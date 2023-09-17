import React, { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Image, App } from 'antd';
import { getBanner } from '@apis/http.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import {  Pagination, Autoplay } from 'swiper/modules';
import './scss/banner.scss';

const typeObj = {
    1: 'song',   // 单曲
    10: 'album',// 专辑
    100: 'playlist',// 歌单
    104: 'mv',// MV
    3000: 'url', //外链
};

export default memo(function Banner() {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [ list, setList ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    // 点击轮播图事件
    const pathHandler = info => {
        return () => {
            if (info.targetType == 3000) {
                window.open(info.url, '_blank')
            } else {
                if (typeObj[info.targetType]) {
                    navigate(`/${typeObj[info.targetType]}?id=${info.targetId}`);
                }
            }
        }
    };

    const getBannerHandler = async () => {
        // 获取轮播图数据
        const { data: res } = await getBanner()

        if (res.code !== 200) {
            return message.error({
                content: res.message
            });
        }

        setList(res.banners);
        setLoading(false);
    }

    useEffect(() => {
        getBannerHandler();
    }, []);

    return (
        <div className="banner">
            {
                <Skeleton loading={loading} active paragraph={false} className='Skeleton-banner'>
                    <Swiper
                        spaceBetween={50}
                        slidesPerView={3}
                        autoplay={{ delay: 3000 }}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className="banner_wrap"
                    >
                        { 
                            list.map(item => (
                                <SwiperSlide key={item.imageUrl} onClick={pathHandler(item)}>
                                    <Image className='banner_img' preview={false} src={item.imageUrl} />
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </Skeleton>
            }
        </div>
    )
})

import React, { memo } from 'react';
import { Image } from 'antd';
import itemSty from './scss/item.module.scss';
import { Link } from 'react-router-dom';

export default memo(function Item({list}) {
    return (
        <Link to={`/album/detail?id=${list.id}`} className={itemSty.item}>
            <div className={itemSty.faceImg}>
                <Image className='banner_img' preview={false} src={`${list.picUrl}?param=120y120`} />
            </div>
            <div className={itemSty.info}>
                <div className={itemSty.name}>{list.name}</div>
                <div className={itemSty.artist}>{list.artist.name}</div>
                <div className={itemSty.count}>
                    <span>{list.type == 'Single' ? '单曲' : list.type}</span>
                    <span>共{list.size}首</span>
                </div>
            </div>
        </Link>
    )
});

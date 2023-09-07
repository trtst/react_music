import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { formartNum } from '@utils/index';
import itemSty from './scss/item.module.scss';

export default function DjItem({ list }) {
    return (
        <Link to="" className={itemSty.djItem}>
            <div className={itemSty.faceImg}>
                <Image preview={false} src={`${list.picUrl}?param=120y120`} />
            </div>
            <div className={itemSty.info}>
                <div className={itemSty.name}><i className="iconfont icon-dj"></i>{list.name}</div>
                <div className={itemSty.rcmdtext}>{list.rcmdtext}</div>
                <div className={itemSty.count}><span>共{formartNum(list.programCount)}期</span> <span>订阅{formartNum(list.subCount)}次</span></div>
            </div>
        </Link>
    )
}

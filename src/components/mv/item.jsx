import React from 'react';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import sty from './scss/item.module.scss';
import { formartNum } from '@utils/index';

export default function MvItem({list, row}) {
    return (
        <Link to="" className={`${sty.item} ${row != 5 ? 'row_' + row : ''}`}>
            <div className={sty.faceImg}>
                <i className={`iconfont icon-mvlist ${sty['icon-mvlist']}`}></i>
                <Image className={sty.banner_img} preview={false} src={list.cover || list.imgurl} />
            </div>
            <div className={sty.info}>
                <div className={sty.name}>{list.name}</div>
                {
                   !list.publishTime ? <div className={sty.author}>{list.artistName}</div> : ''
                }
                <div className={sty.playCount}><i className="iconfont icon-mvlist"></i> {formartNum(list.playCount)}</div>
                
                {
                   list.publishTime ? <div className={sty.time}>发布时间：{list.publishTime}</div> : ''
                }
            </div>
        </Link>
    )
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'antd';
import { formartNum } from '@utils/index';
import sty from './scss/item.module.scss';

export default function Item({list}) {
    
    return (
        <div className={sty.item}>
            <Link className={sty.faceImg} to={`/playlist/detail?id=${list.id}`}>
                <Image className={sty.banner_img} preview={false} src={list.coverImgUrl} />
                <span className={sty.playCount}><i className="iconfont icon-playnum"></i><em>{formartNum(list.playCount)}</em> / {list.trackCount + '首'}</span>
            </Link>
            <div className={sty.info}>
                <Link to={`/playlist/detail?id=${list.id}`} className={sty.info_name}>{list.name}</Link>
                <div className={sty.tags}>
                    {
                        list && list.tags.map(tag =>
                            <Link to={`/playlist?cat=${tag}`} className={sty.tag} key={tag}>#{tag}</Link>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spin } from 'antd';
import { formartNum } from '@utils/index';
import sty from './scss/index.module.scss';

export default function SingerItem({list, ctx}) {
    const { followHandler, isOperEnd } = useContext(ctx);
    const [ isLoading, setisLoading ] = useState(false);

    const followed = () => {
        followHandler(list);
    };

    useEffect(() => {
        if (list.id == isOperEnd.id) {
            setisLoading(!isOperEnd.state)
        }
    }, [isOperEnd]);

    return (
        <Spin tip="Loading" spinning={isLoading} className={sty.singer_item}>
            <div className={sty.singer_item}>
                <div className={sty.item_bg}>
                    <img src={`${list.img1v1Url}?param=120y120`} alt=""  />
                </div>
                <Link to={`/singer/detail`} className={sty.item_img}>
                    <img src={`${list.img1v1Url}?param=200y200`} alt="" className={sty.item_author} />
                </Link>
                <div className={sty.item_follow} onClick={followed}><i className={`iconfont icon-collect${list.followed ? '-active' : ''}`}></i><span>{list.followed ? '已关注' :'关注TA'}</span></div>
                <div className={sty.item_info}>
                    <div className={sty.item_name}>
                        <Link className={sty.name} to={`/singer/detail?id=${list.id}`}>{list.name}</Link>
                        {
                            list.accountId && (
                                <Link to={`/user?id=${list.accountId}`}>
                                    <i className={`iconfont icon-singer`}></i>
                                </Link>
                            )
                        }
                    </div>
                    <div className={sty.item_count}>
                        <div className={sty.item_count_type}><span>单曲</span><em>{list.musicSize}</em></div>
                        <div className={`${sty.item_count_type } ${sty.item_count_album}`}><span>专辑</span><em>{list.albumSize}</em></div>
                        <div className={sty.item_count_type}><span>粉丝</span><em>{formartNum(list.fansCount)}</em></div>
                    </div>
                </div>
            </div>
        </Spin>
    )
}

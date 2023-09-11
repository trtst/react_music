import React, { useMemo, useState } from 'react';
import { Skeleton, Popconfirm } from 'antd';
import { loginStore } from '@store/login';
import { formatMsgTime } from '@utils/index';
import sty from './scss/item.module.scss';
import { Link } from 'react-router-dom';
import Reply from './reply';

export default function CommentItem({ lists, loading, commentHandler, likeComment}) {
    const [ isLogin, userInfo, setLoginModle ] = loginStore(state => [ state.isLogin, state.userInfo, state.setLoginModle ]);
    const [ replyId, setReplyId ]= useState(0);
    const [ replyIndex, setReplyIndex ]= useState(-1);

    // 删除评论
    const delComment = (item) => {
        return () => {
            commentHandler(0, '', item.commentId)
        }
    };

    // 点赞
    const likeCommentHandler = (item) => {
        return () => {
            likeComment(item)
        }
    };

    // 是否显示回复留言框
    const isShowReply = useMemo(() => {
        return (item, index) => {
            return (item.commentId === replyId && replyIndex === index) ? true : false
        }
    })

    // 回复评论
    const replyCommentShow = (item, index) => {
        return () => {
            if (!isLogin) {
                setLoginModle(true);
                return
            }
    
            const newId = (replyId == item.commentId && replyIndex == index) ? 0 : item.commentId;
            setReplyId(newId);
            setReplyIndex(index);
        }
    };

    const replyMsg = (reply) => {
        commentHandler(2, reply, replyId);
        setReplyId(0);
        setReplyIndex(-1);
    };

    const isLike = useMemo(() => {
        return (item) => {
            return item.liked ? 'active' : '';
        }
    });

    return (
        <>
            {
                loading ? (
                    <div className={sty.comment_item}>
                        <Skeleton avatar active={true} paragraph={{ rows: 3 }} />
                    </div>
                ) : (
                    lists.map((item, index) => 
                        <div className={sty.comment_item} key={`comment_${index}_${item.commentId}`}>
                            <Link to={`/user?id=${item.user.userId}`} className={sty.comment_avatar}>
                                <img src={`${item.user.avatarUrl}?param=120y120`} alt="" />
                            </Link>
                            <div className={sty.comment_info}>
                                <Link to={`/user?id=${item.user.userId}`}>
                                    { item.user.nickname }
                                </Link>
                                <div className={sty.comment_content}>
                                    { item.content }
                                </div>
                                {
                                    item.beReplied.map(replyItem => (
                                        <div className={sty.comment_reply} key={replyItem.beRepliedCommentId}>
                                            <Link to={`/user?id=${replyItem.user.userId}`}>{ replyItem.user.nickname }</Link>: { replyItem.content }
                                        </div>
                                    ))
                                }
                                <div className={sty.comment_footer}>
                                    <div className={sty.comment_time}>{ formatMsgTime(item.time)}</div>
                                    <div className={sty.comment_oper}>
                                        {
                                            userInfo && (userInfo.userId == item.user.userId) && (
                                                <Popconfirm
                                                    title="提示"
                                                    description="确定删除评论？"
                                                    onConfirm={delComment(item)}
                                                    okText="确定"
                                                    cancelText="取消"
                                                    overlayStyle={{
                                                        width: '250px'
                                                    }}
                                                >
                                                    <em className={sty.comment_del}><i className="iconfont icon-del"></i></em>
                                                </Popconfirm>
                                            )
                                        }
                                        <span className={isLike(item)} onClick={likeCommentHandler(item)}><i className="iconfont icon-praise"></i>({item.likedCount})</span>
                                        <span className={sty.replyComment} onClick={replyCommentShow(item, index)}><i className="iconfont icon-comment"></i></span>
                                    </div>
                                </div>
                                {
                                    item.isHot && (
                                        <div className={sty.isHot}>
                                            <i className="iconfont icon-hot"></i>
                                        </div>
                                    )
                                }
                                {
                                    isShowReply(item, index) && (
                                        <Reply replyMsg={replyMsg} info={item} />
                                    )
                                }
                            </div>
                        </div>
                    )
                )
            }
        </>
    )
}

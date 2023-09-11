import React, { useEffect, useState } from 'react';
import { loginStore } from '@store/login';
import { commentSong, commentMv, albumComment, comment, commentLike } from '@apis/http';
import CommentItem from './item';
import sty from './scss/index.module.scss';
import { Form, Input, Button, Pagination, message } from 'antd';

const MAXLen = 140;
export default function Comment({ id, type}) {
    const [messageApi, contextHolder] = message.useMessage();
    const [ isLogin, userInfo, setLoginModle ] = loginStore(state => [ state.isLogin, state.userInfo, state.setLoginModle ]);
    const [ lists, setLists ] = useState([]);         // 留言板列表
    const [ total, setTotal ] = useState(0);
    const [ loading, setLoading ] = useState(true);
    const [ form ] = Form.useForm();
    const [ params, setParams ] = useState({
        id,
        limit: 20,
        offset: 0,
        timestamp: new Date().valueOf()
    });

    // 获取页面评论
    const getComment = async(par) => {
        let info = null;
        setLoading(true);
        // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
        switch (type) {
            case 0:
                info = await commentSong(par);
            break
            case 1:
                info = await commentMv(par);
            break
            case 3:
                info = await albumComment(par);
            break
            case 5:
                // res = await commentVideo(par);
            break
        }

        if (info.data.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        const newHotLists = info.data.hotComments && info.data.hotComments.map(item => {
            item.isHot = true
            return item
        }) || [];

        setTotal(info.data.total);
        setLists([...newHotLists, ...info.data.comments]);
        setLoading(false);
    };

    // 发布留言
    const onFinish = (values) => {
        commentHandler(1, values.msg, id);
        form.resetFields();
    };

    // 留言分页
    const currentChange = (page) => {
        const newParams = {...params, offset: (page - 1) * params.limit};
        
        setParams(newParams);
        getComment(newParams);
    };

    // 发布/删除/回复评论
    const commentHandler = async(t, content, commentId) => {
        const msgTips = ['删除评论成功！', '评论成功！', '回复评论成功！'];
        const { data: res } = await comment({
            t, // 0删除 1发送 2回复
            type, // 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
            id, // 对应资源id
            content: content, // 发送的内容/对应内容的id
            commentId: commentId, // 回复的评论id
        })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }

        getComment(params);

        messageApi.open({
            type: 'success',
            content: msgTips[t],
        });
    };

    // 给评论点赞
    const likeComment = async(item) => {
        if (!isLogin) {
            setLoginModle(true);
            return
        }

        const { data: res } = await commentLike({ id, cid: item.commentId, t: Number(!item.liked), type })

        if (res.code !== 200) {
            return proxy.$msg.error('数据请求失败')
        }
        getComment(params);
    };

    useEffect(() => {
        const newParams = {...params, id, offset: 0 };
        
        setParams(newParams);
        getComment(newParams);
    }, [id]);

    return (
        <>
            {contextHolder}
            <div className={sty.comments}>
                <div className={sty.comment_hd}>
                    <h2>评论<em>共{total}条评论</em></h2>
                    <div className={sty.userInfo}>
                        <span>{userInfo.nickname}</span>
                        <img src={userInfo.avatarUrl} alt="" className={sty.avatar} />
                    </div>
                </div>
                <Form 
                    className={sty.comment_box}
                    form={form}
                    onFinish={onFinish}
                >
                    <div className={sty.comment_textarea}>
                        <Form.Item name="msg">
                            <Input.TextArea placeholder="期待你的神评论……"  showCount maxLength={MAXLen} />
                        </Form.Item>
                    </div>
                    <div className={sty.comment_box_footer}>
                        <Button type="primary" htmlType="submit"> 评论 </Button>
                    </div>
                </Form>
                <div className="comment_area">
                    {
                        lists.length > 0 && (
                            <>
                                <CommentItem 
                                    lists={lists} 
                                    loading={loading} 
                                    commentHandler={commentHandler}
                                    likeComment={likeComment}
                                />
                                <div className={sty.pagination}>
                                    <Pagination showSizeChanger={false} style={{textAlign: 'center'}} pageSize={params.limit} total={total} hideOnSinglePage={true} onChange={currentChange} />
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}

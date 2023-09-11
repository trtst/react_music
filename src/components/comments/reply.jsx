import React, { useState } from 'react';
import { Input, Button } from 'antd';
import sty from './scss/reply.module.scss';

const { TextArea } = Input;
const MAXLen = 140;
export default function ReplyComment({ info, replyMsg }) {
    const [ msg, setMsg ] = useState('');

    const onChange = (e) => {
        setMsg(e.target.value);
    }

    const subReplyComment = () => {
        replyMsg(msg);
    }

    return (
        <div className={sty.reply_comment}>
            <h3>我回复@{info.user.nickname}:</h3>
            <div className={sty.comment_textarea}>
                <TextArea showCount maxLength={MAXLen} onChange={onChange} placeholder="期待你的神评论……" />
            </div>
            <div className={sty.comment_box_footer}>
                <Button type="primary" onClick={subReplyComment}>评论</Button>
            </div>
        </div>
    )
}

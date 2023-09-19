import { useState, useEffect } from 'react';

// 监听媒体查询的hooks
function useMedia(query, val = false) {
    // 设置默认匹配的值
    const [ matches, setMatches ] = useState(val);
    // 媒体查询改变的事件
    const handleMatchChange = e => {
        setMatches(e.matches);
    };

    useEffect(() => {
        // 获取媒体查询MediaQueryList对象
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMatchChange);
        return () => mediaQuery.removeEventListener('change', handleMatchChange);
    }, [ query ]);

    return matches;
}

export {
    useMedia
};
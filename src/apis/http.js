import api from './instance';

// 二维码登录
// 1、调用此接口可生成一个 key
const getQRkey = () => { return api.get(`/login/qr/key?timestamp=${Date.now()}`, {}) };
/*
    * 2、二维码生成接口
    * 调用此接口可生成二维码图片的 base64 和二维码信息
    * 可选参数: qrimg 传入后会额外返回二维码图片 base64 编码
*/
const createQR = ({ key = '', qrimg = true }) => { return api.get(`/login/qr/create?key=${key}&qrimg=${qrimg}&timerstamp=${Date.now()}`, {}) };
// 3、二维码检测扫码状态接口
// 获取二维码扫码状态：800 为二维码过期；801 为等待扫码；802 为待确认；803 为授权登录成功(803 状态码下会返回 cookies)
const checkQR = ({ key = '' }) => { return api.get(`/login/qr/check?key=${key}&timestamp=${Date.now()}`, {}) };
// 4、根据返回的cookies，获取用户登录的状态
const getQRLogin = ({ cookie = '' }) => { return api.post(`/login/status?timestamp=${Date.now()}`, { cookie }) };

// 邮箱账号密码登录
const loginPwd = ({ email = '', password = '' }) => { return api.post(`/login`, {email, password }) };
// 发送验证码
const sentCode = ({ phone = '', ctcode = '86' }) => { return api.get(`/captcha/sent?phone=${phone}&ctcode=${ctcode}`, {})};
// 验证验证码
const verifyCode = ({ phone = '', ctcode = '86', captcha = '' }) => { return api.get(`/captcha/verify?phone=${phone}&ctcode=${ctcode}&captcha=${captcha}`, {})};
// 手机号快捷登录
const loginPhone = ({ phone = '', password = '', ctcode = '86', captcha = '' }) => { return api.post(`/login/cellphone`, {phone, password, countrycode: ctcode, captcha }) };
// 退出登录
const logout = () => { return api.get('/logout', {}) }


// 首页轮播图
const getBanner = () => { return api.get('/banner', {}) };

/* ********* 歌曲 ********* */
// 歌曲详情 多个id , 隔开
const songDetail = ({ ids = '', timestamp = 0 }) => { return api.post(`/song/detail?timestamp=${timestamp}`, { ids: ids }) }
// 获取相似音乐
const simiSong = ({ id = '' }) => { return api.get(`/simi/song?id=${id}`, {}) };
// 包含这首歌的歌单
const simiPlayList = ({ id = '' }) => { return api.get(`/simi/playlist?id=${id}`, {}) };
// 获取相似歌手 歌手ID
const simiArtist = ({ id = '' }) => { return api.get(`/simi/artist?id=${id}`, {}) };
// 获取最近 5 个听了这首歌的用户 歌曲 id
const simiUser = ({ id = '' }) => { return api.get(`/simi/user?id=${id}`, {}) };
// 歌曲相关视频
const mlog = ({ id = '', mvid = '', limit = 9 }) => { return api.get(`/mlog/music/rcmd?songid=${id}&mvid=${mvid}&limit=${limit}`, {}) };

/* ********* 歌曲评论 ********* */
// 歌曲评论
const commentSong = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/music?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
/*
    * 发送/删除评论
    * t: 0删除 1发送 2回复
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
    * id: 对应资源id
    * content: 发送的内容/对应内容的id
    * commentId: 回复的评论id
*/
const comment = ({ t = 1, type = 0, id = '', content = '', commentId = '' }) => { return api.get(`/comment?t=${t}&type=${type}&id=${id}&content=${content}&commentId=${commentId}`, {}) }
/*
    * 给评论点赞
    * id: 对应资源id
    * cid: 评论id
    * t: 是否点赞 1: 是  0: 取消
    * type: 0: 歌曲 1: mv 2: 歌单 3: 专辑  4: 电台 5: 视频 6: 动态
*/
const commentLike = ({ id = '', cid = '', t = 1, type = 0 }) => { return api.get(`/comment/like?id=${id}&cid=${cid}&t=${t}&type=${type}`, {}) }

/* ********* 歌手 ********* */
// 获取歌手描述
const artistDesc = ({ id = '' }) => { return api.get(`/artist/desc?id=${id}`, {}) }
// 歌手热门歌曲
const artists = ({ id = '' }) => { return api.get(`/artists?id=${id}`, {}) }
// 收藏/取消收藏歌手
const artistSub = ({ id = '', t = '1' }) => { return api.get(`/artist/sub?id=${id}&t=${t}`, {}) }
// 获取歌手专辑
const artistAlbum = ({ id = '', limit = 50, offset = 0 }) => { return api.get(`/artist/album?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌手 mv
const artistMv = ({ id = '', limit = 50, offset = 0 }) => { return api.get(`/artist/mv?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取相似歌手
const simiArtists = ({ id = '' }) => { return api.get(`/simi/artist?id=${id}`, {}) }
// 获取歌手详情
const artistDetail = ({ id = '' }) => { return api.get(`/artist/detail?id=${id}`, {}) }
// 获取歌手粉丝
const artistFans = ({ id = '', limit = 10, offset = 0 }) => { return api.get(`/artist/fans?id=${id}&limit=${limit}&offset=${offset}`, {}) }
// 获取歌手粉丝
const artistFansCount = ({ id = '' }) => { return api.get(`/artist/follow/count?id=${id}`, {}) }
// 获取歌手列表
/*
    * 给评论点赞
    * type: -1:全部; 1:男歌手; 2:女歌手; 3:乐队
    * area: -1:全部; 7华语; 96欧美; 8:日本; 16韩国; 0:其他
    * initial: 按首字母索引查找参数, 热门传-1, #传0
    * limit: 30
    * offset: 0
*/
const artistList = ({ type = -1, area = -1, initial = '', limit = 50, offset = 0, timestamp = 0 }) => { return api.get(`/artist/list?type=${type}&area=${area}&initial=${initial}&limit=${limit}&offset=${offset}&timestamp=${timestamp}`, {}) }


/* ********* 歌单相关 ********* */
// 热门歌单标签分类
const hotPlayList = () => { return api.get('/playlist/hot', {}) };
// 歌单列表
const playList = ({ order = 'hot', cat = '', limit = 50, offset = 0 }) => { return api.get(`/top/playlist?limit=${limit}&order=${order}&cat=${cat}&offset=${offset}`, {}) }
// 歌单详情
const playListDetail = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) };
// 歌单分类
const catlist = () => { return api.get('/playlist/catlist', {}) }
// 相关歌单推荐
const playlistRelated = ({ id = '' }) => { return api.get(`/related/playlist?id=${id}`, {}) }
// 歌单评论
const playlistComment = ({ id = '', limit = 20, offset = 0, before = 0 }) => { return api.get(`/comment/playlist?id=${id}&limit=${limit}&offset=${offset}&before=${before}`, {}) }
// 收藏、取消歌单 1：收藏 2取消
const subPlayList = ({ t = 1, id = '' }) => { return api.get(`/playlist/subscribe?t=${t}&id=${id}`, {}) }
// 歌单收藏用户
const playlistSCollect = ({ id = '', limit = 20, offset = 0 }) => { return api.get(`/playlist/subscribers?id=${id}&limit=${limit}&offset=${offset}`, {}) }

/* ********* 专辑相关 ********* */
// 获取专辑内容
const album = ({ id = '' }) => { return api.get(`/album?id=${id}`, {}) };
const albumDynamic = ({ id = '' }) => { return api.get(`/album/detail/dynamic?id=${id}`, {}) }
const albumSub = ({ id = '', t = 1 }) => { return api.get(`/album/sub?id=${id}&t=${t}`, {}) }
// 专辑评论
const albumComment = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/album?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }

// 新碟上架
const topAlbum = ({ limit = 20, offset = 0, area = 'all', type = 'new', year = '', month = '' }) => { return api.get(`/top/album?limit=${limit}&offset=${offset}&area=${area}&type=${type}&year=${year}&month=${month}`, {}) }

/* ********* 排行榜 ********* */
// 排行榜
const toplist = () => { return api.get('/toplist', {}) }
// 排行榜歌单列表
const topRankList = ({ id = '', s = 8 }) => { return api.get(`/playlist/detail?id=${id}&s=${s}`, {}) }
// 所有榜单内容摘要
const topListDetail = () => { return api.get('/toplist/detail', {}) }

/* ********* MV ********* */
// 获取 mv
const mv = ({ area = '', type = '', order = '', limit = 50, offset = 0 }) => { return api.get(`/mv/all?area=${area}&type=${type}&order=${order}&limit=${limit}&offset=${offset}`, {}) }
// 获取 mv详情
const mvDetail = ({ id = '' }) => { return api.get(`/mv/detail?mvid=${id}`, {}) }
// 获取 地址
const mvUrl = ({ id = '', r = 1080 }) => { return api.get(`/mv/url?id=${id}&r=${r}`, {}) }
// 获取mv评论
const commentMv = ({ id = '', limit = 20, offset = 0, before = 0, timestamp = 0 }) => { return api.get(`/comment/mv?id=${id}&limit=${limit}&offset=${offset}&before=${before}&timestamp=${timestamp}`, {}) }
// 相似mv
const simiMv = ({ id = '' }) => { return api.get(`/simi/mv?mvid=${id}`, {}) }

// 热门歌手
const topArtists = ({ limit = 30, offset = 0 }) => { return api.get(`/top/artists?limit=${limit}&offset=${offset}`, {}) }

// 热门电台
const getHotDj = ({ limit = 30, offset = 0 }) => { return api.get(`/dj/hot?limit=${limit}&offset=${offset}`, {}) } 

// 歌词
const lyrics = ({ id = '' }) => { return api.get(`/lyric?id=${id}`, {}) }
export {
    getQRkey,
    createQR,
    checkQR,
    getQRLogin,

    loginPwd,
    sentCode,
    verifyCode,
    loginPhone,
    logout,

    getBanner,
    catlist,
    playlistRelated,
    playlistComment,
    subPlayList,
    hotPlayList,
    playList,
    playListDetail,
    playlistSCollect,
    topListDetail,
    topAlbum,
    toplist,
    topRankList,

    songDetail,
    simiSong,
    simiPlayList,
    simiArtist,
    simiUser,
    mlog,

    commentSong,
    comment,
    commentLike,

    artistDesc,
    artists, 
    artistSub, 
    artistMv,
    artistList,
    
    mv,
    mvDetail,
    mvUrl,
    commentMv,
    simiMv,

    album,
    albumDynamic,
    albumSub,
    albumComment,
    artistAlbum,
    simiArtists,
    artistDetail,
    artistFans,
    artistFansCount,

    topArtists,

    getHotDj,

    lyrics
}
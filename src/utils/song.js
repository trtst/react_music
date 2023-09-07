import { formatMsgTime, formatSongTime } from '@utils/index';


export default class Song {
    constructor ({
        id,
        name,
        mvId,
        singer,
        album,
        alia,
        duration,
        milliseconds,
        url,
        vip,
        license,
        publishTime
    }) {
        this.id = id
        this.name = name
        this.mvId = mvId
        this.singer = singer
        this.album = album
        this.alia = alia
        this.duration = duration
        this.milliseconds = milliseconds
        this.url = url
        this.vip = vip
        this.license = license
        this.publishTime = publishTime
    }
}

export function formatSongInfo (params) {
    return new Song({
        id: String(params.id),
        name: params.name,
        mvId: params.mv || params.mvid,
        singer: params.ar || params.artists,
        album: params.al || params.album,
        alia: params.alia || params.alias,
        vip: params.fee === 1,
        license: params.license,
        duration: formatSongTime(params.dt || params.duration),
        milliseconds: (params.dt || params.duration) / 1000, // 不用duration是因为时间多次转换后，会有误差，导致进度条实时更新会有偏移，但无伤大雅
        url: `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`,
        publishTime: formatMsgTime(params.publishTime)
    })
}

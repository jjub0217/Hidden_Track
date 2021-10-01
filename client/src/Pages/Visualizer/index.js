import React, { Component, createRef } from 'react';
import playPause from '../../assets/playPause.png';
import axios from 'axios'
import './index.scss'


axios.defaults.withCredentials = true;
// Changing Variables
let ctx

// constants
const width = window.innerWidth;
const height = window.innerHeight;
console.log('dd')

class Canvas extends Component {
    constructor(props) {
        super(props)
        // this.trackId=localStorage.getItem('trackId')
        // console.log(this.trackId)
        // this.track = {}
        // axios.get(`${process.env.REACT_APP_API_URL}/track/${this.trackId}`)
        //                     .then(res =>  {
        //                         this.track = res.data
        //                         console.log(res.data)
        //                     })
        //                     .catch(err => console.log(err))
        // await this.getTrackDetail()
        this.track = {
            id: localStorage.getItem('trackId'),
            title: localStorage.getItem('title'),
            nickName: localStorage.getItem('nickName'),
            soundtrack: localStorage.getItem('soundTrack'), 
            img: localStorage.getItem('img')
        }
        console.log(this.track)
        this.audio = new Audio();
        // this.audio.src = this.track.soundtrack
        this.audio.volume = 0.5;
        this.audio.crossOrigin = "use-credentials"
        this.img = new Image();
        this.canvas = createRef();
        // this.track = localStorage.getItem('trackDetail')
        // this.audio.crossOrigin = "use-credentials"; // 자격증명을 하는거 쿠키 헤더
        // this.audio.crossOrigin = "anonymous"; //익명으로 요청보내는건데 자격증명 x default header로 확인하는거같음
    }

    state = {
        title: '제목',
        nickName: '닉',
        soundtrack: 'https://hidden-track-bucket.s3.ap-northeast-2.amazonaws.com/trackfile/6251633000517290.mp3',

    }
    // getTrackDetail = () => {
    //     return 
    // } 

    // getData = () => {
        
    // } 

    getUrl = () => {
        axios.get(`${this.track.soundtrack}`).then(res => {
            console.log(res)
            console.log(res.status)
            this.audio.src=res.config.url
            // this.audio.src=this.track.soundtrack
        })
    }

    componentDidMount () {
        console.log(this.track)
        // this.getUrl()
        this.img.src = this.track.img
        console.log('오디오', this.audio)
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.context.createMediaElementSource(this.audio);
        this.analyser = this.context.createAnalyser();
        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
        this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
        this.analyser.disconnect();
        this.source.disconnect();
    }

    animationLooper(canvas) {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        this.analyser.fftSize = 512;
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = this.frequency_array;
        // const barWidth = 5;
        const barWidth = 3.5;
        let barHeight;
        let x = 0;
        this.drawBar(bufferLength, x, barWidth, barHeight, dataArray, canvas);
    }

    imgLoad (canvas, img) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, Math.PI * 2);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(img, canvas.width / 2 - 500 / 2, canvas.height / 2 - 500 / 2, 500, 500);
        ctx.restore();
    }

    drawBar(bufferLength, x, barWidth, barHeight, dataArray, canvas) {
        for (let i = 0; i < bufferLength; i++) {
            // barHeight = dataArray[i] * 1.8 + 225;
            barHeight = dataArray[i] * 1.3 + 253;
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            // ctx.rotate(i * Math.PI * 2.315 / bufferLength);
            // ctx.rotate(i * Math.PI * 4 / bufferLength);
            ctx.rotate(i * Math.PI * 8.318 / bufferLength);
            // ctx.fillStyle = 'white'
            // ctx.fillRect(0,1, barWidth, barHeight + 2)
            // const red = i * barHeight / 10;
            // const green = i * 4;
            // const blue = barHeight;
            // ctx.fillStyle = 'white';
            const hue = i * 4;
            // ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
            ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
            ctx.fillRect(0, 0, barWidth, barHeight);
            x += barWidth;
            ctx.restore();
        }
        this.imgLoad(canvas, this.img)
    }



    togglePlay = () => {
        console.log('플레이때 오디오', this.audio)
        if(this.audio.paused) {
            if(!this.audio.src) {
                console.log('아직 등록되지 않음')
                this.getUrl()
            }
            console.log('현재 정지상태 재생 실행', this.context)
            this.audio.play();
            this.rafId = requestAnimationFrame(this.tick);
        } else {
            this.audio.pause();
        cancelAnimationFrame(this.rafId);
        }
    }

    tick = () => {
        this.animationLooper(this.canvas.current);
        this.analyser.getByteFrequencyData(this.frequency_array);
        this.rafId = requestAnimationFrame(this.tick);
    }

    render() {

        return (
            <div id='visualizer'>
                {this.track.title?
                <>
                    <button
                    className='go-main-button' onClick={() => {
                        this.props.history.push('/')
                        localStorage.removeItem('title');
                        localStorage.removeItem('nickName');
                        localStorage.removeItem('soundTrack');
                        localStorage.removeItem('img');
                    }}
                    >Go Main
                    </button>
                    <div className='inner-circle-control'>
                    <div className='inner-circle-title'>{this.state.title}</div>
                    <div className='inner-circle-artist'>{this.state.nickName}</div>
                    <button className='inner-circle-button' onClick={() => { this.togglePlay(); }}>
                        <img src={playPause} style={{ width: '50px', height: '50px' }} alt='play/pause' />
                    </button>
                    </div>
                    <canvas
                    id='canvas'
                    ref={this.canvas}
                    />
                </>
                :<h1 className="Bad" >잘못된 접근입니다.</h1>}
            </div>
            )
        
    }
}

export default Canvas;
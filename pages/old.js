import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRef } from 'react'

export default function Home() {

  const clapRef = useRef(null);
  const cheerRef = useRef(null);
  const booRef = useRef(null);
  const drumRef = useRef(null);
  
  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen bg-slate-900 flex flex-col items-center justify-center text-white'>
          <h1 className='text-7xl mb-4'>好好你好</h1>
          <button 
            className='text-5xl my-4'
            onClick={()=>{
            cheerRef.current.pause()
            cheerRef.current.currentTime = 0;
            booRef.current.pause()
            booRef.current.currentTime = 0;
            drumRef.current.pause()
            drumRef.current.currentTime = 0;

            clapRef.current.play()
          }}>
            拍手
          </button>
          <button 
            className='text-5xl my-4'
            onClick={()=>{
            clapRef.current.pause()
            clapRef.current.currentTime = 0;
            booRef.current.pause()
            booRef.current.currentTime = 0;
            drumRef.current.pause()
            drumRef.current.currentTime = 0;

            cheerRef.current.play()
          }}>
            歡呼
          </button>
          <button 
            className='text-5xl my-4'
            onClick={()=>{
            clapRef.current.pause()
            clapRef.current.currentTime = 0;
            cheerRef.current.pause()
            cheerRef.current.currentTime = 0;
            drumRef.current.pause()
            drumRef.current.currentTime = 0;

            booRef.current.play()
          }}>
            嘘声
          </button>
          <button 
            className='text-5xl my-4'
            onClick={()=>{
            clapRef.current.pause()
            clapRef.current.currentTime = 0;
            cheerRef.current.pause()
            cheerRef.current.currentTime = 0;
            booRef.current.pause()
            booRef.current.currentTime = 0;

            drumRef.current.play()
          }}>
            擊鼓
          </button>
          <audio ref={clapRef} src="audio/clap_hands.mp3">
            Your browser does not support the <code>audio</code> element.
          </audio>
          <audio ref={cheerRef} src="audio/crowd_cheer.mp3">
            Your browser does not support the <code>audio</code> element.
          </audio>
          <audio ref={booRef} src="audio/crowd_boo.mp3">
            Your browser does not support the <code>audio</code> element.
          </audio>
          <audio ref={drumRef} src="audio/joke_drum.mp3">
            Your browser does not support the <code>audio</code> element.
          </audio>
      </main>
    </div>
  )
}

import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import React from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';

export default function Library() {

	const [sounds, setSounds] = useState([]);
	
	const router = useRouter();
	console.log(router.query.list_id);

	

	
		
	// setSounds(soundLinks);
	
	useEffect(() => {
		console.log('using use effect')
		if (router.query.list_id === 'freelist') {
			console.log(JSON.parse(localStorage.getItem("nonUserList")).sounds)
			const soundLinks = JSON.parse(localStorage.getItem("nonUserList")).sounds
			// const soundLinks = [
			// 	{
			// 		action: "蟋蟀",
			// 		link: "audio/crickets.wav"
			// 	},
			// 	{
			// 		action: "放屁",
			// 		link: "audio/fart.wav"
			// 	},
			// ];
			setSounds(soundLinks);
			return
		}

		const soundLinks = [
			{
				action: "拍手",
				link: "audio/clap_hands.mp3"
			},
			{
				action: "歡呼",
				link: "audio/crowd_cheer.mp3"
			},
			{
				action: "嘘声",
				link: "audio/crowd_boo.mp3"
			},
			{
				action: "擊鼓",
				link: "audio/joke_drum.mp3"
			},
			{
				action: "蟋蟀",
				link: "audio/crickets.wav"
			},
			{
				action: "放屁",
				link: "audio/fart.wav"
			},
		];
		setSounds(soundLinks);
	}, [router.query.list_id])
	
	
	const elementRefs = useRef([]);
	sounds?.forEach((_, index) => {
			elementRefs.current[index] = React.createRef();
		});
	// sounds.length > 0 ? console.log('greater') : console.log('not')

  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white'>
				<Navbar />
				<section>
					<article className='p-2'>
						<h1 className="text-2xl">生日快樂皓皓</h1>
					</article>
					<ul className="p-2 flex flex-col gap-4">
						{sounds?.map((sound, index) => (
							<li key={index}>
								<button
									className="w-full bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md"
									onClick={() => {
										elementRefs.current.forEach((ref, refIndex) => {
											if (refIndex !== index) {
												elementRefs.current[refIndex].current.pause()
												elementRefs.current[refIndex].current.currentTime = 0
											}
										})
										if (!elementRefs.current[index].current.paused) {
											elementRefs.current[index].current.currentTime = 0;
										}
										elementRefs.current[index].current.play()
									}}
								>{sound.action}</button>
								<audio ref={elementRefs.current[index]} src={sound.link}>
									Your browser does not support the <code>audio</code> element.
								</audio>
							</li>
						))}
					</ul>
				</section>
      </main>
    </div>
  )
}

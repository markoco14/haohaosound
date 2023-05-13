import Head from 'next/head'
import { useRef } from 'react'
import Link from 'next/link'
import React from 'react';

export default function Library() {
	
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
		{
			action: "beep-down",
			link: "audio/beep-down.wav"
		},
		{
			action: "bullshit",
			link: "audio/bullshit.wav"
		},
		{
			action: "lose",
			link: "audio/lose.wav"
		},
		{
			action: "fail",
			link: "audio/gameover.wav"
		},
	];

	const elementRefs = useRef([]);

	soundLinks.forEach((_, index) => {
    elementRefs.current[index] = React.createRef();
  });

  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='min-h-screen bg-gradient-to-b from-slate-900 to-slate-700 flex flex-col text-white'>
				<nav>
					<Link href="/">Home</Link>
					<Link href="/library">Library</Link>
					<Link href="/lists">My Lists</Link>
				</nav>
				<section>
					<p>Sound Library</p>
					<ul>
						{soundLinks.map((sound, index) => (
							<li key={index}>
								<button
									className='text-5xl my-4'
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

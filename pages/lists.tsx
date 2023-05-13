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
				<nav className='flex gap-2 p-2'>
					<Link href="/">Home</Link>
					<Link href="/library">Library</Link>
					<Link href="/lists">My Lists</Link>
				</nav>
				<article className='p-2'>
					<h2 className='text-2xl'>Your Quick Sound Lists</h2>
					<p>Make the perfect quick lists for any situation. Choose 6 sounds and play them at the perfect moment.</p>
					<small>You can make one free list. Please sign in to make more lists.</small>
				</article>
				<ul className='p-2'>	
					<Link href="/your-freebie-list">
						<li className="bg-gray-500 p-4 active:scale-95 active:bg-gray-900 active:rounded-md ease-in-out duration-200 hover:bg-gray-700">
							A List from Us to You
						</li>
					</Link>
				</ul>
				{/* CREATE BUTTON */}
				{/* 
					this button will pop up a modal
					and let users choose a list title
					and let them view all the sounds in the library
					and select each one they want to add
					it will total how many they have
					and stop them at 6 sounds
					users can only store 1 list if no session
					list stored on device local storage
					this is fine because they probably won't want to access these lists on devices other than their phones
					then they can sign up if it becomes a problem
					(perhaps when using a different device like ipad or computer in a classroom)
				*/}
				<button
					onClick={() => console.log("it works")}
					className='absolute bottom-0 left-0 w-full bg-green-700 px-4 py-4 rounded-t-xl active:bg-green-900'
					>
					Create New
				</button>
      </main>
    </div>
  )
}

import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import React from 'react';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabaseClient';


export async function getServerSideProps() {
	let { data, error } = await supabase.from('lists')
	.select('*')
	.eq('user_id', '0')
	.single()

	return {
		props: {
			list: data
		},
	}
}

export default function Lists({ list }) {

	useEffect(() => {
		const freeList = JSON.parse(localStorage.getItem("nonUserList"))
		if (!freeList) {
			console.log("No list found")
			return
		}
		setLocalList(freeList)
		console.log(freeList)
	}, [])

	const [localList, setLocalList] = useState<any>(undefined)
	// console.log(list)

  return (
    <>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white'>
				<Navbar></Navbar>
				<article className='p-2 sm:flex sm:justify-between'>
					<h1 className='text-2xl'>你的聲音列表</h1>

					{/* CREATE BUTTON */}
					<button
						onClick={() => {
							console.log("it works")
							const previouslySaved = localStorage.getItem("nonUserList")
							if (!previouslySaved) {

								localStorage.setItem("nonUserList", JSON.stringify({
									"name": "freelist", 
									"sounds": [{
										name: "蟋蟀",
										audio_url: "audio/crickets.wav"
									},
									{
										name: "放屁",
										audio_url: "audio/fart.wav"
									}]
								}));
								// localStorage.removeItem("nonUserList");
								// console.log(JSON.parse(localStorage.getItem("nonUserList")))
								setLocalList(JSON.parse(localStorage.getItem("nonUserList")));
								return
							}

							alert("You already have one free list. Edit that one or delete it to make a new one.")
							
						}}
						className='absolute bottom-0 left-0 w-full bg-green-600 px-4 py-4 rounded-t-xl active:bg-green-900 sm:relative sm:max-w-fit sm:rounded-md sm:active:scale-90 ease-in-out duration-200'
					>
						Create New
					</button>
				</article>
				<ul className='p-2 flex flex-col gap-2'>
					{/* FREE LIST FROM DB FOR EVERYONE (HAOHAO'S BIRTHDAY LIST) */}
					<li className='flex justify-between'>
						<Link 
							href={list.url} 
							className="bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md"
						>
							<span>{list.name}</span>
						</Link>
					</li>
					{/* LOCAL LIST IF YOU CHOOSE TO CREATE ONE */}
					{localList ? 
						<li className='flex justify-between'>
							<Link 
								href={"freelist"}
								className="bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md flex justify-between"
							>
								{localList.name} 
							</Link>
							<button onClick={() => {
								console.log("editing")
							}}>
								Edit
							</button>
							<button onClick={() => {
								localStorage.removeItem("nonUserList")
								setLocalList(undefined)
							}}>
								Delete
							</button>
						</li> 
						: 
						null
					}
					{/* YOUR PERSONAL LISTS IF REGISTERED WILL GO HERE */}
					{/* NO CODE FOR THIS YET */}
					{/* MAKE USER REGISTRATION FIRST */}
				</ul>
      </main>
    </>
  )
}

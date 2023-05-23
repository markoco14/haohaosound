import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import React from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export async function getServerSideProps(context) {
	if (context.params.list_url !== 'freelist') {
		// console.log("not free list")
		console.log(context.query.list_url)
		let { data, error } = await supabase
		.rpc('get_list_by_url', {
			list_url: context.query.list_url
		});

		console.log(data)
		return {
			props: {
				list: data
			},
		}
	} else {
		return { 
			props: {
				list: null
			}
		}
	}

}

export default function Library({ list }) {
	console.log('logging list', list)

	const [sounds, setSounds] = useState([]);
	
	const router = useRouter();
	console.log(router.query.list_url);

	
	useEffect(() => {
		console.log('using use effect')
		if (router.query.list_url === 'freelist') {
			console.log(JSON.parse(localStorage.getItem("nonUserList")).sounds)
			const soundLinks = JSON.parse(localStorage.getItem("nonUserList")).sounds
			setSounds(soundLinks);
			return
		}

		
		setSounds(list);
	}, [router.query.list_url, list])
	
	
	const elementRefs = useRef([]);
	sounds?.forEach((_, index) => {
			elementRefs.current[index] = React.createRef();
		});

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
								>{sound.name}</button>
								<audio ref={elementRefs.current[index]} src={sound.audio_url}>
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

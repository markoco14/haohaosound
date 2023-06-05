import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import React from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export async function getServerSideProps(context) {
	if (context.params.list_url !== 'freelist') {
		let { data, error } = await supabase
		.rpc('get_list_by_url', {
			list_url: context.query.list_url
		});

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

export default function Listen({ list }) {
	console.log(list)

	const [sounds, setSounds] = useState([]);
	const [listName, setListName] = useState('');

	const router = useRouter();

	
	useEffect(() => {
		if (router.query.list_url === 'freelist') {
			const soundLinks = JSON.parse(localStorage.getItem("nonUserList"))[0].sounds
			setListName(JSON.parse(localStorage.getItem("nonUserList"))[0].name)
			setSounds(soundLinks);
			return
		} else {
			setListName(list[0].list_name)
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
			<section>
				<article className='p-2 mb-4'>
					<h1 className="text-2xl">{listName}</h1>
				</article>
				{(sounds.length > 0) ? (
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
				</ul>) : (
					<article className='p-2'>
						<div className='p-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl'>
							<p className='mb-4'>此列表中沒有聲音</p>
							<Link href="/lists" className='underline decoration-2 underline-offset-8'>加聲音</Link>
						</div>
					</article>
				)}
				
			</section>
    </div>
  )
}

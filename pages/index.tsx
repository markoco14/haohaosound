import Head from 'next/head'
import { useRef } from 'react'
import Link from 'next/link'
import Navbar from '../components/Navbar';

export default function Home() {

  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white'>
        <Navbar></Navbar>
				<div className='p-2 mb-8'>
					<h1 className='text-4xl'>好好Sound</h1>
					<p>每時每刻的完美聲音</p>
				</div>
        <div className='px-2'>
          <Link href="/library" className="bg-rose-500  p-4 rounded">試試看</Link>
          {/* <Link href="signup">Create Account</Link> */}
        </div>
      </main>
    </div>
  )
}

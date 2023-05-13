import Head from 'next/head'
import { useRef } from 'react'
import Link from 'next/link'

export default function Home() {

  const clapRef = useRef(null);
  const cheerRef = useRef(null);
  const booRef = useRef(null);
  const drumRef = useRef(null);
  const cricketRef = useRef(null);
  
  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta name="description" content="Play the perfect sound for every moment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='h-screen bg-slate-900 flex flex-col items-center justify-center text-white'>
				<h1>Hao Hao Sign Up</h1>
				<Link href="/">Home</Link>
      </main>
    </div>
  )
}

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
      <main className='h-screen bg-slate-900 text-white'>
				<div className='p-2'>
					<h1 className='text-4xl'>Hao Hao Sound</h1>
					<p>Play the perfect sound for every moment.</p>
				</div>
        <div className='flex flex-col gap-4'>
          <Link href="library">Try Now</Link>
          <Link href="signup">Create Account</Link>
        </div>
      </main>
    </div>
  )
}

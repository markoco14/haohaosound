import Head from 'next/head';
import React, { useRef } from 'react';
import { supabase } from '../modules/core/infrastructure/adapters/supabaseClient';
// add server side props

export async function getServerSideProps(context) {
  let { data, error } = await supabase
    .from('lists')
    .select(
      `
		id,
		name,
		list_sounds (sound_id, sounds (name, audio_url))
		`
    )
    .eq('id', 1)
    .single();

  return {
    props: {
      list: data,
    },
  };
}

export default function Home({ list }) {
  const sounds = [];

  list.list_sounds.forEach((sound) => sounds.push(sound.sounds));

  const elementRefs = useRef([]);

  sounds.forEach((_, index) => {
    elementRefs.current[index] = React.createRef();
  });

  return (
    <div>
      <Head>
        <title>Hao Hao Sound</title>
        <meta
          name="description"
          content="Play the perfect sound for every moment."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <article className="p-2">
          <h1 className="text-2xl">{list.name}</h1>
        </article>
        <ul className="p-2 flex flex-col gap-4">
          {sounds.map((sound, index) => (
            <li key={index}>
              <button
                className="w-full bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md"
                onClick={() => {
                  elementRefs.current.forEach((ref, refIndex) => {
                    if (refIndex !== index) {
                      elementRefs.current[refIndex].current.pause();
                      elementRefs.current[refIndex].current.currentTime = 0;
                    }
                  });
                  if (!elementRefs.current[index].current.paused) {
                    elementRefs.current[index].current.currentTime = 0;
                  }
                  elementRefs.current[index].current.play();
                }}
              >
                {sound.name}
              </button>
              <audio ref={elementRefs.current[index]} src={sound.audio_url}>
                Your browser does not support the <code>audio</code> element.
              </audio>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

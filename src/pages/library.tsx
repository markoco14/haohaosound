import Head from 'next/head';
import { createRef, useRef } from 'react';
import { Sound } from '../modules/sound-mgmt/domain/entities/Sound';
import { soundAdapter } from '../modules/sound-mgmt/infrastructure/adapters/soundAdapter';
import { SoundButton } from '../modules/sound-mgmt/infrastructure/ui/components/SoundButton';
import { playback } from '../modules/sound-mgmt/infrastructure/ui/helpers/playback';

export async function getServerSideProps() {
  const sounds = await soundAdapter.getAllSounds();

  // TODO: move this logic into the adapter
  // might need to change from Sound type to List type
  return {
    props: {
      library: {
        name: "聲音庫",
        sounds: sounds
      }
    },
  };
}

export default function Library({ library }) {
  const elementRefs = useRef([]);

  const refs = library.sounds?.map(() => createRef());

  library.sounds?.forEach((_, index) => {
    elementRefs.current[index] = refs[index];
  });

  const onClick = (index: number) => {
    playback(elementRefs, index);
  };

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
      <article className="p-2">
        <h1 className="text-2xl">{library.name}</h1>
      </article>
      <section>
        <ul className="p-2 flex flex-col gap-4">
          {library.sounds?.map((sound: Sound, index) => (
            <li key={index}>
              <SoundButton 
                ref={refs[index]}
                sound={sound}
                playback={() => onClick(index)}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

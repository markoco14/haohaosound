import Head from 'next/head';
import React, { FC, useRef } from 'react';
import { List } from '../../../domain/entities/List';
import { Sound } from '../../../domain/entities/Sound';
import { listAdapter } from '../../adapters/listAdapter';
import { SoundButton } from '../components/SoundButton';
import { playback } from '../helpers/playback';
// add server side props

interface Props {
  list: List;
}

export async function getServerSideProps(context) {
  const list = await listAdapter.getListById({ id: 1 });

  return {
    props: {
      list: list.toJSON(),
    },
  };
}

export const Home: FC<Props> = ({ list }) => {
  const elementRefs = useRef([]);

  const refs = list.sounds.map(() => React.createRef());

  list.sounds.forEach((_, index) => {
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
      <section>
        <article className="p-2">
          <h1 className="text-2xl">{list.name}</h1>
        </article>
        <ul className="p-2 flex flex-col gap-4">
          {list.sounds.map((sound: Sound, index) => (
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
};

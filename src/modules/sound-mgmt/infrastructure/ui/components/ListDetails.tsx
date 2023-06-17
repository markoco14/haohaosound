import { FC, createRef, useRef } from 'react';
import { List } from '../../../domain/entities/List';
import { Sound } from '../../../domain/entities/Sound';
import { playback } from '../helpers/playback';
import { SoundButton } from './SoundButton';

interface Props {
  list: List;
}

export const ListDetails: FC<Props> = ({ list }) => {
  const elementRefs = useRef([]);

  const refs = list.sounds.map(() => createRef());

  list.sounds.forEach((_, index) => {
    elementRefs.current[index] = refs[index];
  });

  const onClick = (index: number) => {
    playback(elementRefs, index);
  };

  return (
    <>
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
    </>
  );
};

import { FC, Ref, forwardRef } from 'react';
import { Sound } from '../../../domain/entities/Sound';

interface Props {
  // @ts-ignore
  ref: Ref;
  sound: Sound;
  playback(): void;
}

export const SoundButton: FC<Props> = forwardRef<HTMLAudioElement, Props>(({ sound, playback }, ref) => {
  return (
    <>
      <button
        className="w-full bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md"
        onClick={playback}
      >
        {sound.name}
      </button>
      <audio ref={ref} src={sound.audio_url}>
        Your browser does not support the <code>audio</code> element.
      </audio>
    </>
  );
});

SoundButton.displayName = 'SoundButton';

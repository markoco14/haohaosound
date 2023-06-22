import { Ref } from 'react';

// @ts-ignore
export const playback = (elementRefs: Ref, index: number) => {
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
};

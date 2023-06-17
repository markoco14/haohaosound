import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { List } from '../../../domain/entities/List';
import { listAdapter } from '../../adapters/listAdapter';

export const useList = (list: List) => {
  const [sounds, setSounds] = useState<[]>([]);
  const [listName, setListName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (router.query.list_url === 'freelist') {
      const freeList = listAdapter.getFreeList();
      const soundLinks = freeList.sounds;
      setListName(freeList.name);
      setSounds(soundLinks);
      return;
    } else {
      setListName(list.name);
    }

    setSounds(list.sounds);
  }, [router.query.list_url, list]);

  return {
    sounds,
    listName,
  };
};

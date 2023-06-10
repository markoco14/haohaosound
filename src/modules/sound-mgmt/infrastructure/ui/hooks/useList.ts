import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { List } from '../../../domain/entities/List';

export const useList = (list: List) => {
  const [sounds, setSounds] = useState<[]>([]);
  const [listName, setListName] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (router.query.list_url === 'freelist') {
      const soundLinks = JSON.parse(localStorage.getItem('nonUserList'))[0]
        .sounds;
      setListName(JSON.parse(localStorage.getItem('nonUserList'))[0].name);
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

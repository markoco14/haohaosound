import Head from 'next/head';
import { FC } from 'react';
import { List } from '../../../domain/entities/List';
import { listAdapter } from '../../adapters/listAdapter';
import { ListDetails } from '../components/ListDetails';

interface Props {
  list: List;
}

export async function getServerSideProps(context) {
  const url = context.params.list_url;
  if (url !== 'freelist' && url !== 'favicon.ico' && url !== 'manifest.json') {
    try {
      let list = await listAdapter.getListByUrl({
        url: context.query.list_url,
      });

      return {
        props: {
          list: list.toJSON(),
        },
      };
    } catch (error) {
      console.log({ error });
      // TODO: error handling
    }
  } else {
    return {
      props: {
        list: {},
      },
    };
  }
}

export const SelectedList: FC<Props> = ({ list }) => {
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
        <ListDetails list={list} />
      </section>
    </div>
  );
};

import Head from 'next/head';
import { FC } from 'react';
import { List } from '../../../domain/entities/List';
import { listAdapter } from '../../adapters/listAdapter';
import { ListDetails } from '../components/ListDetails';
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

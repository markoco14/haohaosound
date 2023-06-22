import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { List } from "../../../domain/entities/List";
import { listAdapter } from "../../adapters/listAdapter";
import { ListDetails } from "../components/ListDetails";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  list: List;
}

export async function getServerSideProps(context) {
  const url = context.params.list_url;
  if (url !== "freelist") {
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
      return {
        props: {
          list: {},
        },
      };
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
  const [thisList, setThisList] = useState(list);
  const router = useRouter()

  useEffect(() => {
    if (!thisList.sounds && router.query.list_url === 'freelist') {
      setThisList(listAdapter.getFreeList());
    }
  }, [thisList, router.query.list_url]);

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
        {thisList.sounds ? (
          <ListDetails list={thisList} />
        ) : (
          <article className="bg-gray-700 rounded m-2 p-2 flex flex-col gap-4 justify-center">
            <p>This list could not be found.</p>
            <Link href="/lists">Back to lists.</Link>
          </article>
        )}
      </section>
    </div>
  );
};

import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import React from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from "@headlessui/react";

export async function getServerSideProps() {
  let { data: listData, error: listError } = await supabase
    .from("lists")
    .select("*")
    .eq("user_id", "0")
    .single();

  let { data: soundData, error: soundError } = await supabase
    .from("sounds")
    .select("*");

  return {
    props: {
      list: listData,
      sounds: soundData,
    },
  };
}

export default function Lists({ list, sounds }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedList, setSelectedList] = useState("");

  useEffect(() => {
    const freeList = JSON.parse(localStorage.getItem("nonUserList"));
    if (!freeList) {
      console.log("No list found");
      return;
    }
    setLocalList(freeList);
    console.log(freeList);
  }, []);

  const [localList, setLocalList] = useState<any>(undefined);
  // console.log(list)

  // get sounds to play for local list
  const localListElementRefs = useRef([]);

  if (localList) {
    localList.sounds.forEach((_, index) => {
      localListElementRefs.current[index] = React.createRef();
    });
  }

  const EditListModal = () => {
    return (
      <article className="p-4 absolute bottom-0 left-0 h-[90vh] w-full bg-blue-900">
        <h2>Edit &quot;{selectedList}&quot;</h2>
        {/* <p>List: {selectedList}</p> */}
        {/* <p>sounds</p> */}
        <p>Selected Sounds</p>

        <ul className="grid grid-cols-3 border-2 border-red-900">
          {localList.sounds?.map((sound, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  localListElementRefs.current.forEach((ref, refIndex) => {
                    if (refIndex !== index) {
                      localListElementRefs.current[refIndex].current.pause();
                      localListElementRefs.current[
                        refIndex
                      ].current.currentTime = 0;
                    }
                  });
                  if (!localListElementRefs.current[index].current.paused) {
                    localListElementRefs.current[index].current.currentTime = 0;
                  }
                  localListElementRefs.current[index].current.play();
                }}
              >
                {sound.name}
              </button>
              <audio
                ref={localListElementRefs.current[index]}
                src={sound.audio_url}
              >
                Your browser does not support the <code>audio</code> element.
              </audio>
            </li>
          ))}
        </ul>

        {/* <ul className='overflow-y-auto border-2 border-red-900 flex flex-col gap-2'>
					{sounds?.map((sound, index) => (
						<li key={index} className="flex justify-between bg-blue-500">
							<button>
								{sound.name}
							</button>
							<button onClick={() => {
								console.log('added to list')
								console.log(sound.name)
								console.log(sound.audio_url)

								console.log(localList)

							}}>
								+
							</button>
						</li>
					))}
				</ul> */}

        <div className=" flex justify-between border-2 border-red-900">
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedList(null);
            }}
          >
            cancel
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedList(null);
            }}
          >
            save
          </button>
        </div>
      </article>
    );
  };

  return (
    <>
      <Head>
        <title>Hao Hao Sound</title>
        <meta
          name="description"
          content="Play the perfect sound for every moment."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col text-white">
        <Navbar></Navbar>
        <article className="p-2 sm:flex sm:justify-between">
          <h1 className="text-2xl">你的聲音列表</h1>

          {/* CREATE NEW LIST BUTTON */}
          <button
            onClick={() => {
              const previouslySaved = localStorage.getItem("nonUserList");

              if (!previouslySaved) {
                let name = prompt("You are creating a new list");

                localStorage.setItem(
                  "nonUserList",
                  JSON.stringify({
                    name: name,
                    sounds: [
                      {
                        name: "蟋蟀",
                        audio_url: "audio/crickets.wav",
                      },
                    ],
                  })
                );

                setLocalList(JSON.parse(localStorage.getItem("nonUserList")));

                return;
              }

              alert(
                "You already have one free list. Edit that one or delete it to make a new one."
              );
              setIsOpen(!isOpen);
            }}
            className="absolute bottom-0 left-0 w-full bg-green-600 px-4 py-4 rounded-t-xl active:bg-green-900 sm:relative sm:max-w-fit sm:rounded-md sm:active:scale-90 ease-in-out duration-200"
          >
            Create New
          </button>
        </article>
        {isEditing ? <EditListModal /> : null}
        {/* <Dialog open={isOpen} as="div" onClose={() => setIsOpen(false)} className="absolute">
					<Dialog.Panel>
						<Dialog.Title>Deactivate account</Dialog.Title>
						<Dialog.Description>
							This will permanently deactivate your account
						</Dialog.Description>

						<div>
							<label>Give your list a title</label>
							<input />
						</div>

						<button onClick={() => setIsOpen(false)}>Cancel</button>
					</Dialog.Panel>
				</Dialog> */}
        {/* DIALOG TO SET NAME OF LIST */}

        <ul className="p-2 flex flex-col gap-2">
          {/* FREE LIST FROM DB FOR EVERYONE (HAOHAO'S BIRTHDAY LIST) */}
          <li className="flex justify-between">
            <Link
              href={list.url}
              className="bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md"
            >
              <span>{list.name}</span>
            </Link>
          </li>
          {/* LOCAL LIST IF YOU CHOOSE TO CREATE ONE */}
          {localList ? (
            <li className="flex justify-between">
              <Link
                href={"freelist"}
                className="bg-rose-500 p-4 active:scale-95 active:bg-rose-900 active:rounded-md ease-in-out duration-200 hover:bg-rose-700 rounded-md flex justify-between"
              >
                {localList.name}
              </Link>
              <button
                onClick={() => {
                  console.log("editing");
                  setIsEditing(true);
                  setSelectedList(
                    JSON.parse(localStorage.getItem("nonUserList")).name
                  );
                }}
              >
                Edit
              </button>
              <Link
                href={`/edit/${
                  JSON.parse(localStorage.getItem("nonUserList")).name
                }`}
              >
                Edit Link
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("nonUserList");
                  setLocalList(undefined);
                }}
              >
                Delete
              </button>
            </li>
          ) : null}
          {/* YOUR PERSONAL LISTS IF REGISTERED WILL GO HERE */}
          {/* NO CODE FOR THIS YET */}
          {/* MAKE USER REGISTRATION FIRST */}
        </ul>
      </main>
    </>
  );
}

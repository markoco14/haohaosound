import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import React from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from "@headlessui/react";

export async function getServerSideProps() {
  // TODO: add user session and get user lists
  // when I'm ready to get user lists as well
  // I can add the session user id to the filters
  // and it can grab the hao hao list along with any user lists
  let { data: listData, error: listError } = await supabase
    .from("lists")
    .select("name, url")
    .eq("user_id", "0")
    .single();

  return {
    props: {
      list: listData,
      // sounds: soundData,
    },
  };
}

export default function Lists({ list, sounds }) {
  // console.log(list);
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
    // console.log(freeList);
  }, []);

  const [localList, setLocalList] = useState<any>(undefined);
  // console.log(list)
  const localListElementRefs = useRef([]);

  if (localList) {
    localList.sounds.forEach((_, index) => {
      localListElementRefs.current[index] = React.createRef();
    });

  }

  // get sounds to play for local list

  const EditListModal = () => {
    const [sounds, setSounds] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    const elementRefs = useRef([]);

    const fetchSoundData = async () => {
      setLoading(true);

      let { data: soundData, error: soundError } = await supabase
        .from("sounds")
        .select("name, audio_url");

      if (soundError) {
        console.log("error");
      }

      if (soundData) {
        // console.log("got the data", soundData);
        setSounds(soundData);
        soundData.forEach((_, index) => {
          elementRefs.current[index] = React.createRef();
        });
      }

      setLoading(false);
    };

    useEffect(() => {
      fetchSoundData();
    }, []);

    return (
      <article className="p-4 absolute bottom-0 left-0 h-[90vh] w-full bg-slate-800 opacity-95 rounded-t-lg overflow-y-scroll">
        <h2>Edit &quot;{selectedList}&quot;</h2>
        {/* <p>List: {selectedList}</p> */}
        {/* <p>sounds</p> */}
        <p>Selected Sounds</p>

        {/* sounds currently in the list */}
        <ul className="mb-4 grid grid-cols-3 gap-2">
          {localList.sounds?.map((sound, index) => (
            <li
              key={index}
              className="flex justify-between relative bg-slate-500 px-4 py-2"
            >
              <button
                className="w-full"
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
              <button
              className='flex items-center absolute right-0'
                onClick={() => {
                  console.log("deleting sound", sound);
                  console.log(localList);
                  const tempList = localList.sounds.filter(
                    (localStorageSound, index) => {
                      return localStorageSound.name != sound.name;
                    }
                  );

                  // modify the local list
                  console.log(tempList);
                  localList.sounds = tempList;
                  console.log(localList);

                  // store the modified local list in local storage
                  localStorage.setItem(
                    "nonUserList",
                    JSON.stringify(localList)
                  );

                  // setLocalList to trigger re-render
                  setLocalList(JSON.parse(localStorage.getItem("nonUserList")));

                  // setLocalList(localList)

                  // fix element refs
                  console.log('local list element refs', localListElementRefs.current)
                  console.log('index match at:', index)
                  localListElementRefs.current.forEach((ref, index) => {
                    localListElementRefs.current.pop()
                  })
                  console.log(localListElementRefs)
                  // localListElementRefs.
                }}
              >
                <span className="material-symbols-outlined">
                  remove
                </span>
              </button>
            </li>
          ))}
        </ul>


        {/* list of all sounds from db */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="mb-4 overflow-y-auto grid grid-cols-2 gap-2 max-h-[400px]">
            {sounds?.map((sound, index) => (
              <li key={index} className={`relative px-4 py-2 flex items-center justify-center bg-blue-500`}>
                {/* sample sounds button */}
                <button
                  onClick={() => {
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
                  }}
                >
                  {sound.name}
                </button>


                <audio ref={elementRefs.current[index]} src={sound.audio_url}>
                  Your browser does not support the <code>audio</code> element.
                </audio>

                {/* add sounds button */}
                <button
                className='absolute right-0 flex items-center'
                  onClick={() => {
                    // CHECK IF LIST IS ALREADY 6 SOUNDS LONG (FULL)
                    if (localList.sounds.length < 6) {  

                      // CHECK IF SOUND ALREADY IN LIST
                      const soundInList = localList.sounds.find((listSound, index) => {
                        if (listSound.name === sound.name) {
                          return listSound
                        }
                      })
                      
                      // checks if sound in list and returns out of function
                      if (soundInList) {
                        alert('this sound already in set. please choose another one')
                        return
                      }
                      
                      // ADD SOUND TO LIST IF NOT ALREADY IN
                      localList.sounds.push(sound);
                      localStorage.setItem(
                        "nonUserList",
                        JSON.stringify(localList)
                      );
                      setLocalList(
                        JSON.parse(localStorage.getItem("nonUserList"))
                      );
                      return;
                    }

                    // IF LIST IS FULL, TELL USER
                    alert("this list is full. delete sounds to add new ones");
                  }}
                >
                  <span className="material-symbols-outlined">
                    add
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="absolute bottom-0 left-0 h-12 w-full flex justify-evenly">
          <button
          className="w-full bg-green-600 rounded-t-xl"
            onClick={() => {
              setIsEditing(false);
              // setSelectedList(null);
            }}
          >
            Done
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
                    sounds: [],
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
            className="absolute bottom-0 left-0 w-full bg-green-600 h-12 rounded-t-xl active:bg-green-900 sm:relative sm:max-w-fit sm:rounded-md sm:active:scale-90 ease-in-out duration-200"
          >
            Create New
          </button>
        </article>
        <Transition
          show={isEditing}
          enter="duration-500"
          enterFrom="top-0 opacity-0"
          enterTo="bottom-0 opacity-100"
          leave="duration-300"
          leaveFrom="bottom-0 opacity-100"
          leaveTo="top-0 opacity-0"
        >
          <EditListModal />
        </Transition>

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
                  // console.log("editing");
                  setIsEditing(true);
                  setSelectedList(
                    JSON.parse(localStorage.getItem("nonUserList")).name
                  );
                }}
              >
                Edit
              </button>
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

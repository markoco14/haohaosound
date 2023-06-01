import Head from "next/head";
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import React from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabaseClient";
import { Dialog, Transition } from "@headlessui/react";
import { toast, Toaster } from "react-hot-toast";

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

const EditListModal = ({localListElementRefs, selectedList, localList, setLocalList, setIsEditing}) => {
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
      <article className="bg-slate-800 p-4 rounded text-white sm:max-w-[600px] w-full">
        <h2>Edit &quot;{selectedList}&quot;</h2>
        {/* <p>List: {selectedList}</p> */}
        {/* <p>sounds</p> */}
        <p>Selected Sounds: {localList.sounds.length} / 6</p>

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
                  // STOP DB SOUNDS FROM PLAYING OVER LOCAL LIST SOUNDS
                  elementRefs.current.forEach((ref, index) => {
                        elementRefs.current[index].current.pause();
                        elementRefs.current[index].current.currentTime = 0;
                    });

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
                className="flex items-center absolute right-0"
                onClick={() => {
                  const tempList = localList.sounds.filter(
                    (localStorageSound, index) => {
                      return localStorageSound.name != sound.name;
                    }
                  );

                  // modify the local list
                  localList.sounds = tempList;

                  // store the modified local list in local storage
                  localStorage.setItem(
                    "nonUserList",
                    JSON.stringify(localList)
                  );

                  // setLocalList to trigger re-render
                  setLocalList(JSON.parse(localStorage.getItem("nonUserList")));

                  localListElementRefs.current.forEach((ref, index) => {
                    localListElementRefs.current.pop();
                  });
                }}
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
            </li>
          ))}
        </ul>

        {/* list of all sounds from db */}
        {loading ? (
          <p className="mx-auto w-full h-[250px] grid place-content-center">Loading...</p>
        ) : (
          <ul className="mb-4 overflow-y-auto grid grid-cols-2 gap-2 max-h-[400px]">
            {sounds?.map((sound, index) => (
              // TODO: CHANGE STYLES IF SOUND IN LOCAL LIST
              <li
                key={index}
                className={`
                relative px-4 py-2 flex items-center justify-center
                ${localList.sounds.find(localSound => localSound.name === sound.name) ? 'bg-gray-700 shadow-inner' : 'bg-blue-500'}
                `}
              >
                {/* sample sounds button */}
                <button
                  onClick={() => {
                    // STOP LOCAL LIST SOUNDS FROM PLAYING OVER DB SOUNDS
                    localListElementRefs.current.forEach((ref, index) => {
                      localListElementRefs.current[index].current.pause();
                      localListElementRefs.current[index].current.currentTime = 0;
                    })

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
                  className="absolute right-0 flex items-center"
                  onClick={() => {
                    // CHECK IF LIST IS ALREADY 6 SOUNDS LONG (FULL)
                    if (localList.sounds.length < 6) {
                      // CHECK IF SOUND ALREADY IN LIST
                      const soundInList = localList.sounds.find(
                        (listSound, index) => {
                          if (listSound.name === sound.name) {
                            return listSound;
                          }
                        }
                      );

                      // checks if sound in list and returns out of function
                      if (soundInList) {
                        return;
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
                    toast((t) => (
                      <div className="z-100">
                        <p>
                          This list is full. Please delete a sound to add new ones.
                        </p>
                      </div>
                    ), {
                      duration: 1500,
                    });
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="h-12 w-full flex justify-evenly">
          <button
            className="w-full bg-green-600 rounded-xl active:scale-90 ease-in-out duration-200"
            onClick={() => {
              setIsEditing(false);
            }}
          >
            Done
          </button>
        </div>
        {/* <Toaster /> */}
      </article>
    );
  };

export default function Lists({ list, sounds }) {
  const [newListName, setNewListName] = useState<string>("");
  const [localList, setLocalList] = useState<any>(undefined);
  const [selectedList, setSelectedList] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    const freeList = JSON.parse(localStorage.getItem("nonUserList"));
    if (!freeList) {
      console.log("No list found");
      return;
    }
    setLocalList(freeList);
  }, []);

  const localListElementRefs = useRef([]);

  if (localList) {
    localList.sounds.forEach((_, index) => {
      localListElementRefs.current[index] = React.createRef();
    });
  }

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

      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800  ">
        <div className="sm:max-w-[600px] text-white mx-auto">
          <Navbar></Navbar>
          <article className="p-2 sm:flex sm:justify-between">
            <h1 className="text-2xl">你的聲音列表</h1>

            {/* CREATE NEW LIST BUTTON */}
            <button
              onClick={() => {
                setIsCreating(true);
              }}
              className="absolute  px-4 bottom-0 left-0 w-full bg-green-600 h-12 rounded-t-xl active:bg-green-900 sm:relative sm:max-w-fit sm:rounded-md sm:active:scale-90 ease-in-out duration-200"
            >
              Create New
            </button>
          </article>

          {/* EDIT DIALOG MODAL */}
          <Transition
            show={isEditing}
            enter="transition duration-500"
            enterFrom="opacity-70"
            enterTo="opacity-100"
            leave="transition duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-70"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <Dialog 
              onClose={() => {setIsEditing(false)}}
              className={"fixed inset-0 flex items-center justify-center p-4"}
            >
              <Dialog.Panel
              className="sm:max-w-[600px] w-full">
                
                <EditListModal 
                  localListElementRefs={localListElementRefs} 
                  selectedList={selectedList} 
                  localList={localList} 
                  setLocalList={setLocalList} 
                  setIsEditing={setIsEditing}
                />
              </Dialog.Panel>
            </Dialog>
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
                  className='flex items-center'
                  onClick={() => {
                    setIsEditing(true);
                    setSelectedList(
                      JSON.parse(localStorage.getItem("nonUserList")).name
                    );
                  }}
                >
                  <span className="material-symbols-outlined">
                    edit
                    </span>
                </button>
                <button
                  className='flex items-center'
                  onClick={() => {
                    setIsDeleting(true);
                    return;
                  }}
                >
                  <span className="material-symbols-outlined">
                    delete
                  </span>
                </button>
              </li>
            ) : null}
            {/* YOUR PERSONAL LISTS IF REGISTERED WILL GO HERE */}
            {/* NO CODE FOR THIS YET */}
            {/* MAKE USER REGISTRATION FIRST */}
          </ul>

          {/* DELETE MODAL */}
          <Transition appear show={isDeleting}>
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <Dialog
              // open={isDeleting}
              onClose={() => setIsDeleting(false)}
              className={"fixed inset-0 flex items-center justify-center p-4"}
            >
              <Dialog.Panel>
                <div className="bg-slate-700 p-4 rounded text-white">
                  <Dialog.Title className="mb-4">
                    Delete List:{" "}
                    <span className="text-2xl">{localList?.name}</span>
                  </Dialog.Title>
                  <Dialog.Description className="mb-8">
                    You are about to permanently delete the list. Are you sure you
                    want to do this?
                  </Dialog.Description>
                  <div className="flex justify-center gap-4">
                    <button
                      className="text-gray-100 px-4 py-2 rounded-xl"
                      onClick={() => {
                        setIsDeleting(false);
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      className="text-red-500 px-4 py-2 rounded-xl underline underline-offset-2 decoration-2"
                      onClick={() => {
                        localStorage.removeItem("nonUserList");
                        setLocalList(undefined);
                        setIsDeleting(false);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </Transition>

          {/* CREATE MODAL */}
          <Transition appear show={isCreating}>
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <Dialog
              // open={isDeleting}
              onClose={() => setIsCreating(false)}
              className={"fixed inset-0 flex items-center justify-center p-4"}
            >
              <Dialog.Panel>
                <div className="bg-slate-700 p-4 rounded text-white">
                  <Dialog.Title className="mb-4">Create Sound List</Dialog.Title>
                  {localList ? (
                    <>
                      <Dialog.Description className="mb-8">
                        You already have one. Please delete it to make another
                      </Dialog.Description>
                      <div className="flex justify-center">
                        <button
                          className="text-gray-100 px-4 py-2 rounded-xl"
                          onClick={() => {
                            setIsCreating(false);
                          }}
                        >
                          Ok
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-8">
                        <label>Please give your list a name</label>
                        <input
                          className="text-black w-full p-2 rounded mt-2"
                          onChange={(e) => setNewListName(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-gray-100 px-4 py-2 rounded-xl"
                          onClick={() => {
                            setIsCreating(false);
                            setNewListName("");
                          }}
                        >
                          Cancel
                        </button>

                        <button
                          disabled={newListName.length < 1}
                          className="bg-blue-500 disabled:bg-gray-500 px-4 py-2 rounded-xl"
                          onClick={() => {
                            localStorage.setItem(
                              "nonUserList",
                              JSON.stringify({
                                name: newListName,
                                sounds: [],
                              })
                            );

                            setLocalList(
                              JSON.parse(localStorage.getItem("nonUserList"))
                            );
                            setNewListName("");
                            setIsCreating(false);
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Dialog>
          </Transition>
        </div>
      </main>
    </>
  );
}

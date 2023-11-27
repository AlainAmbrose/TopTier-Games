import { Fragment, useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    BellIcon,
    CalendarIcon,
    ChartPieIcon,
    DocumentDuplicateIcon,
    FolderIcon,
    HomeIcon,
    CogIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import HorizontalGameList from "../components/Lists/HorizontalGameList";
import ToggleSwitch from "../components/ToggleSwitch";
import GridList from "../components/Lists/GridList";
import HorizontalButtonList from "../components/Lists/HorizontalButtonList";
import AsideCard from "../components/Cards/AsideCard";
import { useInfiniteQuery, useQuery } from "react-query";
import { useIntersection } from "@mantine/hooks";
import { AuthContext } from "../components/Authorizations/AuthContext";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { TailSpin } from 'react-loading-icons'
import { doubleChunkArray } from "../utils/utils";
import Tabs from "../components/Tabs"
import SettingsPopup from "../components/SettingsPopup";

const mongoose = require("mongoose");


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const app_name = "poosd-large-project-group-8-1502fa002270";
function buildPath(route) {
    if (process.env.NODE_ENV === "production") {
        return "https://" + app_name + ".herokuapp.com/" + route;
    } else {
        return "http://localhost:3001/" + route;
    }
}

// ONLY THING IT SHOULD BE GETTING IS [{}, {} ,{}] => [[[],[]], {}, ...]
const fetchUserGames = async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 250)); // 1-second delay
    let obj = { userId: userId };
    let js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("Progress/api/populatelibrarypage"), {
          method: "POST",
          body: js,
          credentials: "include",
          headers: {
              "Content-Type": "application/json",
          },
      });
  
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Progress/api/populatelibrarypage Data", data);
      let jsonResponse = doubleChunkArray(data.games, 14, 7);
      return jsonResponse;
    } catch (e) {
      throw new Error(`Error thrown when fetching user games: ${e}`);
    }
};

export const fetchGameGroup = async (page, gameGroup) => {
  // Promisified setTimeout
  console.log("sdaiogoasdgbasdgbiasdbgoasdigba,", gameGroup)
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("page: ", page, "gameGroup: ", gameGroup, "gameGroup.slice((page - 1) * 2, page * 2): ", gameGroup.slice((page - 1) * 2, page * 2) || "[]");
  // Assuming 'gameGroup' is an array of arrays and 'page' is the page number

  return gameGroup.slice((page - 1) * 2, page * 2) || [];
};


const LibraryPage = () => {
  const authContext = useContext(AuthContext);
  const { user, userSignup, userLogin, userLogout, showSuperToast, checkUser } = authContext;
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Handle Fetch Errors 
  const handleError = (error) => {
    console.warn('Handling Error: ', error);
    if (!checkUser()) {
      showSuperToast("Something went wrong. Please try logging in again.", "fetch-error");
      console.log(
      "isAuthenticated: ",
      localStorage.getItem("user_data").isAuthenticated
      // user
    );
      showSuperToast("Please login to view the homepage.", "not-authenticated");
      userLogout();
      navigate("/login");
    }
  };

  // This kicks the user back to the login page if they are not authenticated
  useEffect(() => {
    handleError("user may not be authenticated")
  }, []);

  let fn = "";
  let ln = "";
  if (localStorage.getItem("user_data") !== null) {
    var currentUser = localStorage.getItem("user_data");
    var userData = JSON.parse(currentUser);
    console.log(userData);
    fn = userData.firstname;
    ln = userData.lastname;
    var userId = new mongoose.Types.ObjectId(userData.id);
  }


  // ===================UseDataFetch===================

  const { data: usersGameData, isFetching: isFetchingUserGameData, refetch} = useQuery( 
    ["usersGameData", userId],
    () => fetchUserGames(userId),
    { 
      enabled: !!userId,
      onError: handleError, // Set the onError callback here
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    //   refetchInterval: 2000,
    } // ensure userId is not null or undefined
  );

  // Code to detect when the user scrolls to the bottom of the page (Works with the code below)
  const gameLastListRef = useRef(null);
  const { ref: gamesRef, entry: gamesEntry } = useIntersection({
    root: gameLastListRef.current,
    threshold: 1,
  });


  // Code to query the genres on the homepage (runs every time the user scrolls to the bottom of the page)
  const { data: gameDataGroups, fetchNextPage: fetchNextGroup, isFetchingNextPage: isFetchingNextGroup } = useInfiniteQuery(
    ["usersGameData", usersGameData],
    async ({ pageParam = 1 }) => {
      const response = await fetchGameGroup(pageParam, usersGameData);
      return response;
    },
    {
      getNextPageParam: (lastPage, pages) => {
        // Assuming each page contains a fixed number of items, e.g., 5
        const MAX_ITEMS_PER_PAGE = 7;
        // If the number of items in the last page is less than the max, it's the last page
        if (lastPage.length.length < MAX_ITEMS_PER_PAGE) {
          console.log("LAST PAGE")
          return undefined;
        }
        return pages.length + 1;
      },
      refetchOnWindowFocus: false,
      enabled: !!usersGameData && usersGameData.length > 0,
      onError: handleError, // Set the onError callback here
    }
  );

  // Code to flatten the data from the query
  const _gameDataGroups = gameDataGroups?.pages.flatMap((page) => page).flatMap((page) => page);
  
  // Code to fetch the next page of genres when the user scrolls to the bottom of the page (Works with the code above)
  useEffect(() => { 
      if (gamesEntry?.isIntersecting && _gameDataGroups.length < usersGameData.length) {
      console.log("INTERSECTING");
      fetchNextGroup();
      }
  }, [gamesEntry]);

  useEffect(() => {
      console.log("SEARCH GROUPSsssss===========: ", gameDataGroups?.pages.flatMap((page) => page).flatMap((page) => page), gameDataGroups);
  }, [gameDataGroups]);

  // Log isFetchingUserGameData on each render
  console.log("isFetchingUserGameData (render):", isFetchingUserGameData);

  // Log isFetchingUserGameData when it changes
  useEffect(() => {
      console.log("isFetchingUserGameData (effect):", isFetchingUserGameData);
  }, [isFetchingUserGameData]);
  // ===================UseDataFetch===================

  const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Early return if not authenticated
//   if (!localStorage.getItem("user_data") !== null && localStorage.getItem("user_data").isAuthenticated !== false ) {
//     return null; // or some loading indicator or minimal component
//   }

  const userNavigation = [
      { name: "Your profile", href: "#", action: () => navigate("#") },
      { name: "Home", href: "/home", action: () => navigate("/home")},
      { name: "Sign out", href: "/", action: () => userLogout("/") },
  ];

  // Values for left hand side navigation bar
  const navigation = [
    {
      name: "Homepage",
      href: "/home",
      icon: HomeIcon,
      current: false,
      action: () => navigate("/home"),
    },
    {
      name: "Library",
      href: "/library",
      icon: FolderIcon,
      current: true,
      action: () => navigate("#"),
    },
    {
      name: "Settings",
      href: "#",
      icon: CogIcon,
      current: false,
      action: () => setSettingsOpen(true),
    },
  ];

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>

                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                        <div className="flex h-8 shrink-0 items-center"></div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="-mx-2 flex-1 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <button
                                                            className={classNames(
                                                                item.current
                                                                    ? "bg-gray-800 text-white"
                                                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                            )}
                                                            onClick={item.action}
                                                        >
                                                            <item.icon
                                                                className="h-6 w-6 shrink-0"
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
                    <div className="flex h-8 shrink-0 items-center justify-center"></div>
                    <nav className="mt-8">
                        <ul role="list" className="flex flex-col items-center space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <button
                                        className={classNames(
                                            item.current
                                                ? "bg-gray-800 text-white"
                                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                                            "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                                        )}
                                        onClick={item.action}
                                    >
                                        <item.icon
                                            className="h-6 w-6 shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="sr-only">{item.name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <SettingsPopup open={settingsOpen} setOpen={setSettingsOpen} >

                </SettingsPopup>

                <div className="lg:pl-20 ">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
                            
                            <div className="flex flex-1 items-center mt-[70px] ">
                                <h2 className="text-4xl font-bold leading-7 mb-6 mr-10 text-white sm:truncate sm:text-5xl sm:tracking-tight">
                                    Your Library
                                </h2>
                                <Tabs></Tabs>
                            </div>
               
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                        <span className="sr-only">Open user menu</span>
                                        <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                                            <svg
                                                className="h-full w-full text-gray-300"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </span>
                                        <span className="hidden lg:flex lg:items-center">
                                            <span
                                                className="ml-4 text-sm font-semibold leading-6 text-gray-200"
                                                aria-hidden="true"
                                            >
                                                {fn + " " + ln}
                                            </span>
                                            <ChevronDownIcon
                                                className="ml-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute cursor-pointer right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                            {userNavigation.map((item) => (
                                                <Menu.Item key={item.name}>
                                                    {({ active }) => (
                                                        <div
                                                            onClick={item.action}
                                                            className={classNames(
                                                                active ? "bg-gray-50" : "",
                                                                "block px-3 py-1 text-sm leading-6 text-gray-900"
                                                            )}
                                                        >
                                                            {item.name}
                                                        </div>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    {/* bg-gradient-to-r from-gray-700 via-gray-900 to-black */}
                    <main className="xl:pl-0 ">
                        <div
                            style={{ height: "calc(100vh - 120px)" }}
                            className="px-4 py-10 sm:px-6 border-transparent m-5 border rounded-xl  relative scrollable-div overflow-auto bg-black border-none bg- lg:px-8 lg:py-6 xl:shadow-xl xl:shadow-gray-950"
                        >
                            <div className="px-4 py-10 sm:px-6 border-transparent border rounded-xl absolute h-full top-0 right-0 bottom-0 left-0 border-none  lg:px-8 lg:py-6">
                                {/* Main area */}
                                <div className="min-w-0 flex-1">
                     
                                </div>
                          
                              {gameDataGroups !== undefined &&
                                _gameDataGroups?.map((group, i) => {
                                  if (i === _gameDataGroups.length - 1) {
                                    console.log(`Group ${i}`, group)
                                    return (
                                      <GridList
                                      ref={gamesRef}
                                      games={group}
                                      width={"8/12"}
                                      mdCols="7"
                                      smCols="7"
                                      lgCols="7"
                                      ></GridList>
                                    )
                                  } else if (group.length === 0) {
                                    return (
                                      <GridList
                                      skeleton={true}
                                      skeletoncount={7}
                                      width={"8/12"}
                                      aspectHeight={8}
                                      aspectWidth={36}
                                      mdCols="7"
                                      smCols="7"
                                      lgCols="7"
                                      ></GridList>
                                    )
                                  } else {
                                    return (
                                      <GridList
                                      games={group}
                                      width={"8/12"}
                                      mdCols="7"
                                      smCols="7"
                                      lgCols="7"
                                      ></GridList>
                                    );
                                  }
                                })
                              }
                              {(isFetchingNextGroup ) && (
                              <>
                                <GridList
                                  skeleton={true}
                                  skeletoncount={7}
                                  width={"8/12"}
                                  aspectHeight={8}
                                  aspectWidth={36}
                                  mdCols="7"
                                  smCols="5"
                                  lgCols="7"
                                ></GridList>
                                <GridList
                                  skeleton={true}
                                  skeletoncount={7}
                                  width={"8/12"}
                                  aspectHeight={8}
                                  aspectWidth={36}
                                  mdCols="7"
                                  smCols="5"
                                  lgCols="7"
                                ></GridList>
                              </>
                            )}

                              {(usersGameData === undefined) && (<TailSpin className="mx-auto my-auto h-full w-[10%] "  stroke="#374151" />)}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default LibraryPage;

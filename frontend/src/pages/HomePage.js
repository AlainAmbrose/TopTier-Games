import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import HorizontalGameList from '../components/Lists/HorizontalGameList'
import ToggleSwitch from '../components/ToggleSwitch'
import GridList from '../components/Lists/GridList'
import HorizontalButtonList from '../components/Lists/HorizontalButtonList'
import AsideCard from '../components/Cards/AsideCard'
import { useInfiniteQuery, useQuery } from 'react-query'
import { useIntersection } from '@mantine/hooks'
const navigation = [
  { name: "Homepage", href: "#", icon: HomeIcon, current: true },
  { name: "Friends", href: "#", icon: UsersIcon, current: false },
  { name: "Library", href: "#", icon: FolderIcon, current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const files = [
  {
    title: "IMG_4985.HEIC6",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC7",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC8",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC9",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC10",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC11",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC12",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC13",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },

  // More files...
];

const files1 = [
  {
    title: "IMG_4985.HEIC14",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC15",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC16",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  // More files...
];
const files2 = [
  {
    title: "IMG_4985.HEIC1",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC2",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC3",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC4",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC25",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC35",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC45",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  // More files...
];

const files3 = [
  {
    title: "IMG_4985.HEIC1",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC2",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC3",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC4",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  {
    title: "IMG_4985.HEIC5",
    size: "3.9 MB",
    source:
      "https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80",
  },
  // More files...
];

const genres = [
  {
      id: 2,
      title: "Point-and-click",
      href: "/#"
  },
  {
      id: 4,
      title: "Fighting",
      href: "/#"
  },
  {
      id: 5,
      title: "Shooter",
      href: "/#"
  },
  {
      id: 7,
      title: "Music",
      href: "/#"
  },
  {
      id: 8,
      title: "Platform",
      href: "/#"
  },
  {
      id: 9,
      title: "Puzzle",
      href: "/#"
  },
  {
      id: 10,
      title: "Racing",
      href: "/#"
  },
  {
      id: 11,
      title: "Real Time Strategy (RTS)",
      href: "/#"
  },
  {
      id: 12,
      title: "Role-playing (RPG)",
      href: "/#"
  },
  {
      id: 13,
      title: "Simulator",
      href: "/#"
  },
  {
      id: 14,
      title: "Sport",
      href: "/#"
  },
  {
      id: 15,
      title: "Strategy",
      href: "/#"
  },
  {
      id: 16,
      title: "Turn-based strategy (TBS)",
      href: "/#"
  },
  {
      id: 24,
      title: "Tactical",
      href: "/#"
  },
  {
      id: 25,
      title: "Hack and slash/Beat 'em up",
      href: "/#"
  },
  {
      id: 26,
      title: "Quiz/Trivia",
      href: "/#"
  },
  {
      id: 30,
      title: "Pinball",
      href: "/#"
  },
  {
      id: 31,
      title: "Adventure",
      href: "/#"
  },
  {
      id: 32,
      title: "Indie",
      href: "/#"
  },
  {
      id: 33,
      title: "Arcade",
      href: "/#"
  },
  {
      id: 34,
      title: "Visual Novel",
      href: "/#"
  },
  {
      id: 35,
      title: "Card & Board Game",
      href: "/#"
  },
  {
      id: 36,
      title: "MOBA",
      href: "/#"
  }
]

const app_name = "poosd-large-project-group-8-1502fa002270"
function buildPath(route) {
  if (process.env.NODE_ENV === 'production') {
    return 'https://' + app_name + '.herokuapp.com/' + route
  } else {
    return 'http://localhost:3001/' + route
  }
}

const fetchGenre = async (page) => {
  return genres.slice((page - 1) * 2, page * 2)
}

async function fetchTopGames() {
  var obj = {topGamesFlag: true, limit: 8, size: 7};
  var js = JSON.stringify(obj);
  console.log("TOP GAMES request: ", js);
  try {
    const response = await fetch(buildPath("Games/api/populatehomepage"), {
      method: 'POST',
      body: js,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    return jsonResponse.result; // Accessing the 'result' property
  }
  catch(e)
  {
      alert(e.toString());
      throw e; // Rethrow the error for React Query to catch
  }

}

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastListRef = useRef(null)
  const { ref, entry} = useIntersection({
    root: lastListRef.current,
    threshold: 1
  })

  const { data: topGamesData, isLoading: isLoadingTopGames, isError, error } = useQuery('topGames', fetchTopGames);

  const { data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    ['query'],
    async ({ pageParam = 1} ) => {
      const response = await fetchGenre(pageParam)
      return response
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: {
        pages: [genres.slice(0, 2)], // [[{genre}, {genre}], [{genre}, {genre}]]
        pageParams: [1]
      }
    }
  ) 



  useEffect(() => {
    if (entry?.isIntersecting) {console.log("INTERSECTING"); fetchNextPage()}
  }, [entry])
  
  const _genres = data?.pages.flatMap((page) => page)

  useEffect(() => {
    console.log("Results from fetching TOP Games: ", topGamesData, error)
  }, [isLoadingTopGames])


  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
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
                            <a
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {item.name}
                            </a>
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
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                      "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

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
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 ">
              <form className="relative flex flex-1" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="search-field"
                  className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-100 bg-transparent placeholder:text-gray-400 focus:ring-0 focus:bg-gray-800 focus:bg-opacity-25 rounded-md
                   sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  name="search"
                  autoComplete="off"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Separator */}
                {/* <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" /> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {/* DO NOT REMOVE THIS: FUTURE FEATURE */}
                    {/* <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    /> */}
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
                        {/* {firstName + " " + lastName} */}
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
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900"
                              )}
                            >
                              {item.name}
                            </a>
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
          <main className="xl:pl-96 ">
            <div ref={lastListRef}  style={{ height: 'calc(100vh - 120px)' }} className="px-4 py-10 sm:px-6 border-transparent m-5 border rounded-xl  relative scrollable-div overflow-auto bg-black border-none bg- lg:px-8 lg:py-6 xl:shadow-xl xl:shadow-gray-950">
              <div className="px-4 py-10 sm:px-6 border-transparent border rounded-xl absolute h-full top-0 right-0 bottom-0 left-0 border-none  lg:px-8 lg:py-6">
                {/* Main area */}
                <HorizontalButtonList genres={genres}></HorizontalButtonList>
                {/* Top 3 Games */}

                { (!isLoadingTopGames && topGamesData !== undefined) ? (<> 
                  <GridList games={topGamesData.slice(0, 3)} listTitle={"Top Games"} width={"8/12"} aspectHeight={8} aspectWidth={5} mdCols="3" smCols="3" lgCols="3"></GridList>
                  <GridList games={topGamesData.slice(3, 9)} width={"full"} aspectHeight={5} aspectWidth={8} mdCols="5" smCols="5" lgCols="5"></GridList> 
                </>) : 
                (<>
                  <GridList skeleton={true} skeletoncount={3} listTitle={"Top Games"} width={"8/12"} aspectHeight={8} aspectWidth={5} mdCols="3" smCols="3" lgCols="3"></GridList>
                  <GridList skeleton={true} skeletoncount={5} width={"full"} aspectHeight={5} aspectWidth={8} mdCols="5" smCols="5" lgCols="5"></GridList>
                </>) }
        
                {_genres?.map((genre, i) => {
                    if (i === _genres.length - 1) {
                      return(
                        (<HorizontalGameList ref={ref} key={genre.id} genre={genre} size={7}></HorizontalGameList>) 
                      )
                    }
                    return (<HorizontalGameList key={genre.id} genre={genre} size={7}></HorizontalGameList>) 
                  })
                }
                
                {/* <button  className="bg-white mb-2 text-blue-600" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                  {isFetchingNextPage
                    ? 'Loading more...'
                    : (data?.pages.length ?? 0) < 11
                    ? 'Load More'
                    : 'Nothing more to load'
                  }
                </button>  */}
              </div>
            </div>
          </main>
        </div>

        <aside className="fixed bottom-0 left-20 top-16 hidden w-96  border-r border-gray-200  py-5 sm:px-6 lg:px-8 xl:block">
          {/* Secondary column (hidden on smaller screens) */}
          <div
            style={{ height: "calc(100vh - 120px)" }}
            className="px-4 py-10 sm:px-6 border-transparent  border rounded-xl  relative scrollable-div overflow-auto bg-black border-none bg- lg:px-8 lg:py-6  xl:shadow-md xl:shadow-gray-950"
          >
            <div className="px-4 py-10 sm:px-6 border-transparent border rounded-xl absolute h-full top-0 right-0 bottom-0 left-0 border-none  lg:px-8 lg:py-6">
              <p className="text-white text-3xl mb-3">Recommended for you</p>

              <ToggleSwitch></ToggleSwitch>
              <ul role="list" className="divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="flex gap-x-4 py-5">
                    {/* <div className="group aspect-h-5 aspect-w-8 block w-36 overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                      <img className="flex-none pointer-events-none object-cover rounded-md group-hover:opacity-75 bg-gray-50" src={file.source} alt="" />
                      <button type="button" className="absolute inset-0 focus:outline-none">
                        <span className="sr-only">View details for {file.title}</span>
                      </button>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{file.title}</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">{file.size}</p>
                    </div> */}
                    <AsideCard game={file}></AsideCard>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default HomePage;

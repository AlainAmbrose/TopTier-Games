import { Fragment, useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, Menu, Transition } from "@headlessui/react";
import _, { debounce, set } from 'lodash';
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
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  // ArrowSmallLeftIcon
} from "@heroicons/react/20/solid";
import HorizontalGameList from "../components/Lists/HorizontalGameList";
import ToggleSwitch from "../components/ToggleSwitch";
import GridList from "../components/Lists/GridList";
import HorizontalButtonList from "../components/Lists/HorizontalButtonList";
import AsideCard from "../components/Cards/AsideCard";
import { useInfiniteQuery, useQuery } from "react-query";
import { useIntersection } from "@mantine/hooks";
import { AuthContext } from "../components/Authorizations/AuthContext";
import { classNames } from '../utils/utils'; // Update the path accordingly
import { fetchGenre, fetchTopGames, fetchSearchGroup, fetchSearchResults, genres } from '../utils/homepageUtils'; 
import { TailSpin } from 'react-loading-icons'

const navigation = [
  { name: "Homepage", href: "#", icon: HomeIcon, current: true },
  { name: "Library", href: "/library", icon: FolderIcon, current: false },
];


const searchGenre = (genre, setSearchTerm, handleFocus) => {
  handleFocus()
  setSearchTerm(genre)
}

const HomePage = () => {
  // State for the sidebar for mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // Pulling in the user context
  const authContext = useContext(AuthContext);
  const { user, userSignup, userLogin, userLogout, showSuperToast, checkUser } = authContext;

  const navigate = useNavigate();

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
    handleError("user may not be authenticated on mounted")
  }, []);

  // ==============Genre=================

  // Code to query the top games on the homepage (only runs once)
  const { data: topGamesData, isLoading: isLoadingTopGames, isError, error } = useQuery(
      "topGames", 
      fetchTopGames,
      {
        onError: handleError, // Set the onError callback here
      }
    );

  // Code to detect when the user scrolls to the bottom of the page (Works with the code below)
  const lastListRef = useRef(null);
  const { ref, entry } = useIntersection({
    root: lastListRef.current,
    threshold: 1,
  });


  // Code to query the genres on the homepage (runs every time the user scrolls to the bottom of the page)
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const response = await fetchGenre(pageParam);
      return response;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      refetchOnWindowFocus: false,
    }
  );
  
  // Code to fetch the next page of genres when the user scrolls to the bottom of the page (Works with the code above)
  useEffect(() => { 
    if (entry?.isIntersecting) {
      console.log("INTERSECTING");
      fetchNextPage();
    }
  }, [entry]);

  // Code to flatten the data from the query
  const _genres = data?.pages.flatMap((page) => page);

  // ==============Genre=================


  // ===================Search===================
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    // Create a debounced function that updates the debounced search term
    const debounced = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    debounced();

    // Cleanup function to cancel the debounce if the component unmounts
    return () => {
        debounced.cancel();
    };
  }, [searchTerm]);

  const { data: searchResults, isLoading: isLoadingSearch, isFetching: isFetchingSearch, isError: searchIsError, error: searchError } = useQuery(
      ['search', debouncedSearchTerm], 
      () =>  fetchSearchResults(debouncedSearchTerm), 
      {
        enabled: debouncedSearchTerm.length > 0,
        onError: handleError, // Set the onError callback here
      }
  );

  // Code to detect when the user scrolls to the bottom of the page (Works with the code below)
  const searchLastListRef = useRef(null);
  const { ref: searchRef, entry: searchEntry } = useIntersection({
    root: searchLastListRef.current,
    threshold: 1,
  });


  // Code to query the genres on the homepage (runs every time the user scrolls to the bottom of the page)
  const { data: searchGroups, fetchNextPage: fetchNextGroup, isFetchingNextPage: isFetchingNextGroup } = useInfiniteQuery(
    ["query", searchResults],
    async ({ pageParam = 1 }) => {
      const response = await fetchSearchGroup(pageParam, searchResults);
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
      enabled: debouncedSearchTerm.length > 0 && !!searchResults && searchResults.length > 0,
      onError: handleError, // Set the onError callback here
    }
  );

  // Code to flatten the data from the query
  const _searchGroups = searchGroups?.pages.flatMap((page) => page).flatMap((page) => page);
  
  // Code to fetch the next page of genres when the user scrolls to the bottom of the page (Works with the code above)
  useEffect(() => { 
    if (searchEntry?.isIntersecting && _searchGroups.length < searchResults.length) {
      console.log("INTERSECTING");
      fetchNextGroup();
    }
  }, [searchEntry]);

  useEffect(() => {
    console.log("SEARCH GROUPSsssss===========: ", searchGroups?.pages.flatMap((page) => page).flatMap((page) => page), searchGroups);
  }, [searchGroups]);

  // Log isLoadingSearch on each render
  console.log("isFetchingSearch (render):", isFetchingSearch);

  // Log isLoadingSearch when it changes
  useEffect(() => {
    console.log("isFetchingSearch (effect):", isFetchingSearch);
  }, [isFetchingSearch]);
  // ===================Search===================

  // // Early return if not authenticated
  // if (!localStorage.getItem("user_data") !== null && localStorage.getItem("user_data").isAuthenticated !== false ) {
  //   return null; // or some loading indicator or minimal component
  // }

  let fn = "";
  let ln = "";

  if (localStorage.getItem("user_data") !== null) {
    var currentUser = localStorage.getItem("user_data");
    var userData = JSON.parse(currentUser);
    console.log("Loading in firstname and lastname from: ", userData);
    fn = userData.firstname;
    ln = userData.lastname;
  }

  // if (user !== null) {
  //   fn = user.firstname;
  //   ln = user.lastname;
  // }

  // User navigation
  const userNavigation = [
    { name: "Your profile", href: "#", action: () => navigate("#") },
    { name: "Your Library", href: "/library", action: () => navigate("/library")},
    { name: "Sign out", href: "/", action: () => userLogout("/") },
  ];

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
    setSearchTerm(""); // This line clears the search term
  };

  

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
              <div className="relative flex flex-1 mt-[20px]" >
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                {/* <div className=" absolute left-0  top-[-20px] flex w-16 justify-center pt-5"> */}
                  {/* <button
                    type="button"
                    className=" pointer-events-none absolute inset-y-0 left-0 h-full w-6"
                    onClick={() => handleBlur()}
                  >
                    <span className="sr-only">Close Search</span>
             
                  </button> */}
                {/* </div> */}
                {/* {(inputFocused) ? (<ArrowLeftIcon
                      className=" absolute inset-y-0 mt-[1px] left-0 h-full w-6 text-gray-400"
                      aria-hidden="true"
                      onClick={() => handleBlur()}
                    />) : (
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute  inset-y-0 left-0 h-full w-6 text-gray-400"
                    aria-hidden="true"
                  /> 
                )} */}
                <Transition
                  show={inputFocused}  className="font-bold"
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0" 
                >
                  <ArrowLeftIcon
                        className="absolute cursor-pointer ml-[20px] inset-y-0 mt-[1px] left-0 h-full w-8 text-gray-400"
                        aria-hidden="true"
                        onClick={() => handleBlur()}
                  />
                </Transition>
                {/* <Transition
                  show={inputFocused}  className="font-bold"
                  enter="transition-opacity duration-150"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0" 
                  >
                  <MagnifyingGlassIcon
                    className=" ml-[34%] pointer-events-none absolute inset-y-0 left-0 h-full w-8 text-gray-400"
                    aria-hidden="true"
                  /> 
                  </Transition>
                <input
                  id="search-field"
                  className="block ml-[36%] w-1/3 border-0 py-0 text-gray-100 bg-transparent placeholder:text-gray-400 focus:ring-2 ring-1 ring-gray-700  focus:ring-gray-400 focus:ring-opacity-50 focus:bg-gray-800 focus:bg-opacity-25 rounded-md sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                  autoComplete="off"
                  onFocus={handleFocus}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // onBlur={handleBlur}
                />
               */}
                <div className="relative lg:ml-[40%] block lg:w-1/3 sm:w-full">
                  <Transition
                    show={inputFocused} 
                    className="font-bold"
                    enter="transition-opacity duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-0"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0" 
                  >
                    <MagnifyingGlassIcon
                      className="absolute ml-[9px] inset-y-0 left-0 h-full w-6 text-gray-400"
                      aria-hidden="true"
                    /> 
                  </Transition>
                  <input
                    id="search-field"
                    // className={`block w-full h-full border-0 py-0 transition-all  left-0 text-gray-100 bg-transparent placeholder:text-gray-400 focus:ring-2 ring-1 ring-gray-700 focus:ring-blue-600 focus:ring-opacity-50 focus:bg-gray-800 focus:bg-opacity-25 rounded-md sm:text-sm ${inputFocused ? "pl-10 " : "pl-2"}`}
                    className={`block w-full h-full border-0 py-0 outline-none transition-all left-0 text-gray-100 bg-transparent placeholder:text-gray-400 focus:ring-2 ring-1 ring-gray-700 focus:ring-blue-600 focus:ring-opacity-50 focus:bg-gray-800 focus:bg-opacity-25 rounded-md sm:text-sm ${inputFocused ? "pl-10" : "pl-2"}`}
                    placeholder="Search"
                    type="search" 
                    name="search"
                    autoComplete="off"
                    onFocus={handleFocus}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // onBlur={handleBlur}
                  />
                </div>
              </div>
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
          <main className="xl:pl-0">
            {/* DEFAULT MAIN */}
            <Transition 
              show={!inputFocused} className="font-bold"
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                ref={lastListRef}
                style={{ height: "calc(100vh - 120px)" }}
                className="px-4 py-10 sm:px-6 border-transparent m-5 border rounded-xl  relative scrollable-div overflow-auto bg-black border-none lg:px-8 lg:py-6 xl:shadow-xl xl:shadow-gray-950"
              >
                <div className="px-4 py-10 sm:px-6 border-transparent border rounded-xl absolute h-full top-0 right-0 bottom-0 left-0 border-none  lg:px-8 lg:py-6">
                    {/* Main area */}
                    <HorizontalButtonList genres={genres} searchGenre={(genre) => searchGenre(genre, setSearchTerm, handleFocus)}></HorizontalButtonList>
                    {/* Top 3 Games */}

                    {!isLoadingTopGames && topGamesData !== undefined ? (
                      <>
                        <GridList
                          games={topGamesData.slice(0, 4)}
                          listTitle={"Top Games"}
                          width={"8/12"}
                          mdCols="4"
                          smCols="4"
                          lgCols="4"
                        ></GridList>
                        <GridList
                          games={topGamesData.slice(4, 10)}
                          width={"full"}
                          mdCols="5"
                          smCols="5"
                          lgCols="5"
                        ></GridList>
                      </>
                    ) : (
                      <>
                        <GridList
                          skeleton={true}
                          skeletoncount={4}
                          listTitle={"Top Games"}
                          width={"8/12"}
                          aspectHeight={8}
                          aspectWidth={36}
                          mdCols="4"
                          smCols="4"
                          lgCols="4"
                        ></GridList>
                        <GridList
                          skeleton={true}
                          skeletoncount={5}
                          width={"full"}
                          aspectHeight={8}
                          aspectWidth={36}
                          mdCols="5"
                          smCols="5"
                          lgCols="5"
                        ></GridList>
                      </>
                    )}

                    {data !== undefined &&
                      _genres?.map((genre, i) => {
                        if (genre === undefined) {
                          return (<HorizontalGameList
                          skeleton={true}
                          skeletoncount={10}
                          ></HorizontalGameList>)
                        }


                        if (i === _genres.length - 1) {
                          return (
                            <HorizontalGameList
                              ref={ref}
                              key={genre.id}
                              games={genre.data}
                              listTitle={genre.title}
                            ></HorizontalGameList>
                          );
                        }
                        return (
                          <HorizontalGameList
                            key={genre.id}
                            games={genre.data}
                            listTitle={genre.title}
                          ></HorizontalGameList>
                        );
                      })}
                    {(isFetchingNextPage || data == undefined) && (
                      <>
                        <HorizontalGameList
                          skeleton={true}
                          skeletoncount={10}
                        ></HorizontalGameList>
                        <HorizontalGameList
                          skeleton={true}
                          skeletoncount={10}
                        ></HorizontalGameList>
                      </>
                    )}

                    {/*                 
                    <button  className="bg-white mb-2 text-blue-600" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                      {isFetchingNextPage
                        ? 'Loading more...'
                        : (data?.pages.length ?? 0) < 11
                        ? 'Load More'
                        : 'Nothing more to load'
                      }
                    </button>  */}
                  </div>
              </div>
            </Transition>
            {/* SEARCH MAIN */}
            <Transition 
              show={inputFocused}  className="font-bold"
              enter="transition-opacity duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0" 
            >
              <div
                ref={searchLastListRef}
                style={{ height: "calc(100vh - 120px)" }}
                className="px-4 py-10 sm:px-6 border-transparent m-5 border rounded-xl  relative scrollable-div overflow-auto bg-black border-none lg:px-8 lg:py-6 xl:shadow-xl xl:shadow-gray-950"
              >
                <div className="px-4 py-10 sm:px-6 border-transparent border rounded-xl absolute h-full top-0 right-0 bottom-0 left-0 border-none  lg:px-8 lg:py-6">
                  {/*Search Main area */}

                  {searchGroups !== undefined &&
                    _searchGroups?.map((group, i) => {
                      if (i === _searchGroups.length - 1) {
                        console.log(`Group ${i}`, group)
                        return (
                          <GridList
                          ref={searchRef}
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

                  {(isFetchingSearch) && (<TailSpin className="mx-auto my-auto h-full w-[10%] "  stroke="#374151" />)}

                  {/*                                 
                  <button  className="bg-white mb-2 text-blue-600" onClick={() => fetchNextGroup()} disabled={isFetchingNextGroup}>
                    {isFetchingNextGroup
                      ? 'Loading more...'
                      : 'Load More'
                    }
                  </button>  */}
                </div>
              </div>
            </Transition>
            <div 
              style={{ height: "calc(100vh - 120px)",  }} 
              className="mx-4 my-10 sm:mx-6 border-transparent top-[44px] z-[-5] right-0 lg:w-[calc(100vw-132px)] sm:w-[calc(100vw-45px)]   border rounded-xl absolute scrollable-div overflow-auto  border-none lg:mx-8 xl:shadow-xl xl:shadow-gray-950"
            >
              <div
                  style={{ height: "calc(100vh - 120px)" }}
                  className=" border-transparent top-0 z-[-5] border w-full rounded-xl relative scrollable-div overflow-auto bg-black opacity-100 border-none xl:shadow-xl xl:shadow-gray-950"
                >

              </div>
            </div>
       

          </main>
        </div>

        {/* <aside className="fixed bottom-0 left-20 top-16 hidden w-96  border-r border-gray-200  py-5 sm:px-6 lg:px-8 xl:block">
          Secondary column (hidden on smaller screens)
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
                    <AsideCard game={file}></AsideCard>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside> */}
      </div>
    </>
  );
};

export default HomePage;

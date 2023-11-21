import React, { Fragment, useState, useEffect, useRef } from "react";
import
{
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Menu, Transition } from "@headlessui/react";
import LibraryContent from "../components/LibraryContent";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Home", href: "/home" },
  { name: "Sign out", href: "/", action: () => userLogout('/') },
];

function classNames(...classes)
{
  return classes.filter(Boolean).join(" ");
}

const LibraryPage = () =>
{
  var currentUser = localStorage.getItem("user_data");
  var userData = JSON.parse(currentUser);
  console.log(userData);
  var fn = userData.firstname;
  var ln = userData.lastname;

  const [isClicked1, setIsClicked1] = useState(true);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [selectedTab, setTab] = useState("played");

  const toggleColor1 = () =>
  {
    setIsClicked1(!isClicked1);
    setTab("played");
    if (isClicked2)
    {
      setIsClicked2(!isClicked2);
    }
    if (isClicked3)
    {
      setIsClicked3(!isClicked3);
    }
  };

  const toggleColor2 = () =>
  {
    setIsClicked2(!isClicked2);
    setTab("wantToPlay");
    if (isClicked1)
    {
      setIsClicked1(!isClicked1);
    }
    if (isClicked3)
    {
      setIsClicked3(!isClicked3);
    }
  };

  const toggleColor3 = () =>
  {
    setIsClicked3(!isClicked3);
    setTab("all");
    if (isClicked1)
    {
      setIsClicked1(!isClicked1);
    }
    if (isClicked2)
    {
      setIsClicked2(!isClicked2);
    }
  };

  return (
    <div id="LibraryDiv">
      <a
        className="text-slate-50 italic font-bold text-[5vh] left-[5vh] top-[2vh] absolute "
        href={"/home"}
      >
        TopTier
      </a>
      <Menu as="div" className="relative">
        <Menu.Button className="absolute right-[3.8vh] top-[1.9vh] -m-1.5 flex items-center p-1.5">
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
          <Menu.Items className="absolute right-[3.8vh] top-[5.5vh] z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
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
      <button
        className={`${isClicked1 ? "bg-slate-800" : "bg-opacity-50"
          } text-slate-50 top-[7.8rem] left-[41px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor1}
      >
        Played
      </button>
      <button
        className={`${isClicked2 ? "bg-slate-800" : "bg-opacity-50"
          } text-slate-50 top-[7.8rem] left-[191px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor2}
      >
        Want to Play
      </button>
      <button
        className={`${isClicked3 ? "bg-slate-800" : "bg-opacity-50"
          } text-slate-50 top-[7.8rem] left-[341px] absolute w-36 h-14 rounded-t-lg hover:bg-slate-800`}
        onClick={toggleColor3}
      >
        All
      </button>
      <LibraryContent selectedTab={selectedTab} />
    </div>
  );
};

export default LibraryPage;

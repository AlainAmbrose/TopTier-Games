import { Fragment, useEffect, useState, useContext } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { set } from 'lodash'
import { buildPath } from '../utils/utils'
import { AuthContext } from './Authorizations/AuthContext'

const progressOptions = [
  { title: 'Not Started', current: true, color: 'bg-slate-800', status: 0 },
  { title: 'In Progress', current: false, color: 'bg-yellow-500', status: 1 },
  { title: 'Completed', current: false, color: 'bg-green-500', status: 2 }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const setProgress = async (value, userId, gameId, setSelected, refetchFocusedUserGameData) => {
  setSelected(value)
  let js = JSON.stringify({ userId: userId, gameId: gameId, status: value.status });
  console.log("setProgress object", js)
  try {
    const response = await fetch(buildPath("Progress/api/setstatus"), {
      method: "POST",
      body: js,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.message}`);
    }

    refetchFocusedUserGameData()
    
    return jsonResponse.result; // Accessing the 'result' property
  }
  catch (e) {
    console.error(`Error thrown when fetching genre: ${e}`);
    throw new Error(`HTTP error! status: ${e}`);
  }

}

const ProgressDropDown = ({userGame, refetchFocusedUserGameData}) => {
  const authContext = useContext(AuthContext);
  const { user, userSignup, userLogin, userLogout, showSuperToast } = authContext;

  console.log("userGame 1===========", userGame)

  useEffect(() => {
    console.log("userGame 2==============", userGame)
  }, [])

  const calculateStatus = () => {
    let retval =  (userGame === undefined || userGame.progressRow === undefined || !userGame.foundGameFlag) ? progressOptions[0] : (userGame.progressRow.Status === 0) ? progressOptions[0] : userGame.progressRow.Status === 1 ? progressOptions[1] : progressOptions[2];
    console.log("userGame 3==============", retval)
    return retval
  };

  const [selected, setSelected] = useState(calculateStatus());

  useEffect(() => {
    console.log("userGame updated", userGame);
    setSelected(calculateStatus());
  }, [userGame]); // Dependency on userGame

  // let status = (userGame === undefined || userGame.progressRow === undefined ) ? progressOptions[0] : (userGame.progressRow.Status === 0) ? progressOptions[0] : userGame.progressRow.Status === 1 ? progressOptions[1] : progressOptions[2];
  // const [selected, setSelected] = useState(status);

  
  return (
    <Listbox value={selected} onChange={(value) => {setProgress(value, userGame.progressRow.UserId, userGame.progressRow.GameId, setSelected, refetchFocusedUserGameData)}}>
      {({ open }) => (
        <>
          <Listbox.Label className="sr-only">Change published status</Listbox.Label>
          <div className="relative">
            <div className="inline-flex divide-x divide-blue-700 rounded-md shadow-sm">
              <h1 className="text-sm font-medium text-3xl mt-1 text-gray-300 " >Status: </h1>
              <div className={`inline-flex items-center gap-x-1.5 rounded-l-md ml-5 ${selected.color}   px-3 py-2 text-white shadow-sm`}>
                {/* <CheckIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" /> */}
                <p className="text-sm font-semibold">{selected.title}</p>
              </div>
              {(userGame !== undefined && userGame.foundGameFlag) ? (
                <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-slate-800 p-2 hover:bg-slate-700 ">
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </Listbox.Button>
              ) : (
                <button className="inline-flex items-center rounded-l-none rounded-r-md bg-slate-800 p-2 hover:bg-slate-700 " onClick={() => showSuperToast("Game must be in your library to set a status", "game-not-in-library")}>
                  <span className="sr-only">Change published status</span>
                  <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
              )}
    
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute left-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {progressOptions.map((option) => (
                  <Listbox.Option
                    key={option.title}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-slate-600 text-white' : 'text-gray-200',
                        'cursor-pointer select-none p-4 text-sm'
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? 'font-semibold' : 'font-normal'}>{option.title}</p>
                          {selected ? (
                            <span className={active ? 'text-white' : 'text-blue-600'}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}


export default ProgressDropDown;
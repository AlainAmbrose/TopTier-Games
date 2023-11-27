
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
  
const Tabs = ({tabs}) => {

    return (
      <div className="mb-0">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                onClick={() => tab.action()}
                className={classNames(
                  tab.current ? 'bg-black ring-1 ring-slate-800  text-slate-300' : 'text-gray-500 bg-black hover:text-gray-700',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    )
  }


export default Tabs;
  
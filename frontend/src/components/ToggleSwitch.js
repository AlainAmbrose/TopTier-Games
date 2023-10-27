import { useState } from "react";
import { Switch } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ToggleSwitch = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? "bg-gray-400" : "bg-gray-400",
        "relative inline-flex h-6 w-full flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out "
      )}
    >
      <span className="sr-only">Use setting</span>
      <p className="italic translate-x-full absolute inset-0 flex h-full w-6/12 items-center justify-center transition-opacity">
        Title
      </p>

      <p className="italic translate-x-0 absolute inset-0 flex h-full w-6/12 items-center justify-center transition-opacity">
        Rating
      </p>

      <span
        className={classNames(
          enabled ? "translate-x-full" : "translate-x-0",
          "pointer-events-none relative inline-block h-6 w-6/12 transform rounded-full bg-gray-300 shadow ring-0 transition duration-200 ease-in-out"
        )}
      >
        <span
          className={classNames(
            enabled
              ? "opacity-0 duration-100 ease-out"
              : "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <p>Rating</p>
        </span>
        <span
          className={classNames(
            enabled
              ? "opacity-100 duration-200 ease-in"
              : "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <p>Title</p>
        </span>
      </span>
    </Switch>
  );
};

export default ToggleSwitch;

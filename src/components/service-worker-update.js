import React from 'react';
import { Transition } from '@headlessui/react';

import useStore from '../lib/zustand';

const ExclamationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export const ServiceWorkerUpdate = () => {
  const hasUpdateReady = useStore(state => state.hasSwUpdateReady);
  const show = hasUpdateReady;
  return (
    <Transition
      show={show ?? false}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0">
      <div className="bg-blue-500 px-4 pt-5 pb-4 sm:(p-6 pb-4)">
        <div className="sm:(flex items-start)">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:(mx-0 h-10 w-10)">
            <ExclamationIcon />
          </div>
          <div className="mt-3 text-center sm:(mt-0 ml-4 text-left)">
            <h3 className="text-lg leading-6 font-medium text-black dark:text-white">
              Website update
            </h3>
            <div className="mt-2">
              <p className="text-sm text-black dark:text-white">
                Our website has an update available. Please load the update to ensure the best
                possible experience.
              </p>
            </div>
          </div>
          <div className="px-4 py-3 object-right justify-self-end sm:(px-6 flex flex-row-reverse)">
            <button
              onClick={() => window.location.reload(true)}
              type="button"
              className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base text-white bg-gray-800 hover:bg-gray-900 sm:(ml-3 w-auto text-sm)">
              Load
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

import { FC } from 'react';
import { Modal } from 'flowbite-react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';

interface AddEditRoadMapProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  isAdd?: boolean;
}

const AddEditRoadMapModal: FC<AddEditRoadMapProps> = ({
  open,
  setOpen,
  isAdd = true,
}) => {
  return (
    <Modal show={open} popup>
      <Modal.Body className="p-4 sm:p-5">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b border-gray-200 sm:mb-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isAdd
              ? en.addEditRoadMapModal.addRoadmap
              : en.addEditRoadMapModal.editRoadmap}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        <form>
          <div className="grid gap-4 mb-4 sm:grid-cols-1">
            <div className="sm:col-span-2" data-svelte-h="svelte-1fknoi">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Type roadmap name"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                data-svelte-h="svelte-1cqgnle"
              >
                Roadmap Category
              </label>
              <select
                id="category"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              >
                <option data-svelte-h="svelte-40radm" value="Select category">
                  Select category
                </option>
                <option data-svelte-h="svelte-1h3e5om" value="TV">
                  HR
                </option>
                <option data-svelte-h="svelte-1qgjo8v" value="PC">
                  Sales
                </option>
                <option data-svelte-h="svelte-1t9m3hr" value="GA">
                  Engineering
                </option>
                <option data-svelte-h="svelte-14ct8a" value="PH">
                  Recruitment
                </option>
              </select>
            </div>
            <div className="sm:col-span-2" data-svelte-h="svelte-1xr4cp4">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write roadmap description here"
                spellCheck="false"
                style={{ height: '149px' }}
              ></textarea>
            </div>
          </div>
          <button
            type="submit"
            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            data-svelte-h="svelte-1kbr9d0"
          >
            {isAdd
              ? en.addEditRoadMapModal.addRoadmap
              : en.addEditRoadMapModal.editRoadmap}
          </button>
          <button
            data-modal-toggle="defaultModal"
            className="py-2.5 px-5 ml-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            {en.common.cancel}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEditRoadMapModal;

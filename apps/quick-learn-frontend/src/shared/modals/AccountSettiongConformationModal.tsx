import { Modal } from 'flowbite-react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';

interface Props {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function AccountSettingConformationModal({
  title,
  description,
  open,
  setOpen,
}: Props) {
  return (
    <Modal show={open} size="2xl" popup>
      <Modal.Body className="p-0">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center border-b border-gray-200 pl-4 pr-2 py-4">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-400">
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => setOpen(false)}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
          <p className="p-4 md:p-5 font-xs text-gray-500 border-b border-gray-200">
            {description}
          </p>
          <button
            type="button"
            className="py-2.5 px-5 ml-4 my-3.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 uppercase"
            onClick={() => setOpen(false)}
          >
            {en.common.ok}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

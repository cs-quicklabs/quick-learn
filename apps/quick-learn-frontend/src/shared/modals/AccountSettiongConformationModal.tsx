import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { CloseIcon } from '../components/UIElements';
import { en } from '@src/constants/lang/en';

interface Props {
  readonly title: string;
  readonly description: string;
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
}

export default function AccountSettingConformationModal({
  title,
  description,
  open,
  setOpen,
}: Props) {
  return (
    <Dialog
      as="div"
      className="relative z-10"
      open={open}
      onClose={() => setOpen(false)}
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-900 opacity-50" />

      {/* Modal panel */}
      <div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center p-4">
        <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow">
          <div className="flex items-center border-b border-gray-200 pl-4 pr-2 py-4">
            <DialogTitle
              as="h3"
              className="text-lg font-bold text-gray-700 dark:text-gray-400"
            >
              {title}
            </DialogTitle>
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
        </DialogPanel>
      </div>
    </Dialog>
  );
}

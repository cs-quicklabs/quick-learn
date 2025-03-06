import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CloseIcon, InfoIcon } from '../components/UIElements';

interface Props {
  readonly title: string;
  readonly subTitle?: string;
  readonly open: boolean;
  readonly setOpen: (value: boolean) => void;
  readonly onConfirm: () => void;
  readonly confirmText?: string;
  readonly cancelText?: string;
}

export type ConformationModalActionType = 'success' | 'cancel';

export default function ConformationModal({
  title,
  subTitle,
  open,
  setOpen,
  onConfirm,
  confirmText = "Yes, I'm sure",
  cancelText = 'No, cancel',
}: Props) {
  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      className="relative z-10"
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        aria-hidden="true"
      />

      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="relative">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={() => setOpen(false)}
              >
                <CloseIcon className="w-3 h-3" />
              </button>
              <div className="p-4 md:p-5 text-center">
                <InfoIcon className="mx-auto mb-4 text-red-600 w-12 h-12" />
                <DialogTitle
                  as="h3"
                  className={
                    'text-lg font-bold text-gray-700' +
                    (subTitle ? '' : ' my-5')
                  }
                >
                  {title}
                </DialogTitle>
                {subTitle && (
                  <Description className="mb-5 font-xs text-gray-500">
                    {subTitle}
                  </Description>
                )}
                <div className="mt-4">
                  <button
                    type="button"
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    onClick={() => handleConfirm()}
                  >
                    {confirmText}
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    {cancelText}
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

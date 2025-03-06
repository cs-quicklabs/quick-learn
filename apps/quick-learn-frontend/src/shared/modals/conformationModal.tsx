import { CloseIcon, InfoIcon } from '../components/UIElements';

interface Props {
  title: string;
  subTitle?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 dark:bg-opacity-80 overscroll-none px-4 md:px-0"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[26rem] max-h-full dark:bg-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
          <div className="p-4 md:p-5 text-center">
            <InfoIcon className="mx-auto mb-4 text-red-600 w-12 h-12 dark:text-gray-200" />
            <h3
              className={
                'text-lg font-bold text-gray-700 dark:text-gray-400' +
                (subTitle ? '' : ' my-5')
              }
            >
              {title}
            </h3>
            {subTitle && (
              <p className="mb-5 font-xs text-gray-500">{subTitle}</p>
            )}
            <button
              type="button"
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
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
    </div>
  );
}

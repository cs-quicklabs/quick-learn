import { FC, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from 'flowbite-react';
import { CloseIcon, Loader } from '../components/UIElements';
import { en } from '@src/constants/lang/en';
import { TAssignModalMetadata } from '../types/contentRepository';

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  heading: string;
  sub_heading: string;
  data: TAssignModalMetadata[];
  initialValues?: schemaType;
  onSubmit: (data: string[]) => void;
  isLoading?: boolean;
}

const schema = z.object({
  selected: z.array(z.string()).optional(),
});

type schemaType = z.infer<typeof schema>;

const AssignDataModal: FC<Props> = ({
  show,
  setShow,
  heading,
  sub_heading,
  data,
  initialValues,
  onSubmit,
  isLoading = false,
}) => {
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (!show) {
      reset();
      setIsFormDirty(false);
    }
    if (initialValues?.selected && show && !isLoading) {
      setValue('selected', initialValues.selected);
    }
  }, [initialValues, show, isLoading, reset, setValue]);

  function onFormSubmit(formData: schemaType) {
    onSubmit(formData?.selected ?? []);
  }

  return (
    <Modal show={show} size="6xl">
      <Modal.Body className="p-0">
        <div className="flex items-start justify-between p-4 rounded-t">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
            {heading}
          </h3>
          <button
            type="button"
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2.5 ml-auto inline-flex items-center"
            onClick={() => setShow(false)}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="px-4 md:px-6">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <ul
                className="flex flex-wrap -mb-px text-sm font-medium text-center"
                id="myTab"
              >
                <li className="mr-1">
                  <span
                    className="inline-block pb-2 pr-1 text-gray-700"
                    id="brand-tab"
                  >
                    {sub_heading}
                  </span>
                </li>
              </ul>
            </div>
            <div id="myTabContent">
              <div
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
                id="brand"
                role="tabpanel"
                aria-labelledby="brand-tab"
              >
                {data.map((ele) => {
                  return (
                    <div key={ele.name} className="space-y-2">
                      <h5 className="text-lg font-medium text-black dark:text-white capitalize">
                        {ele.name}
                      </h5>
                      {ele.list.map((item) => {
                        return (
                          <div key={item.value} className="flex items-center">
                            <input
                              id={item.name}
                              type="checkbox"
                              value={item.value}
                              className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                              {...register('selected')}
                              onChange={() => setIsFormDirty(true)}
                            />
                            <label
                              htmlFor={item.name}
                              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 capitalize"
                            >
                              {item.name}
                            </label>
                          </div>
                        );
                      })}
                      {ele.list.length === 0 && (
                        <p className="font-medium text-gray-500">
                          No data found
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {data.length === 0 && (
                <p className="text-center text-gray-500">
                  {en.modals.noDataFound}
                </p>
              )}
            </div>
            {errors &&
              errors.selected &&
              (errors.selected.length ?? 0) > 0 &&
              ((errors.selected as unknown[] as { message: string }[]).map(
                (error, index) => (
                  <p
                    key={error.message + index}
                    className="mt-1 text-red-500 text-sm"
                  >
                    {error.message}
                  </p>
                ),
              ) ??
                null)}
          </div>
          <div className="flex items-center p-6 space-x-4 rounded-b dark:border-gray-600">
            <button
              type="submit"
              className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500"
              disabled={!isFormDirty || !isValid || isLoading}
            >
              {isLoading ? <Loader /> : en.common.save}
            </button>
            <button
              onClick={() => setShow(false)}
              disabled={isLoading}
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            >
              {en.common.cancel}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AssignDataModal;

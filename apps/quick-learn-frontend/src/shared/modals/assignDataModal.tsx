import { FC, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ChevronDownIcon, CloseIcon, Loader } from '../components/UIElements';
import { en } from '@src/constants/lang/en';
import { TAssignModalMetadata } from '../types/contentRepository';
import { firstLetterCapital } from '@src/utils/helpers';
import InputCheckbox from '../components/InputCheckbox';

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  heading: string;
  sub_heading: string;
  data: TAssignModalMetadata[];
  initialValues?: schemaType;
  note?: string;
  onSubmit: (data: string[]) => void;
  isLoading?: boolean;
}

const schema = z.object({
  selected: z.array(z.string()).optional(),
});

type schemaType = z.infer<typeof schema>;
const SM_MEDIA_QUERY = '(max-width: 639px)';

const AssignDataModal: FC<Props> = ({
  show,
  setShow,
  heading,
  sub_heading,
  data,
  initialValues,
  onSubmit,
  note,
  isLoading = false,
}) => {
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(false);
  const [initialSelectedRoadmaps, setInitialSelectedRoadmaps] = useState<
    string[]
  >([]);
  const [defaultValues, setDefaultValues] = useState(initialValues);

  useEffect(() => {
    if (initialValues) setDefaultValues(initialValues);
  }, [initialValues]);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors, isValid },
    setValue,
    reset,
  } = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    const initializeState = () => {
      const allAccordionIds = sortedData.map((ele) => ele.name);
      const isMobileView = window.matchMedia(SM_MEDIA_QUERY).matches;

      if (isMobileView) {
        setOpenAccordions([]);
        setIsAllExpanded(false);
      } else {
        setOpenAccordions(allAccordionIds);
        setIsAllExpanded(true);
      }

      reset(defaultValues);
      setInitialSelectedRoadmaps(defaultValues?.selected || []);
      setIsFormDirty(false);
    };

    const resetState = () => {
      reset();
      setIsFormDirty(false);
      setOpenAccordions([]);
      setIsAllExpanded(false);
      setInitialSelectedRoadmaps([]);
    };

    if (show) {
      initializeState();
    } else {
      resetState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, setValue, reset]);

  useEffect(() => {
    if (!show) return;

    const subscription = watch((_value, { name, type }) => {
      const currentSelected = getValues('selected') || [];

      if (name === 'selected' || type === 'change') {
        const isDirty =
          currentSelected.length !== initialSelectedRoadmaps.length ||
          !currentSelected.every((value) =>
            initialSelectedRoadmaps.includes(value),
          );

        setIsFormDirty(isDirty);
      }
    });

    return () => subscription.unsubscribe();
  }, [show, watch, getValues, initialSelectedRoadmaps]);

  function onFormSubmit(formData: schemaType) {
    if (defaultValues) {
      setDefaultValues({ selected: formData?.selected || [] });
    }
    onSubmit(formData?.selected ?? []);
  }

  const handleToggleAll = () => {
    if (isAllExpanded) {
      // Collapse all
      setOpenAccordions([]);
      setIsAllExpanded(false);
    } else {
      // Expand all
      const allAccordionIds = sortedData.map((ele) => ele.name);
      setOpenAccordions(allAccordionIds);
      setIsAllExpanded(true);
    }
  };

  const handleAccordionChange = (id: string) => {
    const newOpenAccordions = openAccordions.includes(id)
      ? openAccordions.filter((openId) => openId !== id)
      : [...openAccordions, id];

    setOpenAccordions(newOpenAccordions);

    // Check if all accordions are expanded or collapsed
    const allAccordionIds = sortedData.map((ele) => ele.name);
    const newIsAllExpanded =
      newOpenAccordions.length === allAccordionIds.length;

    setIsAllExpanded(newIsAllExpanded);
  };

  if (!show) return null;

  return (
    <Dialog
      open={show}
      onClose={() => setShow(false)}
      className="relative z-10"
    >
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        aria-hidden="true"
      />
      {/* Modal container */}
      <div className="fixed inset-0 overflow-y-auto flex min-h-full items-center justify-center p-4">
        <DialogPanel className="w-full max-w-9xl bg-white rounded-lg shadow-xl">
          <div className="flex items-start justify-between pt-4 px-4 rounded-t">
            <DialogTitle
              as="h3"
              className="text-xl font-semibold text-gray-900 "
            >
              {heading}
            </DialogTitle>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2.5 ml-auto inline-flex items-center"
              onClick={() => setShow(false)}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
          <div className="ml-4 text-[14px] text-gray-500 mt-0">
            <p>{note}</p>
          </div>
          <div className="mb-4 px-4 md:px-6 mt-3">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium justify-between items-center border-b border-gray-200 "
              id="myTab"
            >
              <li className="mr-1">
                <span
                  className="inline-block pb-0 pr-1 text-gray-900"
                  id="brand-tab"
                >
                  {sub_heading}
                </span>
              </li>
              <li className="mr-1">
                <button
                  type="button"
                  className="bg-blue-700 px-3 py-2 rounded-md text-white mb-2 inline-block hover:bg-blue-600 invisible md:visible"
                  onClick={handleToggleAll}
                >
                  {isAllExpanded ? 'Collapse All' : 'Expand All'}
                </button>
              </li>
            </ul>
          </div>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="px-4 md:px-6">
              <div
                id="myTabContent"
                className="overflow-y-auto h-[24rem] md:h-[35rem] scrollbar-hide"
              >
                <div
                  className="columns-1 md:columns-4 gap-4"
                  id="brand"
                  role="tabpanel"
                  aria-labelledby="brand-tab"
                >
                  {sortedData.map((ele) => {
                    // Sort the nested list array alphabetically by name
                    const sortedList = ele.list.sort((a, b) =>
                      a.name.localeCompare(b.name),
                    );
                    const isOpen = openAccordions.includes(ele.name);
                    return (
                      <div key={ele.name} className="break-inside-avoid mb-4">
                        <div className="border border-gray-300 rounded-lg">
                          <button
                            type="button"
                            className="relative text-black bg-transparent px-3 w-full flex justify-between py-4 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleAccordionChange(ele.name)}
                          >
                            <span className=" capitalize font-medium">
                              {ele.name}
                            </span>
                            <ChevronDownIcon
                              className={isOpen ? 'rotate-180' : 'rotate-0'}
                            />
                          </button>
                          {isOpen && (
                            <div className="py-6 px-5">
                              {sortedList.length > 0 ? (
                                sortedList.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center mb-2"
                                    id="content_list_item"
                                  >
                                    <div className="group grid size-4 grid-cols-1">
                                      <InputCheckbox
                                        id={item.name}
                                        value={item.value}
                                        {...register('selected')}
                                      />
                                    </div>

                                    <label
                                      htmlFor={item.name}
                                      className="flex items-center group gap-2 w-full ml-2 text-sm justify-between font-medium text-gray-900 "
                                    >
                                      <span>
                                        {firstLetterCapital(item.name)}
                                      </span>
                                      {item.roadmap_count === 0 && (
                                        <span className="flex">
                                          <span className="hidden md:flex text-gray-500 text-xs italic">
                                            orphan
                                          </span>
                                          <span className="text-red-500 text-md ml-1">
                                            *
                                          </span>
                                        </span>
                                      )}
                                    </label>
                                  </div>
                                ))
                              ) : (
                                <p className="font-medium text-gray-500">
                                  No data found
                                </p>
                              )}
                            </div>
                          )}
                        </div>
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
            <div className="flex items-center p-6 space-x-4 rounded-b ">
              <button
                type="submit"
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-gray-500"
                disabled={!isFormDirty || !isValid || isLoading}
              >
                {isLoading ? (
                  <div className="pl-3 text-center">
                    <Loader />
                  </div>
                ) : (
                  en.common.save
                )}
              </button>
              <button
                onClick={() => setShow(false)}
                type="button"
                disabled={isLoading}
                className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-hidden bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-1 focus:ring-gray-200"
              >
                {en.common.cancel}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AssignDataModal;

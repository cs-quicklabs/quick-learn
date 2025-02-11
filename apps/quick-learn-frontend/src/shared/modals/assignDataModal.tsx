import { FC, useEffect, useState, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Accordion } from 'flowbite-react';
import { CloseIcon, Loader } from '../components/UIElements';
import { en } from '@src/constants/lang/en';
import { TAssignModalMetadata } from '../types/contentRepository';
import { firstLetterCapital } from '@src/utils/helpers';

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
    defaultValues: initialValues,
    mode: 'onChange',
  });
  const sortedData = useMemo(
    () => [...data].sort((a, b) => a.name.localeCompare(b.name)),
    [data],
  );
  useEffect(() => {
    const selectedRoadmaps = initialValues?.selected || [];
    setInitialSelectedRoadmaps(selectedRoadmaps);
  }, [initialValues]);

  useEffect(() => {
    if (show) {
      // When the modal is opened, expand all accordions
      const allAccordionIds = sortedData.map((ele) => ele.name);
      setOpenAccordions(allAccordionIds);
      setIsAllExpanded(true);
      if (initialValues?.selected && !isLoading) {
        setValue('selected', initialValues.selected);
        setInitialSelectedRoadmaps(initialValues.selected);
      }
    } else {
      // Reset the state when the modal is closed
      reset();
      setIsFormDirty(false);
      setOpenAccordions([]); // Collapse all when modal is closed
      setIsAllExpanded(false);
    }
    if (initialValues?.selected && show && !isLoading) {
      setValue('selected', initialValues.selected);
    }
  }, [initialValues, show, isLoading, reset, setValue, sortedData]);

  useEffect(() => {
    if (show) {
      const subscription = watch(() => handleCheckFormDirty());
      return () => subscription.unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, watch]);

  function onFormSubmit(formData: schemaType) {
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
  const handleCheckFormDirty = () => {
    const currentSelected = getValues('selected') || [];
    const isDirty =
      currentSelected.length !== initialSelectedRoadmaps.length ||
      !currentSelected.every((value) =>
        initialSelectedRoadmaps.includes(value),
      );

    setIsFormDirty(isDirty);
  };

  return (
    <Modal show={show} size="6xl">
      <Modal.Body className="p-0">
        <div className="flex items-start justify-between pt-4 px-4 rounded-t">
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
        <div className="ml-4 text-[14px] text-gray-500 mt-0">
          <p>{note}</p>
        </div>
        <div className="mb-4 px-4 md:px-6 mt-3">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium justify-between items-center border-b border-gray-200 dark:border-gray-700"
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
                className="bg-blue-700 px-3 py-2 rounded-md text-white mb-2 inline-block hover:bg-blue-600"
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
              className="overflow-y-auto h-[35rem] scrollbar-hide"
            >
              <div
                className="columns-2 md:columns-4 gap-4"
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
                      {
                        <Accordion
                          collapseAll
                          className="[&>div>div>button>svg]:hidden" // Hide default Flowbite accordion icon
                        >
                          <Accordion.Panel>
                            <Accordion.Title
                              className="relative flex items-center justify-between text-black bg-transparent focus:ring-0 [&>svg]:hidden px-3 py-4"
                              onClick={() => handleAccordionChange(ele.name)}
                            >
                              <span className="flex-grow">{ele.name}</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`size-6 absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-300 ${
                                  isOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                              </svg>
                            </Accordion.Title>
                            <Accordion.Content
                              className="py-6 border-none"
                              hidden={!openAccordions.includes(ele.name)}
                            >
                              {sortedList.length > 0 ? (
                                sortedList.map((item) => (
                                  <div
                                    key={item.value}
                                    className="flex items-center mb-2"
                                  >
                                    <input
                                      id={item.name}
                                      type="checkbox"
                                      value={item.value}
                                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500"
                                      {...register('selected')}
                                    />
                                    <label
                                      htmlFor={item.name}
                                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      {firstLetterCapital(item.name)}
                                    </label>
                                  </div>
                                ))
                              ) : (
                                <p className="font-medium text-gray-500">
                                  No data found
                                </p>
                              )}
                            </Accordion.Content>
                          </Accordion.Panel>
                        </Accordion>
                      }
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
              {isLoading ? (
                <div className="pl-3">
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

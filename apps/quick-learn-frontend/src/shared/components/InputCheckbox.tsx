import { CheckboxIcon } from './UIElements';

interface CheckboxProps {
  id?: string;
  type?: string;
  value?: string | number | readonly string[];
  className?: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  checkBoxclass?: string;
  'aria-describedby'?: string;
}

function InputCheckbox(props: CheckboxProps = {}) {
  const {
    id = 'checkbox',
    type = 'checkbox',
    value = '',
    className = '',
    checkBoxclass = '',
    checked,
    onChange,
    disabled,
    'aria-describedby': ariaDescribedby,
    ...rest
  } = props;

  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        className={`appearance-none rounded-sm border border-gray-300 bg-white checked:border-primary-600 checked:bg-primary-600 indeterminate:border-primary-600 indeterminate:bg-primary-600 focus:outline-2 focus:outline-offset-1 focus:outline-primary-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto ${className}`}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-describedby={ariaDescribedby}
        {...rest}
      />
      <CheckboxIcon className={checkBoxclass} />
    </>
  );
}

export default InputCheckbox;

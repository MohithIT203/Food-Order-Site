import Select from 'react-select';
import '../styles/dropdown.css'

function Dropdown({ name, options, onChange, value }) {
  const formattedOptions = options.map((opt, i) => ({
    label: opt.label||opt,
    value: i,
  }));
  // console.log(formattedOptions);
  return (
    <Select
      className="basic-single"
      classNamePrefix="select"
      name={name}
      options={formattedOptions}
      value={formattedOptions[value] || null}
      onChange={(selectedOption) => onChange(selectedOption.value)}
      // MenuHeight={10}  
      // maxMenuHeight={150}
      menuPlacement="auto"
    />
  );
}

export default Dropdown;
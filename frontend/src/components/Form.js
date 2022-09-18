function Form({ formInputs, onSubmit }) {
  return (
    <form>
      {formInputs}
      <button onClick={(evt) => onSubmit(evt)}>Submit</button>
    </form>
  );
}

export function createFormInputs(inputConfigs) {
  if (!Array.isArray(inputConfigs)) inputConfigs = [inputConfigs];
  return inputConfigs.map((inputConfig) => {
    let { id, label, value, updateFunc, inputType, error } = inputConfig;

    return (
      <div key={`input-${id}`}>
        <label htmlFor={id} data-testid={`input-label-${id}`}>
          {label}
        </label>
        <input
          id={id}
          aria-label={`${id}-input`}
          type={inputType || "text"}
          value={value}
          onChange={(evt) => updateFunc(evt.target.value)}
        ></input>
        <span data-testid={`input-error-${id}`}>{error}</span>
      </div>
    );
  });
}

export default Form;

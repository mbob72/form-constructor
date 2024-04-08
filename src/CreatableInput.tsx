import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useForm, Controller, UseControllerProps } from "react-hook-form";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";

export interface CreatableValueType {
  value?: string;
  label: string;
  draftValue?: string;
}

interface IForm {
  [k: string]: string;
}

const filter = createFilterOptions<CreatableValueType>();

export type CreatableInputProps = {
  rules: UseControllerProps["rules"];
  name: string;
  initValue?: string;
  options: CreatableValueType[];
  setOptions: Dispatch<SetStateAction<CreatableValueType[]>>;
};

export const CreatableInput: React.FC<CreatableInputProps> = ({
  name,
  initValue,
  rules,
  options,
  setOptions
}) => {
  const [value, setValue] = React.useState<CreatableValueType | "">(
    initValue ? { value: initValue, label: initValue } : "",
  );

  const {
    control,
    setValue: setFormValue,
    clearErrors,
    formState,
    setError,
  } = useForm<IForm>({
    mode: "onBlur",
    defaultValues: {
      [name]: initValue,
    },
  });

  const handleAddOption = (newValue: string) => {
    const addingOption = {
      label: newValue,
      value: newValue,
    };
    setOptions((rooms) => [...rooms, addingOption] as CreatableValueType[]);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete
            freeSolo
            selectOnFocus
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            value={value}
            onInputChange={(_, stringValue) => {
              if (formState.errors && formState.errors![name]) {
                clearErrors(name);
              }

              setFormValue(name, stringValue);
              setValue({
                label: stringValue,
                value: stringValue,
              } as CreatableValueType);
            }}
            onChange={(
              _e: SyntheticEvent<Element, Event>,
              newValue: CreatableValueType | string,
            ) => {
              if (typeof newValue === "string") {
                setValue({
                  label: newValue,
                  value: newValue,
                });
                return;
              }
              if (newValue?.draftValue) {
                // Create a new value from the user input
                setFormValue(name, newValue.draftValue, {
                  shouldValidate: true,
                });

                setValue({
                  label: newValue.draftValue,
                  value: newValue.draftValue,
                } as CreatableValueType);

                setTimeout(() => {
                  if (!fieldState.error) {
                    handleAddOption(newValue.draftValue as string);
                  }
                }, 0);
                return;
              }
              setValue(newValue);
            }}
            filterOptions={(
              options: CreatableValueType[],
              params: {
                inputValue: string;
                getOptionLabel: (option: CreatableValueType) => string;
              },
            ) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some(
                (option) => inputValue === option.value,
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  draftValue: inputValue,
                  label: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            options={options}
            getOptionLabel={(option: CreatableValueType | string) => {
              // Value selected with enter, right from the input

              if (typeof option === "string") {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.draftValue) {
                return option.draftValue;
              }
              // Regular option
              return option.label;
            }}
            renderOption={(props, option: CreatableValueType | string) => (
              <li key={option.toString()} {...props}>
                {(option as CreatableValueType).label}
              </li>
            )}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  inputRef={field.ref}
                  sx={{
                    minWidth: 200,
                  }}
                  error={!!fieldState?.error}
                  helperText={fieldState?.error?.message}
                  onBlur={() => {
                    field.onBlur();
                    if (
                      !options.some(
                        ({ label: _value }) => _value === value?.value,
                      )
                    ) {
                      setTimeout(() => {
                        setError(name, {
                          type: "optionDidntPut",
                          message: "You didn't put new option in options list",
                        });
                      }, 0);
                    }
                  }}
                  label="Choose or create room name"
                />
              );
            }}
          />
        );
      }}
    />
  );
}

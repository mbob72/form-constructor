import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useForm, Controller } from "react-hook-form";
import { SyntheticEvent } from "react";

interface RoomType {
  value?: string;
  label: string;
  draftValue?: string;
}

interface IForm {
  roomName: string;
}

const filter = createFilterOptions<RoomType>();

const min = 7; // TODO: I propose throw this value like a prop to this component
// TODO: also add `max`

const rules = {
  required: "It couldn't be empty field",
  minLength: {
    value: min,
    message: `Room name should have at least ${min} characters`,
  },
  pattern: {
    value: /^[a-zA-Z.+'-_]+(?:\s[a-zA-Z.+'-_]+)*\s?$/i,
    message:
      "You can use only alphabetical symbols, and .+'-_ symbols, and blank space as words devider",
  },
};

const initValue = "";

export function RoomCreatable() {
  const [value, setValue] = React.useState<RoomType | string>(initValue);
  const [options, setOptions] = React.useState<RoomType[]>([]);

  const {
    control,
    setValue: setFormValue,
    clearErrors,
    formState,
    setError,
  } = useForm<IForm>({
    mode: "onBlur",
    defaultValues: {
      roomName: initValue,
    },
  });

  const handleAddOption = (newValue: string) => {
    const addingOption = {
      label: newValue,
      value: newValue,
    };
    setOptions((rooms) => [...rooms, addingOption] as RoomType[]);
  };

  return (
    <Controller
      control={control}
      name="roomName"
      rules={rules}
      render={({ field, fieldState }) => {
        return (
          <Autocomplete
            freeSolo
            selectOnFocus
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            value={value}
            onBlur={() => console.log("blur 1")}
            onInputChange={(_, stringValue) => {
              if (formState.errors?.roomName) {
                clearErrors("roomName");
              }

              setFormValue("roomName", stringValue);
              setValue({
                label: stringValue,
                value: stringValue,
              } as RoomType);
            }}
            onChange={(
              _e: SyntheticEvent<Element, Event>,
              newValue: RoomType | string | null,
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
                setFormValue("roomName", newValue.draftValue, {
                  shouldValidate: true,
                });

                setValue({
                  label: newValue.draftValue,
                  value: newValue.draftValue,
                } as RoomType);

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
              options: RoomType[],
              params: {
                inputValue: string;
                getOptionLabel: (option: RoomType) => string;
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
            getOptionLabel={(option: RoomType | string) => {
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
            renderOption={(props, option: RoomType | string) => (
              <li key={option.toString()} {...props}>
                {(option as RoomType).label}
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
                  onChange={(e, str) => console.log("lkjlkjlkj")}
                  onBlur={() => {
                    field.onBlur();
                    if (
                      !options.some(
                        ({ value: _value }) => _value === value?.value,
                      )
                    ) {
                      setTimeout(() => {
                        console.log("blur 2");
                        setError("roomName", {
                          type: "optionDidntPut",
                          message: "You didn't put new option in options list",
                        });
                      }, 100);
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

import { useForm, SubmitHandler } from "react-hook-form";
import { Button, MenuItem, TextField } from "@mui/material";

interface IFormInput {
  surfaceName: string;
  repeater: string;
  repeat: {
    daily: number;
    weekly: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

const repeaterType = [
  { value: "monthly", label: "monthly" },
  { value: "x_monthly", label: "x times a month" },
  { value: "quarterly", label: "quarterly" },
  { value: "x_quarterly", label: "x times a quarter" },
  { value: "semi-annually", label: "semi-annually" },
  { value: "x_semi-annually", label: "x times semi-annually" },
  { value: "annually", label: "annually" },
  { value: "x_annually", label: "x times annually" },
  { value: "2years", label: "every 2 years" },
  { value: "x_2years", label: "x times every 2 years" },
] as const;

const surfaceTypes = [
  { value: "Tail", label: "Tail" },
  { value: "Windows", label: "Windows" },
  { value: "Tables", label: "Tables" },
];

const Surface = () => {
  const {
    handleSubmit,
    watch,
    formState: { errors },
    register,
    trigger,
  } = useForm({
    defaultValues: {
      surfaceName: "",
      repeater: repeaterType[0].value,
      repeat: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      material: surfaceTypes[0].value,
      square: 0,
    },
    mode: "onBlur",
  });
  const repeater = watch("repeater").split("_")[1];

  const registerSurfaceName = register("surfaceName", {
    minLength: {
      value: 2,
      message: "Surface name should have at least 2 characters",
    },
    required: true,
  });

  const registerRepeater = register(`repeat.${repeater}`, {
    min: { value: 0, message: "It couldn't be negative number" },
  });

  const squareRegister = register(`square`, {
    min: { value: 0, message: "It couldn't be negative number" },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const selectInputProps = register("repeater", {
    required: "Please enter repeater",
  });

  const surfaceTypesInputProps = register("material", {
    required: "Please enter type of surface",
  });

  console.log("errors::", errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <TextField
        {...registerSurfaceName}
        label="Surface name"
        onChange={(e) => {
          registerSurfaceName.onChange(e);
          if (errors.surfaceName) {
            trigger("surfaceName").then(() => {});
          }
        }}
        helperText={errors.surfaceName?.message}
        error={!!errors.surfaceName} // Display error state if there's an error for surfaceName
        placeholder="Type in here…"
      />
      <TextField
        label={"Surface square"}
        {...squareRegister}
        className="tail"
        onChange={(e) => {
          squareRegister.onChange(e);
          if (errors?.square) {
            trigger(`square`).then(() => {});
          }
        }}
        type={"number"}
        placeholder="Type in here…"
        helperText={errors.square && errors.square!.message}
        error={!!errors?.square && !!errors?.square}
      />
      <TextField
        select
        className="width200"
        label="Select"
        defaultValue={repeaterType[0].value}
        fullWidth
        inputProps={selectInputProps}
      >
        {repeaterType.map(({ value, label }) => (
          <MenuItem value={value}>{label}</MenuItem>
        ))}
      </TextField>
      <div>
        {repeater && (
          <TextField
            label={repeater + ", times"}
            {...registerRepeater}
            onChange={(e) => {
              registerRepeater.onChange(e);
              if (errors?.repeat && !!errors?.repeat[repeater]) {
                trigger(`repeat.${repeater}`).then(() => {});
              }
            }}
            type={"number"}
            placeholder="Type in here…"
            helperText={errors.repeat && errors.repeat![repeater].message}
            error={!!errors?.repeat && !!errors?.repeat[repeater]}
          />
        )}
      </div>

      <TextField
        select
        label="Surface type"
        defaultValue={surfaceTypes[0].value}
        className="width200"
        fullWidth
        inputProps={surfaceTypesInputProps}
      >
        {surfaceTypes.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="outlined" type="submit" className="tail3">
        Subscribe
      </Button>
    </form>
  );
};
export default Surface;

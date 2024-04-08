import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { Button, MenuItem, TextField } from "@mui/material";
import { RoomCreatable } from "./RoomCreatable";

interface IFormInput {
  roomName: string;
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
  { value: "daily", label: "daily" },
  { value: "x_daily", label: "x times a day" },
  { value: "weekly", label: "weekly" },
  { value: "x_weekly", label: "x times a week" },
  { value: "monthly", label: "monthly" },
  { value: "x_monthly", label: "x times a month" },
  { value: "quarterly", label: "quarterly" },
  { value: "x_quarterly", label: "x times a quarter" },
  { value: "yearly", label: "yearly" },
  { value: "x_yearly", label: "x times a year" },
] as const;

const materials = [
  { value: "Teppich", label: "Teppich" },
  { value: "Fliesen", label: "Fliesen" },
  { value: "Laminatt", label: "Laminatt" },
  { value: "Holzböden", label: "Holzböden" },
  { value: "Industrieböden", label: "Industrieböden" },
];

const Room = () => {
  const methods = useForm({
    defaultValues: {
      roomName: "",
      repeater: repeaterType[0].value,
      repeat: {
        daily: 0,
        weekly: 0,
        monthly: 0,
        quarterly: 0,
        yearly: 0,
      },
      material: materials[0].value,
      square: 0,
    },
    mode: "onBlur",
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
    register,
    trigger,
  } = methods;
  const repeater = watch("repeater").split("_")[1];

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

  const materialInputProps = register("material", {
    required: "Please enter maretiral",
  });

  console.log("errors::", errors);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <RoomCreatable />
        <TextField
          label={"Room square"}
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
          label="Material"
          defaultValue={materials[0].value}
          className="width200"
          fullWidth
          inputProps={materialInputProps}
        >
          {materials.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="outlined" type="submit" className="tail3">
          Subscribe
        </Button>
      </form>
    </FormProvider>
  );
};
export default Room;

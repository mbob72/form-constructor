import Room from "./Room";
import { useState } from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { AddCircleOutlineOutlined } from "@mui/icons-material";

export const Rooms = () => {
  const [state, setState] = useState([1]);
  const remove = (ind: number) => () =>
    setState((st) => [...st.slice(0, ind), ...st.slice(ind + 1)]);
  const add = () => setState((st) => [...st, st.length]);

  return (
    <div>
      {state.map((item, ind) => (
        <div className="room" key={item}>
          <RemoveCircleOutlineIcon
            className="delete-room"
            sx={{
              alignSelf: "start",
              justifySelf: "center",
              marginTop: "2em",
            }}
            onClick={remove(ind)}
          />
          <Room />
        </div>
      ))}
      <AddCircleOutlineOutlined className={"add-room"} onClick={add} />
    </div>
  );
}

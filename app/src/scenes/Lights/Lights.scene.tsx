import React, { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

import { AppState } from "../../store";
import { fetchLights, Light, check, setTimeMinutes } from "./Lights.state";
import { colours } from "./colours";

const Lights = (props: Props) => {
  const { lights, fetchLights, check } = props;

  useEffect(() => {
    fetchLights();
  }, [fetchLights]);

  const LightSingle = (light: Light & { checked: boolean }) => {
    const { data } = light;
    const { hueIndex, name, state } = data;
    const { on } = state;

    const onText = on ? "ON" : "OFF";

    return (
      <div key={hueIndex}>
        <input
          type="checkbox"
          id={`lightToggle${hueIndex}`}
          checked={light.checked}
          readOnly={true}
        ></input>
        <label
          htmlFor={`lightToggle${hueIndex}`}
          onClick={() => {
            check(hueIndex);
          }}
        >
          {name}: {onText}
        </label>
      </div>
    );
  };

  return (
    <div>
      <h2>Lights</h2>
      {lights.length > 0 ? lights.map(LightSingle) : null}
      <h2>Timing</h2>
      <select
        onChange={e => {
          props.setTimeMinutes(e.target.value);
        }}
        value={props.timeMinutes}
      >
        {[1, 10, 20, 30, 60].map(minutes => (
          <option key={minutes} value={minutes.toString()}>
            {minutes} minute{minutes > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <h2>Brightness</h2>
      <p>
        <select>
          {Array.from({ length: 255 }).map((v, index) => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>
      </p>
      <p>
        <button onClick={() => {}}>Go</button>
      </p>

      <h2>Colour</h2>
      <p>
        <select>
          {colours.map(colour => (
            <option key={colour} value={colour}>
              {colour}
            </option>
          ))}
        </select>
      </p>
      <p>
        <button onClick={() => {}}>Go</button>
      </p>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    lights: state.Lights.lights,
    brightness: state.Lights.brightness,
    colour: state.Lights.colour,
    timeMinutes: state.Lights.timeMinutes
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>
) => {
  return {
    fetchLights: () => dispatch(fetchLights()),
    check: (hueIndex: number) => dispatch(check(hueIndex)),
    setTimeMinutes: (minutes: string) =>
      dispatch(setTimeMinutes(parseInt(minutes)))
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lights);

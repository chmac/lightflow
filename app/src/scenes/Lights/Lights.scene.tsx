import React, { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

import { AppState } from "../../store";
import { fetchLights, Light, check } from "./Lights.state";
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
      <select>
        <option value="1">1 minute</option>
        <option value="10">10 minutes</option>
        <option value="20">20 minutes</option>
        <option value="30">30 minutes</option>
        <option value="60">60 minutes</option>
      </select>

      <h2>Brightness</h2>
      <select>
        {Array.from({ length: 255 }).map((v, index) => (
          <option key={index} value={index}>
            {index}
          </option>
        ))}
      </select>
      <button>Go</button>

      <h2>Colour</h2>
      <select>
        {colours.map(colour => (
          <option key={colour} value={colour}>
            {colour}
          </option>
        ))}
      </select>
      <button>Go</button>
    </div>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    lights: state.Lights.lights
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>
) => {
  return {
    fetchLights: () => dispatch(fetchLights()),
    check: (hueIndex: number) => dispatch(check(hueIndex))
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lights);

import React, { useEffect } from "react";
import { AppState } from "../../store";
import { fetchLights, Light, check } from "./Lights.state";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

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
      <h1>Lights</h1>
      {lights.length > 0 ? lights.map(LightSingle) : null}
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

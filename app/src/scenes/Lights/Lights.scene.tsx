import React, { useEffect } from "react";
import { AppState } from "../../store";
import { fetchLights, Light } from "./Lights.state";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";

const LightSingle = (light: Light) => {
  const onText = light.state.on ? "ON" : "OFF";
  return (
    <div key={light.hueIndex}>
      {light.name}: {onText}
    </div>
  );
};

const Lights = (props: Props) => {
  const { lights, fetchLights } = props;

  useEffect(() => {
    fetchLights();
  }, [fetchLights]);

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
    fetchLights: () => dispatch(fetchLights())
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lights);

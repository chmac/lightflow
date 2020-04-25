import React, { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { Typography, Paper, makeStyles, Button } from "@material-ui/core";

import { AppState } from "../../store";
import {
  fetchLights,
  Light,
  check,
  setTimeMinutes,
  setBrightness,
  goToBrightness,
  setColour,
  goToColour,
} from "./Lights.state";
import { colours } from "./colours";

const Lights = (props: Props) => {
  const {
    lights,
    fetchLights,
    check,
    colour,
    setColour,
    goToColour,
    timeMinutes,
    setTimeMinutes,
    brightness,
    setBrightness,
    goToBrightness,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    fetchLights();
  }, [fetchLights]);

  const LightSingle = (light: Light & { checked: boolean }) => {
    const { data } = light;
    const { hueIndex, name, state } = data;
    const { on } = state;

    const onText = on ? "ON" : "OFF";

    return (
      <Typography
        key={hueIndex}
        onClick={() => {
          check(hueIndex);
        }}
        style={light.checked ? { backgroundColor: "lightgreen" } : {}}
      >
        <input
          type="checkbox"
          id={`lightToggle${hueIndex}`}
          checked={light.checked}
          readOnly={true}
        ></input>{" "}
        {name}: {onText}
      </Typography>
    );
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Lights</Typography>
      {lights.length > 0 ? lights.map(LightSingle) : null}
      <Typography variant="h2">Timing</Typography>
      <select
        onChange={(e) => {
          setTimeMinutes(e.target.value);
        }}
        value={timeMinutes}
        style={{
          fontSize: "0.8em",
        }}
      >
        {[1, 10, 20, 30, 60].map((minutes) => (
          <option key={minutes} value={minutes}>
            {minutes} minute{minutes > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <Typography variant="h2">Brightness</Typography>
      <Typography>
        <select
          value={brightness}
          onChange={(e) => {
            setBrightness(e.target.value);
          }}
          style={{
            fontSize: "0.8em",
          }}
        >
          {Array.from({ length: 21 }).map((v, index) => (
            <option key={index} value={index}>
              {index}
            </option>
          ))}
        </select>
      </Typography>
      <Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              goToBrightness();
            }
          }}
        >
          Go
        </Button>
      </Typography>

      <Typography variant="h2">Colour</Typography>
      <Typography>
        <select
          value={colour}
          onChange={(e) => {
            setColour(e.target.value);
          }}
          style={{
            fontSize: "0.8em",
          }}
        >
          {colours.map((colour) => (
            <option key={colour} value={colour}>
              {colour}
            </option>
          ))}
        </select>
      </Typography>
      <Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (window.confirm("Are you sure?")) {
              goToColour();
            }
          }}
        >
          Go
        </Button>
      </Typography>
    </Paper>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    lights: state.Lights.lights,
    brightness: state.Lights.brightness,
    colour: state.Lights.colour,
    timeMinutes: state.Lights.timeMinutes,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<AppState, {}, AnyAction>
) => {
  return {
    fetchLights: () => dispatch(fetchLights()),
    check: (hueIndex: number) => dispatch(check(hueIndex)),
    setTimeMinutes: (minutes: string) =>
      dispatch(setTimeMinutes(parseInt(minutes))),
    setBrightness: (brightness: string) =>
      dispatch(setBrightness(parseInt(brightness))),
    goToBrightness: () => dispatch(goToBrightness()),
    setColour: (colour: string) => dispatch(setColour(colour)),
    goToColour: () => dispatch(goToColour()),
  };
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

export default connect(mapStateToProps, mapDispatchToProps)(Lights);

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
  };
});

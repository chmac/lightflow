import React, { useEffect } from "react";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import {
  Typography,
  Paper,
  makeStyles,
  Button,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";

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

export const BRIGHTNESS_UI_LEVELS = 20;

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
      <FormControlLabel
        key={hueIndex}
        control={
          <Checkbox onChange={() => check(hueIndex)} checked={light.checked} />
        }
        label={`${name}: ${onText}`}
      />
    );
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Lights</Typography>
      {lights.length > 0 ? lights.map(LightSingle) : null}
      <Typography variant="h2">Timing</Typography>
      <Select
        className={classes.select}
        onChange={(e) => {
          setTimeMinutes(e.target.value as string);
        }}
        value={timeMinutes}
      >
        {[1, 10, 20, 30, 60].map((minutes) => (
          <MenuItem key={minutes} value={minutes}>
            {minutes} minute{minutes > 1 ? "s" : ""}
          </MenuItem>
        ))}
      </Select>

      <Typography variant="h2">Brightness</Typography>
      <Select
        className={classes.select}
        value={brightness}
        onChange={(e) => {
          setBrightness(e.target.value as string);
        }}
      >
        {/* We add 1 to the brightness levels here as this is 0 indexed */}
        {Array.from({ length: BRIGHTNESS_UI_LEVELS + 1 }).map((v, index) => (
          <MenuItem key={index} value={index}>
            {Math.round((index / BRIGHTNESS_UI_LEVELS) * 100)}%
          </MenuItem>
        ))}
      </Select>
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
      <Select
        className={classes.select}
        value={colour}
        onChange={(e) => {
          setColour(e.target.value as string);
        }}
      >
        {colours.map((colour) => (
          <MenuItem key={colour} value={colour}>
            {colour}
          </MenuItem>
        ))}
      </Select>
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
    select: {
      width: "100%",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  };
});

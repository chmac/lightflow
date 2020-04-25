import React, { useEffect } from "react";
import { fetchLog } from "./Log.state";
import { useDispatch, useSelector } from "react-redux";
import { Paper, makeStyles, Typography, Button } from "@material-ui/core";

import { AppState } from "../../store";

const Log = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const logs = useSelector((state: AppState) => state.Log.log);

  useEffect(() => {
    dispatch(fetchLog());
  }, [dispatch]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Log</Typography>
      <Button
        variant="contained"
        onClick={() => {
          dispatch(fetchLog());
        }}
      >
        Refresh
      </Button>
      <ul>
        {logs.reverse().map(({ message, time, params }) => (
          <li>
            {time}: {message}: {params}
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default Log;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
  };
});

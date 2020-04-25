import React, { useEffect } from "react";
import { fetchLog } from "./Log.state";
import { useDispatch, useSelector } from "react-redux";
import { Paper, makeStyles, Typography, Button } from "@material-ui/core";

import { AppState } from "../../store";

const timestampToHuman = (timestamp: number) => {
  var d = new Date(timestamp * 1e3);
  return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

const Log = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const logs = useSelector((state: AppState) => state.Log.log.slice(20));

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
      {logs.map(({ message, time, params }, i) => (
        <Typography key={i} className={classes.item}>
          {timestampToHuman(time)}: {message}
          <br /> {params}
        </Typography>
      ))}
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
    item: {
      borderBottom: "1px solid black",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  };
});

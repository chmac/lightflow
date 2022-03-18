import React from "react";
import { Paper, Typography, Button, makeStyles } from "@material-ui/core";

import { Restart as RestartMutation } from "./Restart.mutations";
import { removeHueUsername, requestGraphql } from "../../requestGraphql";

const sendRestart = async () => {
  if (window.confirm("Are you sure you want to restart the server?"))
    try {
      const data = await requestGraphql<{ restart: { success: boolean } }>(
        RestartMutation
      );
      if (data.restart.success) {
        alert("Restart success. #FQK6li");
      }
    } catch (error) {
      alert(`Restart failed. #arN4YX\n${error.message}`);
    }
};

const Restart = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2">Restart</Typography>
      <Typography className={classes.p}>
        Warning, this will kill all ongoing operations.
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          sendRestart();
        }}
      >
        Restart server
      </Button>
      <Typography className={classes.p}>
        If you want to re-enter your hue username, you can delete the settings
        (which are saved in your browser).
      </Typography>
      <Button
        onClick={() => {
          if (globalThis.confirm(`Are you sure? #QAbqdA`)) {
            removeHueUsername();
            globalThis.location.reload();
          }
        }}
      >
        Delete settings
      </Button>
    </Paper>
  );
};

export default Restart;

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: theme.spacing(2),
      margin: theme.spacing(2),
    },
    p: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
  };
});

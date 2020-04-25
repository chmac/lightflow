import React from "react";
import { Provider } from "react-redux";
import { Grid, makeStyles, CssBaseline } from "@material-ui/core";

import { store } from "./store";

import Lights from "./scenes/Lights";
import Log from "./scenes/Log/Log.scene";

const App: React.FC = () => {
  const classes = useStyles();

  return (
    <Provider store={store}>
      <CssBaseline />
      <div className="App">
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12} className={classes.item}>
            <Lights />
          </Grid>
          <Grid item sm={6} xs={12} className={classes.item}>
            <Log />
          </Grid>
        </Grid>
      </div>
    </Provider>
  );
};

export default App;

const useStyles = makeStyles((theme) => {
  return {
    item: {
      padding: theme.spacing(2),
    },
  };
});

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { getHueUsername, setHueUsername } from "./requestGraphql";

if (getHueUsername() === "") {
  const HUE_USERNAME = globalThis.prompt(`Enter your hue username #ywPEVn`);
  if (typeof HUE_USERNAME === "string" && HUE_USERNAME.length > 5) {
    setHueUsername(HUE_USERNAME);
  } else {
    globalThis.alert(
      `Error: This is not a valid hue username. ` +
        `See the hue docs for more. #Cv3vtX\n\n` +
        `https://developers.meethue.com/develop/get-started-2/`
    );
  }
  globalThis.window.location.reload();
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

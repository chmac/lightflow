import React from "react";
import { Provider } from "react-redux";

import { store } from "./store";

import Lights from "./scenes/Lights";
import Log from "./scenes/Log/Log.scene";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div
        className="App"
        style={{
          maxWidth: "300px",
          margin: "auto",
          fontSize: "1.4em",
        }}
      >
        <Lights />
        <Log />
      </div>
    </Provider>
  );
};

export default App;

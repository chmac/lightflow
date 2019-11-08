import React from "react";
import { Provider } from "react-redux";

import { store } from "./store";

import Lights from "./scenes/Lights";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Lights />
      </div>
    </Provider>
  );
};

export default App;

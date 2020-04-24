import React, { useEffect } from "react";
import { fetchLog } from "./Log.state";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";

const Log = () => {
  const dispatch = useDispatch();
  const logs = useSelector((state: AppState) => state.Log.log);

  useEffect(() => {
    dispatch(fetchLog());
  }, [dispatch]);

  return (
    <div style={{ paddingLeft: 20, paddingRight: 20 }}>
      <h1>Log</h1>
      <button
        onClick={() => {
          dispatch(fetchLog());
        }}
        style={{
          fontSize: "0.8em",
        }}
      >
        Refresh
      </button>
      <ul>
        {logs.reverse().map(({ message, time, params }) => (
          <li>
            {time}: {message}: {params}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Log;

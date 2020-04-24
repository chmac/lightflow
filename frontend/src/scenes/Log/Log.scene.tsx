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
    <div>
      <h1>Log</h1>
      <ul>
        {logs.map(({ message, time, params }) => (
          <li>
            {time}: {message}: {params}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Log;

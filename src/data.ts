import nedb from "nedb";

export const Settings = new nedb({
  filename: "../data/settings",
  autoload: true
});

export const Actions = new nedb({
  filename: "../data/actions",
  autoload: true
});

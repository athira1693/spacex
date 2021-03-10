import { Chip } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  success: {
    backgroundColor: "#def7ec",
    color: "#105e49",
  },
  failed: {
    backgroundColor: "#fde2e1",
    color: "#b14d4d",
  },
  upcoming: {
    backgroundColor: "#fef3c7",
    color: "#994b1a",
  },
});

export default function Status({ status }) {
  const classes = useStyles();
  switch (status.toLowerCase()) {
    case "success":
      return <Chip className={classes.success} label={status} />;

    case "failed":
      return <Chip className={classes.failed} label={status} />;

    case "upcoming":
      return <Chip className={classes.upcoming} label={status} />;

    default:
      break;
  }
}

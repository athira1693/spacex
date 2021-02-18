import { Grid } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoadingIndicator from "./LoadingIndicator";

const useStyles = makeStyles({
  root: {},
});

export default function Launches() {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item container justify="space-between"></Grid>
    </Grid>
  );
}

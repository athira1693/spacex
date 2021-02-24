import { Grid } from "@material-ui/core";
import React from "react";
import Loader from "react-loader-spinner";

export default function LoadingIndicator() {
  return (
    <Grid
      style={{ height: "100%", width: "100%" }}
      container
      alignItems="center"
      justify="center"
    >
      <Loader
        visible={true}
        type="Circles"
        color="Grey"
        height={100}
        width={100}
      />
    </Grid>
  );
}

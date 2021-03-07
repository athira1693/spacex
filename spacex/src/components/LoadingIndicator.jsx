import { Grid } from "@material-ui/core";
import React from "react";
import Loader from "react-loader-spinner";

export default function LoadingIndicator() {
  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      style={{ height: "80vh" }}
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

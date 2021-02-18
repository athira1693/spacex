import React from "react";
import Loader from "react-loader-spinner";

export default function LoadingIndicator() {
  return (
    <Loader
      visible={true}
      type="Circles"
      color="Grey"
      height={100}
      width={100}
    />
  );
}

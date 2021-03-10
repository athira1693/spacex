import { Box, Typography } from "@material-ui/core";
import React from "react";

export default function NoData() {
  return (
    <Typography>
      <Box fontWeight="fontWeightMedium" m={5}>
        No results found for the specified filter
      </Box>
    </Typography>
  );
}

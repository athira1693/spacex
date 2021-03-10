import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import Status from "./Status";
import nasa from "../nasa.svg";
import wiki from "../wiki.svg";
import youtube from "../youtube.svg";
import moment from "moment";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  linkIcons: {},
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Grid container>{children}</Grid>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function SingleLaunchDetails({
  selectedRow,
  status,
  handleClose,
}) {
  const [details, setDetails] = useState({});

  useEffect(() => {
    let detailsObj = {
      "Flight Number": selectedRow.flight_number,
      "Mission Name": selectedRow.mission_name,
      "Rocket Type": selectedRow.rocket.rocket_type,
      "Rocket Name": selectedRow.rocket.rocket_name,
      Manufacturer: selectedRow.rocket.second_stage.payloads.manufacturer,
      Nationality: selectedRow.rocket.second_stage.payloads.nationality,
      "Launch Date": moment
        .utc(selectedRow.launch_date_utc)
        .format("DD MMMM YYYY HH:mm"),
      "Payload Type": selectedRow.rocket.second_stage.payloads.payload_type,
      Orbit: selectedRow.rocket.second_stage.payloads.orbit,
      "Launch Site": selectedRow.launch_site.site_name,
    };
    setDetails(detailsObj);
  }, []);

  return (
    <Dialog onClose={handleClose} open={selectedRow} className="singleLaunch">
      <DialogTitle id="dialog-title" onClose={handleClose}>
        <Grid item xs={2}>
          <img
            style={{ width: "4.5em", height: "4.5em" }}
            src={selectedRow.links.mission_patch_small}
            alt={selectedRow.mission_name}
          />
        </Grid>
        <Grid item container direction="column" xs={10}>
          <Typography variant="h6">
            <span style={{ marginRight: "10px" }}>
              {selectedRow.mission_name}
            </span>
            <Status status={status} />
          </Typography>

          <Typography variant="caption">
            {selectedRow.rocket.rocket_name}
          </Typography>
          <span>
            <a
              href={selectedRow.links.article_link}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={nasa} />
            </a>
            <a
              href={selectedRow.links.wikipedia}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={wiki} />
            </a>
            <a
              href={selectedRow.links.video_link}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={youtube} />
            </a>
          </span>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          {selectedRow.details}
         {selectedRow.details && <a
            href={selectedRow.links.wikipedia}
            target="_blank"
            rel="noreferrer noopener"
            style={{ textDecoration: "none" }}
          >
            Wikipedia
          </a>}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {Object.entries(details).map(([key, value]) => {
                return (
                  <TableRow>
                    <TableCell style={{ paddingLeft: 0 }}>{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}

{
  /* <Grid container>
          {Object.entries(details).map(([key, value]) => {
            return (
              <Grid item container>
                <Grid item xs={4}>
                  {key}
                </Grid>
                <Grid item>{value}</Grid>
              </Grid>
            );
          })}
        </Grid> */
}

import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";

const date = new Date();

const definedRanges = [
  {
    label: "Past Week",
    startDate: addWeeks(date, -1),
    endDate: date,
  },
  {
    label: "Past Month",
    startDate: addMonths(date, -1),
    endDate: endOfMonth(date),
  },
  {
    label: "Past 3 Months",
    startDate: addMonths(date, -3),
    endDate: date,
  },
  {
    label: "Past 6 Months",
    startDate: addMonths(date, -6),
    endDate: date,
  },
  {
    label: "Past Year",
    startDate: addMonths(date, -12),
    endDate: date,
  },
  {
    label: "Past 2 Years",
    startDate: addMonths(date, -24),
    endDate: date,
  },
];

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
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography variant="h6">{children}</Typography>
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

export default function DateRangeModal({
  setDateRange,
  openDateRange,
  handleOpenDateRange,
  handleCloseDateRange,
  dateRangeClass,
}) {
  const [open, setOpen] = useState(true);
  console.log("defaultRanges", definedRanges);

  return (
    // <Dialog width={"120px"} height={"120px"}>
    //   <DateRangePicker
    //     open={true}
    //     toggle={() => {}}
    //     onChange={(range) => setDateRange(range)}
    //   />
    // </Dialog>

    <Dialog
      open={open}
      maxWidth={false}
      onClose={() => {
        setOpen(false);
        handleCloseDateRange();
        console.log(" here");
      }}
      // onBackdropClick={() => {
      //   setOpen(false);
      //   handleCloseDateRange();
      //   console.log("changed");
      // }}
    >
      <DialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
        " asd "{" "}
      </DialogTitle>
      <DateRangePicker
        definedRanges={definedRanges}
        className={dateRangeClass}
        open={openDateRange}
        toggle={() => {}}
        onChange={(range) => setDateRange(range)}
      />
    </Dialog>
  );
}

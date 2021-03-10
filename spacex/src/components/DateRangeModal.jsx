import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DateRangePicker } from "materialui-daterange-picker";
import { addWeeks, endOfMonth, addMonths } from "date-fns";
import moment from "moment";
import { Backdrop } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const date = new Date();

export const definedRanges = [
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
  {
    label: "All dates",
    startDate: null,
    endDate: null,
  },
];

export const getQueriedRange = (start, end) => {
  let dateObj =
    start && end
      ? definedRanges.find((range) => {
          if (range.startDate) {
            return(
            moment(range.startDate.toDateString()).isSame(
              start.toDateString()
            ) &&
              moment(range.endDate.toDateString()).isSame(end.toDateString()))
          }
        })
      : { label: `All dates`, startDate: null, endDate: null };
  return dateObj
    ? dateObj
    : {
        label: `${start.toDateString()} - ${end.toDateString()}`,
        startDate: start,
        endDate: end,
      };
};

export const isDateBetween = (date, startDate, endDate) => {
  let givenDate = new Date(date).toDateString();
  return moment(givenDate).isBetween(
    startDate.toDateString(),
    endDate.toDateString()
  );
};

const DateRangeModal = ({
  dateRange,
  setDateRange,
  openDateRange,
  handleCloseDateRange,
  toggle,
}) => {
  const classes = useStyles();

  const handleDateChange = (range) => {
    if (!range.hasOwnProperty("startDate")) {
      setDateRange({ label: "All dates", startDate: null, endDate: null });
    } else if (!range.label) {
      setDateRange({
        ...range,
        label: `${range.startDate.toDateString()} - ${range.endDate.toDateString()}`,
      });
    } else {
      setDateRange(range);
    }
  };

  return (
    <Backdrop
      className={classes.backdrop}
      open={openDateRange}
      id="dateRangeBackdrop"
      onClick={(e) => {
        if (e.target.id === "dateRangeBackdrop") {
          handleCloseDateRange();
        }
      }}
    >
      <DateRangePicker
        initialDateRange={dateRange}
        definedRanges={definedRanges}
        closeOnClickOutside
        open={openDateRange}
        toggle={toggle}
        onChange={handleDateChange}
      />
    </Backdrop>
  );
};

export default React.memo(DateRangeModal);

import { Button, Grid, InputAdornment, TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import LoadingIndicator from "./LoadingIndicator";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import {
  fetchAllLaunches,
  fetchPastLaunches,
  fetchUpcomingLaunches,
} from "../redux/actions/launchesActions";
import Status from "./Status";
import Autocomplete from "@material-ui/lab/Autocomplete";
import filterIcon from "../filterIcon.svg";

import DateRangeModal, {
  definedRanges,
  isDateBetween,
  getQueriedRange,
} from "./DateRangeModal";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CalendarTodayOutlinedIcon from "@material-ui/icons/CalendarTodayOutlined";
import { useHistory } from "react-router-dom";
import querystring from "querystring";
import NoData from "./NoData";
import SingleLaunchDetails from "./SingleLaunchDetails";

const useStyles = makeStyles((theme) => ({
  root: {
    // margin: "2vh 10vw",
  },
  container: {
    minHeight: "676px",
    width: "952px",
  },
  pagination: {
    float: "right",
    marginTop: "2vh",
  },
  statusFilter: {
    "&.MuiInput-underline": {
      "&&&:before": {
        borderBottom: "none",
      },
      "&&:after": {
        borderBottom: "none",
      },
    },
    fontSize:'16px'
  },
  tableRow: {
    "&.Mui-selected": {
      backgroundColor: "#f5f5f5",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
  },
}));

const headings = [
  { id: "number", label: "No:" },
  {
    id: "launchedDate",
    label: "Launched\u00a0(UTC)",
    minWidth: "15%",
  },
  {
    id: "location",
    label: "Location",
    minWidth: "15%",
  },
  {
    id: "mission",
    label: "Mission",
    minWidth: "20%",
  },
  {
    id: "orbit",
    label: "Orbit",
  },
  {
    id: "launchStatus",
    label: "Launch Status",
    minWidth: "15%",
    align: "center",
  },
  {
    id: "rocket",
    label: "Rocket",
    minWidth: "15%",
  },
];

function createLauchList(
  number,
  launchedDate,
  location,
  mission,
  orbit,
  launchStatus,
  rocket
) {
  return {
    number,
    launchedDate,
    location,
    mission,
    orbit,
    launchStatus,
    rocket,
  };
}

function findStatus(isLaunchSuccess, isUpcoming) {
  return isUpcoming ? "Upcoming" : isLaunchSuccess ? "Success" : "Failed";
}

const launchOptions = [
  { id: "All Launches", value: "all" },
  { id: "Upcoming Launches", value: "upcoming" },
  { id: "Successful Launches", value: "success" },
  { id: "Failed Launches", value: "failed" },
];

export default function Launches() {
  const classes = useStyles();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const dispatch = useDispatch();
  const launches = useSelector((state) => state.launches);
  const [launchRows, setLaunchRows] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [launchStatus, setLaunchStatus] = useState("");
  const [openDateRange, setOpenDateRange] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  let history = useHistory();
  const { start, end, type } = querystring.parse(
    history.location.search.slice(1)
  );

  const statusProps = {
    options: launchOptions,
    getOptionLabel: (option) => option.id,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpenDateRange = () => {
    setOpenDateRange(true);
  };

  const handleCloseDateRange = () => {
    setOpenDateRange(false);
  };

  const handleStatusChange = (event, item) => {
    setLaunchStatus(item);
    switch (item.value) {
      case "all":
        dispatch(fetchAllLaunches());
        break;
      case "failed":
        dispatch(fetchPastLaunches(false));
        break;
      case "success":
        dispatch(fetchPastLaunches(true));
        break;
      case "upcoming":
        dispatch(fetchUpcomingLaunches());
        break;

      default:
        break;
    }
  };

  const filterLaunches = () => {
    if (launches.launches) {
      let lauchList = [];
      if (dateRange.label == "All dates") {
        launches.launches.map((launch) => {
          lauchList.push(
            createLauchList(
              launch.flight_number,
              moment.utc(launch.launch_date_utc).format("DD MMMM YYYY HH:mm"),
              launch.launch_site.site_name,
              launch.mission_name,
              launch.rocket.second_stage.payloads[0].orbit,
              findStatus(launch.launch_success, launch.upcoming),
              launch.rocket.rocket_name
            )
          );
        });
      } else
        launches.launches.map((launch) => {
          if (
            isDateBetween(
              launch.launch_date_utc,
              dateRange.startDate,
              dateRange.endDate
            )
          ) {
            lauchList.push(
              createLauchList(
                launch.flight_number,
                moment(launch.launch_date_utc).format("DD MMMM YYYY hh:mm"),
                launch.launch_site.site_name,
                launch.mission_name,
                launch.rocket.second_stage.payloads[0].orbit,
                findStatus(launch.launch_success, launch.upcoming),
                launch.rocket.rocket_name
              )
            );
          }
        });
      setLaunchRows([...lauchList]);
    }
  };

  const toggle = () => setOpenDateRange(!openDateRange);

  const handleDetailsDialog = (flightNumber, status) => {
    let row = launches.launches.find(
      (launch) => launch.flight_number == flightNumber
    );
    setSelectedRow({ row, status });
  };

  const closeDetailsDialog = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    let status = type
      ? launchOptions.find((opt) => {
          return opt.value == type;
        })
      : launchOptions[0];
    let date =
      start && end
        ? getQueriedRange(new Date(start), new Date(end))
        : definedRanges.find((range) => range.label === "All dates");

    setLaunchStatus(status);
    setDateRange(date);
    handleStatusChange(null, status);
  }, []);

  useEffect(() => {
    filterLaunches();
    setSelectedRow(null);
  }, [launches.launches, dateRange]);

  useEffect(() => {
    if (launchStatus && dateRange) {
      history.push({
        pathname: "/spacex",
        search: dateRange.startDate
          ? `start=${dateRange.startDate
              .toString()
              .replace("+", "%2B")}&end=${dateRange.endDate
              .toString()
              .replace("+", "%2B")}&type=${launchStatus.value}`
          : `start=&end=&type=${launchStatus.value}`,
      });
    }
    setPage(1);
  }, [launchStatus, dateRange]);

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      alignItems="center"
      spacing={3}
    >
      <Grid
        item
        container
        justify="space-between"
        style={{
          width: "952px",
        }}
        alignItems="center"
      >
        <Grid item>
          <Button
            disableRipple
            style={{ textTransform: "capitalize" }}
            onClick={handleOpenDateRange}
            startIcon={<CalendarTodayOutlinedIcon />}
            endIcon={<ArrowDropDownIcon />}
          >
            {dateRange.label}
          </Button>
        </Grid>
        <Grid item style={{ width: "25%" }}>
          <Autocomplete
          className="status"
            disableClearable
            onChange={handleStatusChange}
            {...statusProps}
            value={launchStatus}
            renderInput={(params) => (
              <TextField
                className={classes.statusFilter}
                {...params}
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="end">
                      <img src={filterIcon}></img>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid item className={classes.container}>
        <Paper>
          <TableContainer>
            <Table
              stickyHeader
              aria-label="sticky table"
              style={{ height: "100%" }}
            >
              <TableHead>
                <TableRow key="headRow">
                  {headings.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {!launches.loading && launchRows.length > 0 && (
                <TableBody>
                  {launchRows
                    .slice(
                      (page - 1) * rowsPerPage,
                      (page - 1) * rowsPerPage + rowsPerPage
                    )
                    .map((row, index) => {
                      return (
                        <TableRow
                          className={classes.tableRow}
                          hover
                          selected={
                            selectedRow &&
                            row.number == selectedRow.row.flight_number
                          }
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                          id={index}
                          hover
                          onClick={() =>
                            handleDetailsDialog(row.number, row.launchStatus)
                          }
                        >
                          {headings.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {column.id === "launchStatus" && value ? (
                                  <Status status={value} />
                                ) : (
                                  value
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                </TableBody>
              )}
            </Table>
            {launches.loading && <LoadingIndicator />}
            {!launches.loading && launchRows.length <= 0 && <NoData />}
          </TableContainer>
          <Pagination
            className={classes.pagination}
            component="div"
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={handleChangePage}
            count={Math.ceil(launchRows.length / rowsPerPage)}
          />
          <DateRangeModal
            dateRange={dateRange}
            setDateRange={setDateRange}
            openDateRange={openDateRange}
            handleCloseDateRange={handleCloseDateRange}
            toggle={toggle}
          />
          {selectedRow && (
            <SingleLaunchDetails
              selectedRow={selectedRow.row}
              status={selectedRow.status}
              handleClose={closeDetailsDialog}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

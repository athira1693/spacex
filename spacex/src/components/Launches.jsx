import { FormControl, Grid, Input, InputAdornment } from "@material-ui/core";
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
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Pagination from "@material-ui/lab/Pagination";
import { fetchAllLaunches } from "../redux/actions/launchesActions";
import Status from "./Status";
import { DateRangePicker, DateRange } from "materialui-daterange-picker";

const useStyles = makeStyles({
  root: {
    // margin: "2vh 10vw",
  },
  container: {},
  pagination: {
    float: "right",
    marginTop: "2vh",
  },
});

const headings = [
  { id: "number", label: "No:", minWidth: 100 },
  {
    id: "launchedDate",
    label: "Launched\u00a0(UTC)",
    minWidth: 170,
  },
  {
    id: "location",
    label: "Location",
    minWidth: 170,
  },
  {
    id: "mission",
    label: "Mission",
    minWidth: 170,
  },
  {
    id: "orbit",
    label: "Orbit",
    minWidth: 170,
  },
  {
    id: "launchStatus",
    label: "Launch Status",
    minWidth: 170,
    align: "center",
  },
  {
    id: "rocket",
    label: "Rocket",
    minWidth: 170,
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

export default function Launches() {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const dispatch = useDispatch();
  const launches = useSelector((state) => state.launches);
  const [launchRows, setLaunchRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({});

  const toggle = () => setOpen(!open);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    dispatch(fetchAllLaunches());
  }, []);

  useEffect(() => {
    if (launches.launches) {
      let lauchList = [];
      launches.launches.map((launch) => {
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
      });
      setLaunchRows([...lauchList]);
    }
  }, [launches]);

  return (
    <Grid
      container
      className={classes.root}
      direction="column"
      alignItems="center"
    >
      <Grid item container justify="space-between">
        <FormControl>
          <Input
            id="dateInput"
            startAdornment={<InputAdornment position="start"></InputAdornment>}
          >
            <DateRangePicker
              open={open}
              toggle={toggle}
              onChange={(range) => setDateRange(range)}
            />
          </Input>
        </FormControl>
      </Grid>
      <Grid item style={{ width: "80%" }}>
        <Paper>
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
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
              <TableBody>
                {launchRows.loading && <LoadingIndicator />}
                {launchRows.length > 0 &&
                  launchRows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          {headings.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {console.log(column.id)}
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
            </Table>
          </TableContainer>
          <Pagination
            className={classes.pagination}
            component="div"
            variant="outlined"
            shape="rounded"
            onChange={handleChangePage}
            count={Math.ceil(launchRows.length / rowsPerPage)}
            // siblingCount={-1}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

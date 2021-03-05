import {
  allLaunchesAPI,
  pastLaunchesAPI,
  upcomingLaunchesAPI,
} from "../../config/api";
import * as types from "./types";
import axios from "axios";

function fetchLaunchesRequest() {
  return {
    type: types.FETCH_LAUNCHES_REQUEST,
  };
}

function fetchLaunchesSuccess(data) {
  return {
    type: types.FETCH_LAUNCHES_SUCCESS,
    payload: data,
  };
}

function fetchLaunchesFailure(error) {
  return {
    type: types.FETCH_LAUNCHES_FAILURE,
    payload: error,
  };
}

export function fetchAllLaunches(dateRange) {
  return (dispatch) => {
    dispatch(fetchLaunchesRequest());
    return axios
      .get(allLaunchesAPI)
      .then((response) => {
        dispatch(fetchLaunchesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchLaunchesFailure(error));
      });
  };
}

export function fetchPastLaunches(status) {
  return (dispatch) => {
    dispatch(fetchLaunchesRequest());
    return axios
      .get(pastLaunchesAPI, {
        params: { launch_success: status },
      })
      .then((response) => {
        dispatch(fetchLaunchesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchLaunchesFailure(error));
      });
  };
}

export function fetchUpcomingLaunches() {
  return (dispatch) => {
    dispatch(fetchLaunchesRequest());
    return axios
      .get(upcomingLaunchesAPI, {
        params: {},
        headers: {},
      })
      .then((response) => {
        dispatch(fetchLaunchesSuccess(response.data));
      })
      .catch((error) => {
        dispatch(fetchLaunchesFailure(error));
      });
  };
}

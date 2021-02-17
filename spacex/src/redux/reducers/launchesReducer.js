import {
  FETCH_LAUNCHES_REQUEST,
  FETCH_LAUNCHES_SUCCESS,
  FETCH_LAUNCHES_FAILURE,
} from "../actions/types";

const initialState = {
  loading: false,
  launches: "",
  error: null,
};

export const launchesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LAUNCHES_REQUEST:
      return { ...state, launches: "", loading: true };
    case FETCH_LAUNCHES_SUCCESS:
      return { ...state, launches: action.payload, loading: false };
    case FETCH_LAUNCHES_FAILURE:
      return { ...state, launches: "", error: action.payload };
    default:
      return state;
  }
};

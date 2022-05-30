import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer/LoginReducer";
import StepReducer from "./Step/StepReducer";



export const rootReducer = combineReducers({
    LoginReducer: LoginReducer,
    StepReducer: StepReducer,
});



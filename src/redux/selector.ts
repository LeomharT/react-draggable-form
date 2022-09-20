import { LoginUserInfo } from "../@types/login.type";
import { RootState } from "./reducer";

export const loginUserInfoSelector = (state: RootState): LoginUserInfo => state.loginUserInfoReducer;

import { useReducer } from "react";
import { ROLES } from "@/constants";
import axios from "axios";
import { AUTH_API_URL } from "@/config/api";
import { AUTH_ACTIONS,AUTH_API_PATHS } from "@/constants/auth";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation'; // Corrected import statement
import { PATHS } from "@/constants/path";

// Define the types for your state
type AuthState = {
  isAuth: boolean;
  user: null | Record<string,any>;
  token: string;
  role: string;
  isLoading: boolean;
  error: null | string;
};

// Define the action types
const enum REDUCER_ACTION_TYEP {
  SET_LOADING,
  AUTHORIZE,
  LOGOUT,
  SET_ERROR,
}

type ReducerAction = {
  type: REDUCER_ACTION_TYEP,
  payload: string,
}

const getisAuth = (): boolean => localStorage.getItem("isAuth") === "true" || false;
const getUser = (): null | Record<string,any> => JSON.parse(localStorage.getItem("user")) || null;
const getToken = (): string => localStorage.getItem("token") || ''; // Provide a default empty string
const getRole = (): string => localStorage.getItem("role") || ROLES.GUEST;

const initialState: AuthState = {
  isAuth: getisAuth(),
  user: getUser(),
  token: getToken(),
  role: getRole(),
  isLoading: false,
  error: null,
};

const reduce = (state: typeof initialState,action: ReducerAction): typeof initialState => {
  switch (action.type) {
    case REDUCER_ACTION_TYEP.SET_LOADING:
      return {
        ...state,
        isLoading: true,
      };

    case REDUCER_ACTION_TYEP.AUTHORIZE:
      const token = action?.payload?.token || state?.token || localStorage.getItem("token") || ''; // Provide a default empty string
      const role = action?.payload?.isAdmin ? ROLES.ADMIN : ROLES.USER;
      localStorage.setItem("token",token);
      localStorage.setItem("role",role);
      localStorage.setItem("isAuth","true");
      localStorage.setItem("user",JSON.stringify(action.payload));
      return {
        isAuth: true,
        user: action.payload,
        token: token,
        role: role,
        isLoading: false,
        error: null,
      };

    case REDUCER_ACTION_TYEP.LOGOUT:
      ["token","user","role","isAuth"].forEach((item) =>
        localStorage.removeItem(item)
      );
      return {
        isAuth: false,
        user: null,
        token: '',
        role: ROLES.GUEST,
        isLoading: false,
        error: null,
      };

    case REDUCER_ACTION_TYEP.SET_ERROR:
      return {
        ...state, // Keep the existing state properties
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

const useAuth = () => {
  const [state,dispatch] = useReducer(reduce,initialState);
  const token = (state.token || localStorage.getItem('token') || '') as string; // Provide a default empty string
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const router = useRouter();

  // Login
  const login = async (body: Record<string,any>) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    try {
      const { data } = await axios.post(AUTH_API_URL + AUTH_API_PATHS.LOGIN,body);
      dispatch({ type: AUTH_ACTIONS.AUTHORIZE,payload: data?.data || data });
      Swal.fire({
        icon: "success",
        title: 'Logged in Successfully',
        showConfirmButton: false,
        timer: 2000
      });
      router.replace(PATHS.HOME);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: 'The data is incorrect!',
        showConfirmButton: false,
        timer: 2000
      });
      const errorMessage = (error as Error).message; // Use 'as' to assert the type of error
      dispatch({ type: AUTH_ACTIONS.SET_ERROR,payload: errorMessage });
    }
  };

  // Signup
  const signup = async (body: Record<string,any>) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING });
    try {
      const { data } = await axios.post(AUTH_API_URL + AUTH_API_PATHS.SIGNUP,body);
      dispatch({ type: AUTH_ACTIONS.AUTHORIZE,payload: data?.data || data });
      Swal.fire({
        icon: "success",
        title: 'Registered Successfully',
        showConfirmButton: false,
        timer: 2000
      });
      router.replace(PATHS.LOGIN);
    } catch (error) {
      const errorMessage = (error as Error).message; // Use 'as' to assert the type of error
      dispatch({ type: AUTH_ACTIONS.SET_ERROR,payload: errorMessage });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    router.replace(PATHS.LOGIN);
  };

  return {
    ...state,
    login,
    signup,
    logout,
  };
};

export default useAuth;

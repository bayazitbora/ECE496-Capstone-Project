import { createContext, useReducer, useEffect } from "react";

const initialState = JSON.parse(localStorage.getItem("userProfile")) || {
  teacher: "", // student or instructor
  title: "",
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  pos: "", // prgm of study
  grad_year: "", // expected grad year
  minors: [], // array of minors
  gpa: 0, // 0-4
  profiles: [],
};

const UPDATE_FORM = "UPDATE_FORM";
const SET_PROFILES = "SET_PROFILES";

function signUpReducer(state, action) {
  switch (action.type) {
    case UPDATE_FORM:
      return {
        ...state,
        ...action.payload,
      };
    case SET_PROFILES:
      return {
        ...state,
        profiles: action.profiles,
      };
    default:
      return state;
  }
}

export const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const [state, dispatch] = useReducer(signUpReducer, initialState);

  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(state));
  }, [state]);

  const setFormData = (formData) => {
    dispatch({ type: UPDATE_FORM, payload: formData });
  };

  return (
    <SignUpContext.Provider value={{ state, dispatch, setFormData }}>
      {children}
    </SignUpContext.Provider>
  );
};

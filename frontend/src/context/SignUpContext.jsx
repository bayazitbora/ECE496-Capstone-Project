import { createContext, useReducer, useEffect } from "react";

const initialState = JSON.parse(localStorage.getItem("userProfile")) || {
  role: "", // student or instructor
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  pos: "", // prgm of study
  grad_year: "", // expected grad year
  minors: [], // array of minors
  gpa: 0, // 0-4
};

const UPDATE_FORM = "UPDATE_FORM";

function signUpReducer(state, action) {
  switch (action.type) {
    case UPDATE_FORM:
      return {
        ...state,
        ...action.payload,
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
    <SignUpContext.Provider value={{ state, setFormData }}>
      {children}
    </SignUpContext.Provider>
  );
};

import { createContext, useReducer } from "react";

const initialState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  password: "",
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
  const setFormData = (formData) => {
    dispatch({ type: UPDATE_FORM, payload: formData });
  };
  return (
    <SignUpContext.Provider value={{ state, setFormData }}>
      {children}
    </SignUpContext.Provider>
  );
};

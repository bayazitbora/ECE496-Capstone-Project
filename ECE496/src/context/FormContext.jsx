import { createContext, useReducer } from "react";

const initialState = {
  course: "", // in question
  project_interests: [], // Array of project interests
  availability: [], // Array of available time slots
  meeting_frequency: 0, // number of times per week
  skills: [], // Array of skills
};

const UPDATE_FORM = "UPDATE_FORM";

function formReducer(state, action) {
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

export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const setFormData = (formData) => {
    dispatch({ type: UPDATE_FORM, payload: formData });
  };

  return (
    <FormContext.Provider value={{ state, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

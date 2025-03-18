import { useState, useContext } from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";
import { privateAxios } from "../api/api";
import { SignUpContext } from "../context/SignUpContext";

function Settings() {
  const { state: signUpState } = useContext(SignUpContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: `${signUpState?.first_name || ""} ${
      signUpState?.last_name || ""
    }`.trim(),
    password: "",
    confirmPassword: "",
    pos: signUpState?.pos || "",
    grad_year: signUpState?.grad_year || null,
    minors: signUpState?.minors || [],
    gpa: signUpState?.gpa || 0.0,
  });

  const majors = [
    { label: "Chemical" },
    { label: "Civil" },
    { label: "Electrical & Computer" },
    { label: "Industrial" },
    { label: "Materials" },
    { label: "Mechanical" },
    { label: "Mineral" },
    { label: "Engineering Science" },
  ];

  const minors = [
    { label: "Advanced Manufacturing" },
    { label: "AI Engineering" },
    { label: "Bioengineering" },
    { label: "Biomedical Engineering" },
    { label: "Engineering Business" },
    { label: "Environmental Engineering" },
    { label: "Global Leadership" },
    { label: "Music Performance" },
    { label: "Nanoengineering" },
    { label: "Robotics & Mechatronics" },
    { label: "Sustainable Energy" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMinorChange = (e) => {
    const { value } = e.target;
    if (!formData.minors.includes(value)) {
      setFormData({
        ...formData,
        minors: [...formData.minors, value],
      });
    }
  };

  const handleMinorRemove = (minor) => {
    setFormData({
      ...formData,
      minors: formData.minors.filter((m) => m !== minor),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const nameParts = formData.last_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");
    console.log("First name:", first_name);
    console.log("Last name:", last_name);

    const updatedData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "" && formData[key] !== null) {
        updatedData[key] = formData[key];
      }
    });

    try {
      const response = await privateAxios.post("/updateSelf", {
        ...updatedData,
        first_name,
        last_name,
      });
      console.log("Profile updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Settings</h2>
        <h3>Update Profile</h3>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Full Name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="select"
              name="pos"
              id="pos"
              value={formData.pos}
              onChange={handleChange}
            >
              <option value="">Select Major</option>
              {majors.map((major, index) => (
                <option key={index} value={major.label}>
                  {major.label}
                </option>
              ))}
            </Input>
          </FormGroup>
          <FormGroup>
            <Input
              type="number"
              name="grad_year"
              id="grad_year"
              placeholder="Graduation Year"
              value={formData.grad_year}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="select"
              name="minor"
              id="minor"
              value=""
              onChange={handleMinorChange}
            >
              <option value="" disabled>
                Choose Minor...
              </option>
              {minors.map((minor, index) => (
                <option key={index} value={minor.label}>
                  {minor.label}
                </option>
              ))}
            </Input>
          </FormGroup>
          <div>
            {formData.minors.map((minor, index) => (
              <Button
                key={index}
                color="outline"
                onClick={() => handleMinorRemove(minor)}
                style={{ marginRight: "10px", marginBottom: "10px" }}
              >
                {minor} &times;
              </Button>
            ))}
          </div>
          <FormGroup>
            <Input
              type="number"
              step="0.01"
              name="gpa"
              id="gpa"
              placeholder="GPA"
              value={formData.gpa}
              onChange={handleChange}
            />
          </FormGroup>
          <Button type="submit">Update Profile</Button>
        </Form>
      </div>
    </>
  );
}

export default Settings;

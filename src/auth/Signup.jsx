import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Layout from "../core/Layout";
import { ToastContainer, toast } from "react-toastify";
import { isAuth } from "./helper";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ history }) => {
  //! state
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  //! Destructuring
  const { name, email, password, buttonText } = values;

  //! Handle change
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  //! Click Submit
  const clickSubmit = (event) => {
    setMsg("Please Wait ...");
    event.preventDefault();
    if (name === "" || email === "" || password === "") {
      setMsg("");
      toast.error("Please Fill the Required Fields ");
    } else {
      setMsg("Please Wait ...");
      setValues({ ...values, buttonText: "Submitting" });
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API}/api/signup`,
        data: { name, email, password },
      })
        .then((response) => {
          console.log("SIGNUP SUCESSS");
          setMsg("");
          setValues({
            ...values,
            name: "",
            email: "",
            password: "",
            buttonText: "Submitted",
          });
          toast.success(response.data.message);
          setTimeout(() => {
            toast.success(
              `Hey ${
                JSON.parse(response.config.data).name
              }! You will be redirecting to login Page!`
            );
          }, 2000);
          setTimeout(() => {
            history.push("/login");
          }, 6000);
        })
        .catch((error) => {
          console.log("SIGNU ERROR ", error.response.data);
          setValues({ ...values, buttonText: "Submit" });
          toast.error(error.response.data.error);
        });
    }
  };

  const signup = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange("name")}
          required
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          className="form-control"
          required
          onChange={handleChange("email")}
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          required
          onChange={handleChange("password")}
          value={password}
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
      <div>
        <p className="text-muted">{msg}</p>
      </div>
    </form>
  );
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        {/* {JSON.stringify({ name, email, password })} */}
        <h1 className="p-5 text-center">Signup</h1>
        {signup()}
        <Link to="/auth/password/forgot">Forgot Password?</Link>
      </div>
    </Layout>
  );
};

export default Signup;

import { useState } from "react";
import Layout from "../core/Layout";
import { ToastContainer, toast } from "react-toastify";
import { Redirect, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { authenticate, isAuth } from "./helper.js";
// import Google from "./Google";
import Facebook from "./Facebook";

const Login = ({ history }) => {
  //! states
  const [msg, setMsg] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    buttonText: "Login",
  });

  const { email, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  //! inform parent
  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/private");
    });
  };

  const clickSubmit = (event) => {
    setMsg("Please Wait ...");
    event.preventDefault();
    if (email === "" || password === "") {
      setMsg("");
      toast.error("Fill the required Input");
    } else {
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_API}/api/login`,
        data: { email, password },
      })
        .then((response) => {
          console.log("LOGIN SUCCESS ", response);
          //! Save the response (user, token) localstorage/cookie
          authenticate(response, () => {
            setValues({
              ...values,
              email: "",
              password: "",
              buttonText: "Logged In",
            });
            // toast.success(`Hey! ${response.data.user.name}, Welcome Back!`);
            isAuth() && isAuth().role === "admin"
              ? history.push("/admin")
              : history.push("/private");
          });
        })
        .catch((error) => {
          console.log("LOGIN ERROR ", error);
          setValues({
            ...values,
            email: "",
            password: "",
            buttonText: "Login",
          });
          setMsg("");
          // alert("Login Error", error);
          toast.error(error.response.data.error);
        });
    }
  };
  const login = () => (
    <form>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          type="email"
          className="form-control"
          onChange={handleChange("email")}
          required
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          type="password"
          className="form-control"
          onChange={handleChange("password")}
          required
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
        <h1 className="p-5 text-center">Login</h1>
        <Facebook informParent={informParent} />
        {login()}
        <Link to="/auth/password/forgot">Forgot Password?</Link>
      </div>
    </Layout>
  );
};

export default Login;

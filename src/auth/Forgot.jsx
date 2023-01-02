import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Layout from "../core/Layout";
import axios from "axios";

const Forgot = ({ history }) => {
  const [values, setValues] = useState({
    email: "",
    buttonText: "Request Password Reset Link",
  });

  const { email, buttonText } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    toast.warn("Please Wait ...");

    if (email === "") {
      toast.dismiss();
      toast.error("Please fill up the Required Field");
    } else {
      axios({
        method: "PUT",
        url: `${process.env.REACT_APP_API}/api/forgot-password`,
        data: { email },
      })
        .then((response) => {
          console.log("FORGOT PASSWORD SUCCESS", response);
          document.getElementById("forgotInput").disabled = true;
          toast.success(response.data.message);
          setValues({ ...values, buttonText: "Link Sent" });
          setTimeout(() => {
            toast.dark("You Are Redirecting to the Login Page.");
            history.push("/login");
          }, 5000);
        })
        .catch((err) => {
          console.log("FORGOT PASSWORD FAILED", err.response.data.error);
          setValues({ ...values, email: "" });
          toast.error(err.response.data.error);
        });
    }
  };
  const passwordForgotForm = () => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Enter Your Email</label>
          <input
            type="email"
            id="forgotInput"
            value={email}
            onChange={handleChange("email")}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" onClick={clickSubmit}>
            {buttonText}
          </button>
        </div>
      </form>
    );
  };
  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="pt-5 text-center">Forgot Password</h1>
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default Forgot;

import { useState, useEffect } from "react";
import FormToggle from "../components/FormToggle";
import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";
import { useNavigate } from "react-router-dom";
import { cartSlice } from "../store/cart";
import { useDispatch } from "react-redux";
import "../styles/signin.css";
import toast from "react-hot-toast";

function SignIn() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    role: "customer",
    password: "",
    confirmPassword: "",
  });
  const [activePage, setActivePage] = useState("signin");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem("userDetails")) {
      localStorage.setItem("userDetails", JSON.stringify([]));
    }
  }, []);

  function handleTabChange(page) {
    setError("");
    setActivePage(page);
  }
  function handleChange(e) {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const users = JSON.parse(localStorage.getItem("userDetails") || "[]");

    if (activePage === "signup") {
      if (
        userDetails.username === "" ||
        userDetails.email === "" ||
        userDetails.password === "" ||
        userDetails.confirmPassword === ""
      ) {
        setError("Fill all the required fields!");
        return;
      } else if (userDetails.password !== userDetails.confirmPassword) {
        setError("Password doesn't match!");
        return;
      }
      const existingUser = users.find(
        (user) => user.email === userDetails.email,
      );

      if (existingUser) {
        setError("User already exists!");
        return;
      }
      // users.push(userDetails);
      const newUser = {
        username: userDetails.username,
        email: userDetails.email,
        role: userDetails.role,
        password: userDetails.password,
      };

      users.push(newUser);
      localStorage.setItem("userDetails", JSON.stringify(users));
      toast.success("Account Created Successfully");
      setTimeout(() => {
        setActivePage("signin");
      }, 300);

      setUserDetails({
        username: "",
        email: "",
        role: "customer",
        password: "",
        confirmPassword: "",
      });
    } else if (activePage === "signin") {
      console.log(activePage);
      if (userDetails.email === "" || userDetails.password === "") {
        setError("Enter email and password!");
        return;
      }

      const existingUser = users.find(
        (user) => user.email === userDetails.email,
      );

      if (!existingUser) {
        setError("User not found!");
        return;
      }
      if (existingUser.password !== userDetails.password) {
        setError("Invalid username or password!");
        return;
      }
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      // console.log("Login success:", existingUser);
      const cartsData = localStorage.getItem("carts");
      const allCarts = cartsData ? JSON.parse(cartsData) : {};
      const userCart = allCarts[userDetails.email] || [];
      dispatch(cartSlice.actions.loadCart(userCart));
      navigate("/home", { replace: true });
    }
  }

  return (
    <main className="sign-in-wrapper">
      <div className="sign-in-card">
        {/* <FormToggle activePage={activePage} setActivePage={handleTabChange} /> */}
        {activePage === "signup" ? (
          <SignUpForm
            userDetails={userDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setActivePage={handleTabChange}
            error={error}
          />
        ) : (
          <SignInForm
            userDetails={userDetails}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setActivePage={handleTabChange}
            error={error}
          />
        )}
      </div>
    </main>
  );
}

export default SignIn;

import { useState } from "react";
import "../styles/signin.css";

function validate(userDetails) {
  const errors = {};

  if (!userDetails.role) {
    errors.role = "Please select a role.";
  }

  if (!userDetails.username.trim()) {
    errors.username = "Username is required.";
  } else if (userDetails.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (!/^[a-zA-Z0-9_]+$/.test(userDetails.username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores.";
  }

  if (!userDetails.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!userDetails.password) {
    errors.password = "Password is required.";
  } else if (userDetails.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(userDetails.password)) {
    errors.password = "Password must contain at least one uppercase letter.";
  } else if (!/[a-z]/.test(userDetails.password)) {
    errors.password = "Password must contain at least one lowercase letter.";
  } else if (!/[0-9]/.test(userDetails.password)) {
    errors.password = "Password must contain at least one number.";
  } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(userDetails.password)) {
    errors.password = "Password must contain at least one special character.";
  }

  if (!userDetails.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (userDetails.password !== userDetails.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <span
      style={{
        display: "block",
        color: "#dc2626",
        fontSize: "0.78rem",
        marginTop: "4px",
      }}
    >
      {message}
    </span>
  );
}

function PasswordStrengthBar({ password }) {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) score++;
    return score;
  };

  if (!password) return null;

  const strength = getStrength(password);
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"];

  return (
    <div style={{ marginTop: "6px" }}>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              height: "4px",
              flex: 1,
              borderRadius: "2px",
              backgroundColor: i <= strength ? colors[strength] : "#e5e7eb",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "0.75rem", color: colors[strength] }}>
        {labels[strength]}
      </span>
    </div>
  );
}

function SignUpForm({
  userDetails,
  handleChange,
  handleSubmit,
  setActivePage,
  error,
}) {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errors = validate(userDetails);
    setFieldErrors(errors);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setTouched({
      role: true,
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    const errors = validate(userDetails);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    handleChange(e);
    const { name } = e.target;
    if (touched[name]) {
      setTimeout(() => {
        const errors = validate({
          ...userDetails,
          [name]: e.target.value,
        });
        setFieldErrors((prev) => ({ ...prev, [name]: errors[name] }));
      }, 0);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="sign-in-form" noValidate>
      <h2>Sign Up</h2>

      <div className="field">
        <label>Role</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="role"
              value="customer"
              checked={userDetails.role === "customer"}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            Customer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={userDetails.role === "admin"}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            Admin
          </label>
        </div>
        {touched.role && <FieldError message={fieldErrors.role} />}
      </div>

      <div className="field">
        <label htmlFor="su-username">Username</label>
        <input
          type="text"
          id="su-username"
          name="username"
          value={userDetails.username}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="Kumar"
          style={{
            borderColor:
              touched.username && fieldErrors.username ? "#dc2626" : "",
          }}
        />
        {touched.username && <FieldError message={fieldErrors.username} />}
      </div>

      <div className="field">
        <label htmlFor="su-email">Email</label>
        <input
          type="email"
          id="su-email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          style={{
            borderColor: touched.email && fieldErrors.email ? "#dc2626" : "",
          }}
        />
        {touched.email && <FieldError message={fieldErrors.email} />}
      </div>

      <div className="field">
        <label htmlFor="su-password">Password</label>
        <input
          type="password"
          id="su-password"
          name="password"
          value={userDetails.password}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="••••••••"
          style={{
            borderColor:
              touched.password && fieldErrors.password ? "#dc2626" : "",
          }}
        />
        <PasswordStrengthBar password={userDetails.password} />
        {touched.password && <FieldError message={fieldErrors.password} />}
      </div>

      <div className="field">
        <label htmlFor="su-confirm">Confirm Password</label>
        <input
          type="password"
          id="su-confirm"
          name="confirmPassword"
          value={userDetails.confirmPassword}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder="••••••••"
          style={{
            borderColor:
              touched.confirmPassword && fieldErrors.confirmPassword
                ? "#dc2626"
                : "",
          }}
        />
        {touched.confirmPassword && (
          <FieldError message={fieldErrors.confirmPassword} />
        )}
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontSize: "0.875rem", margin: "4px 0" }}>
          {error}
        </p>
      )}

      <button type="submit" className="button">
        Sign Up
      </button>
      <div style={{ width: "100%" }}>
        <p style={{ position: "relative", textAlign: "center" }}>
          Already have an account ?{" "}
          <button
            type="button"
            style={{
              width: "80px",
              border: "none",
              backgroundColor: "var(--accent)",
              color: "white",
              padding: "5px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => setActivePage("signin")}
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );
}

export default SignUpForm;

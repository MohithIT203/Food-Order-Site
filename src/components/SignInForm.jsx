import { useState } from "react";
import "../styles/signin.css";

function validate(userDetails) {
  const errors = {};

  if (!userDetails.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!userDetails.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

function SignInForm({
  userDetails,
  handleChange,
  handleSubmit,
  setActivePage,
  error,
}) {
  const [fieldErrors, setFieldErrors] = useState({});

  const handleFieldChange = (e) => {
    const { name } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    handleChange(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validate(userDetails);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit} className="sign-in-form" noValidate>
      <h2>Sign In</h2>

      <div className={`field ${fieldErrors.email ? "field--error" : ""}`}>
        <label htmlFor="si-email">Email</label>
        <input
          type="email"
          id="si-email"
          name="email"
          value={userDetails.email}
          onChange={handleFieldChange}
          placeholder="you@example.com"
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && (
          <span className="field-error-msg" id="email-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div className={`field ${fieldErrors.password ? "field--error" : ""}`}>
        <label htmlFor="si-password">Password</label>
        <input
          type="password"
          id="si-password"
          name="password"
          value={userDetails.password}
          onChange={handleFieldChange}
          placeholder="••••••••"
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          aria-invalid={!!fieldErrors.password}
        />
        {fieldErrors.password && (
          <span className="field-error-msg" id="password-error" role="alert">
            {fieldErrors.password}
          </span>
        )}
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button">
        Sign In
      </button>

      <div className="signin-footer">
        <p>
          Don't have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setActivePage("signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );
}

export default SignInForm;
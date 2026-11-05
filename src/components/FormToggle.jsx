import "../styles/signin.css";

function FormToggle({ activePage, setActivePage }) {
  return (
    <div id="form-actions">
      <button
        type="button"
        onClick={() => setActivePage("signin")}
        className={activePage === "signin" ? "active" : undefined}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => setActivePage("signup")}
        className={activePage === "signup" ? "active" : undefined}
      >
        Sign Up
      </button>
    </div>
  );
}

export default FormToggle;

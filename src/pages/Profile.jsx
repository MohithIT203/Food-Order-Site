import { useState } from "react";
import { toast } from "react-hot-toast";
import "../styles/profile.css";

function Field({
  label,
  name,
  type = "text",
  value,
  editing,
  onChange,
  placeholder,
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {editing ? (
        <input
          className="field-input"
          type={type}
          name={name}
          value={value || ""}
          placeholder={placeholder}
          onChange={onChange}
        />
      ) : (
        <div className="field-value">
          {type === "password"
            ? "••••••••"
            : value || <span className="field-empty">{placeholder}</span>}
        </div>
      )}
    </div>
  );
}

const PASSWORD_FIELDS = ["old_password", "new_password", "confirm_password"];

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem("currentUser")) || {};
  const userRole = stored.role;
  const [user, setUser] = useState({ ...stored });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);
  const [saved, setSaved] = useState(false);
  const [resetPassword, setResetPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const[isEdited,setIsEdited] = useState(false);

  const handleChange = (e) => {
    // console.log(e.target.value);
    setIsEdited(true);
    const { name, value } = e.target;

    if (PASSWORD_FIELDS.includes(name)) {
      setResetPassword((p) => ({ ...p, [name]: value }));
      return;
    }

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setDraft((d) => ({ ...d, address: { ...d.address, [key]: value } }));
    } else {
      setDraft((d) => ({ ...d, [name]: value }));
    }
  };

  const handleSave = () => {
    if(!draft.username){
      toast.error("Username cannot be empty");
      return
    }
    if(!draft.email){
      toast.error("Email cannot be empty");
      return
    }
    const { old_password, new_password, confirm_password } = resetPassword;
    const isChangingPassword = old_password || new_password || confirm_password;

    if (isChangingPassword) {
      if (old_password !== user.password) {
        toast.error("Old password is incorrect");
        return;
      }
      if (!new_password) {
        toast.error("New password cannot be empty");
        return;
      }
      if (new_password !== confirm_password) {
        toast.error("Passwords do not match");
        return;
      }
      draft.password = new_password;
    }

    setUser(draft);
    try {
      localStorage.setItem("currentUser", JSON.stringify(draft));
    } catch {}
    setEditing(false);
    setSaved(true);
    setResetPassword({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    toast.success("Profile updated successfully");
    setTimeout(() => setSaved(false), 2500);
    setIsEdited(false);
  };

  const handleCancel = () => {
    setDraft(user);
    setResetPassword({
      old_password: "",
      new_password: "",
      confirm_password: "",
    });
    setEditing(false);
    setIsEdited(false)
  };

  const current = editing ? draft : user;
  const initials = current.username
    .split("_")
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 2);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <h2 className="profile-name">{current.username}</h2>
            <p className="profile-email">{current.email}</p>
          </div>
        </div>

        {saved && <div className="toast">Profile saved successfully</div>}

        <div className="profile-card">
          <div className="card-header">
            <h3 className="section-title">Account details</h3>
            {!editing ? (
              <button
                className="btn-edit"
                onClick={() => {
                  setDraft(user);
                  setEditing(true);
                }}
              >
                Edit
              </button>
            ) : (
              <div className="btn-group">
                <button className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button className={`btn-save-${isEdited}`} onClick={handleSave} disabled={!isEdited}>
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="fields">
            <Field
              label="Username"
              name="username"
              value={current.username}
              editing={editing}
              onChange={handleChange}
              placeholder="Username"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={current.email}
              editing={editing}
              onChange={handleChange}
              placeholder="Email address"
            />
            <Field
              label="Phone"
              name="phone"
              value={current.phone}
              editing={editing}
              onChange={handleChange}
              placeholder="Phone number"
            />

            {!editing && (
              <Field
                label="Password"
                name="password"
                type="password"
                value={current.password}
                editing={false}
                onChange={handleChange}
                placeholder="Password"
              />
            )}
            {editing && (
              <Field
                label="Current Password"
                name="old_password"
                type="password"
                value={resetPassword.old_password}
                editing={editing}
                onChange={handleChange}
                placeholder="Current password"
              />
            )}
            {editing && (
              <Field
                label="New Password"
                name="new_password"
                type="password"
                value={resetPassword.new_password}
                editing={editing}
                onChange={handleChange}
                placeholder="New password"
              />
            )}
            {editing && (
              <Field
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={resetPassword.confirm_password}
                editing={editing}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
            )}
          </div>
        </div>
        {userRole === "customer" && (
          <div className="profile-card">
            <div className="card-header">
              <h3 className="section-title">Delivery address</h3>
            </div>

            <div className="fields">
              <Field
                label="Address line 1"
                name="address.line1"
                value={current.address?.line1}
                editing={editing}
                onChange={handleChange}
                placeholder="Street / flat / house no."
              />
              <Field
                label="Address line 2"
                name="address.line2"
                value={current.address?.line2}
                editing={editing}
                onChange={handleChange}
                placeholder="Landmark (optional)"
              />
              <div className="fields-row">
                <Field
                  label="City"
                  name="address.city"
                  value={current.address?.city}
                  editing={editing}
                  onChange={handleChange}
                  placeholder="City"
                />
                <Field
                  label="Pincode"
                  name="address.pincode"
                  value={current.address?.pincode}
                  editing={editing}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
              <Field
                label="State"
                name="address.state"
                value={current.address?.state}
                editing={editing}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

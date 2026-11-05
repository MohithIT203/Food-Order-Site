
import { useState, useEffect, useRef } from "react";
import '../styles/header.css';

function UserPill({ avatar, username, onProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const pillRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pillRef.current && !pillRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="user-pill"
      ref={pillRef}
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="user-avatar">{avatar}</div>
      <span className="user-name">{username}</span>

      {open && (
        <div className="user-details" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { onProfile?.(); setOpen(false); }}>
            Profile
          </button>
          <button className="logout" onClick={() => { onLogout?.(); setOpen(false); }}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserPill;
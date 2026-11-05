import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/modal.css";

function Modal({ children, open, onClose }) {
  const dialog = useRef();
  useEffect(() => {
    if (!dialog.current) return;

    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      className="modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      {children}
    </dialog>,
    document.getElementById("modal"),
  );
}

export default Modal;

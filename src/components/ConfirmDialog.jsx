import Modal from "./Modal";
import '../styles/modal.css'

function ConfirmDialog({ open, onClose, onConfirm, message=""}) {
  return (
    <Modal open={open} onClose={onClose}>
      <h2 style={{margin:"10px 0px 0px 0px",color:"var(--accent)"}}>Are you sure?</h2>
      <p>{message}</p>
      <div className="modal-actions">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="confirm-btn"onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
export default ConfirmDialog;
import Modal from "./Modal";
function CouponsModal({open,handleModalClose,handleChange,handleAddCoupon,error}) {
  return (
    <>
      <Modal open={open!=""} onClose={handleModalClose}>
        <div className="modify-item-modal">
          <form onSubmit={(e)=>handleAddCoupon(e)}>
            <h2>Create New Coupon</h2>
            <label>
              Coupon Code :
              <input
                name="code"
                placeholder="WHX20"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            <label>
              Discount Type :
              <select name="type" onChange={handleChange} required>
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </label>
            <label>
              Discount Value :
              <input
                name="value"
                type="number"
                placeholder="Discount Value"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            <label>
              Minimum Order Value :
              <input
                name="minOrder"
                type="number"
                placeholder="Min Order Value"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            <label>
              Expiry Date :
              <input
                name="expiry"
                type="date"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            <label>
              Total Usage Limit :
              <input
                name="usageLimit"
                type="number"
                placeholder="Total Usage Limit"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            <label>
              Limit Per User :
              <input
                name="perUserLimit"
                type="number"
                placeholder="Per User Limit"
                onChange={(e)=>handleChange(e)}
                required
              />
            </label>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" className="">
              Create Coupon
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default CouponsModal;
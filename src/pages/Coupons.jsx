import { useEffect, useState } from "react";
// import Modal from "../components/Modal";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import "../styles/coupons.css";
import CouponsModal from "../components/CouponsModal";

function Coupons() {
  const [coupons, setCoupons] = useState({
    code: "",
    type: "flat",
    value: "",
    minOrder: "",
    expiry: "",
    usageLimit: "",
    perUserLimit: "",
  });
  const [modalState, setModalState] = useState("");
  const [couponsList, setCouponsList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const coupons = JSON.parse(localStorage.getItem("coupons")) || [];
    setCouponsList(coupons);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setCoupons((prev) => ({ ...prev, [name]: value }));
  }
  function handleAddCoupon(e) {
    e.preventDefault();
    if (coupons.type === "flat" && coupons.minOrder < coupons.value) {
      setError("Minimum order must be higher than Coupon value!");
      return;
    }
    if (coupons.type === "percentage" && coupons.value > 100) {
      setError('Coupon Value must be less than "100" for Percentage');
      return;
    }
    const existingCoupons = JSON.parse(localStorage.getItem("coupons")) || [];
    const existingcouponsUsage = JSON.parse(localStorage.getItem("couponsUsage"))||[];
    const newCoupon = {[coupons.code]:{totalUsage:0}}
    const finalCoupons = [...existingcouponsUsage,newCoupon];


    const newCoupons = [...existingCoupons, coupons];
    localStorage.setItem("couponsUsage",JSON.stringify(finalCoupons));
    localStorage.setItem("coupons", JSON.stringify(newCoupons));
    console.log(coupons);
    setCouponsList([...couponsList, coupons]);
    setModalState(false);
    setCoupons({
      code: "",
      type: "flat",
      value: "",
      minOrder: "",
      expiry: "",
      usageLimit: "",
      perUserLimit: "",
    });
  }

  function handleModalClose() {
    setModalState("");
  }

  function handleEdit(code) {
    console.log(code);
  }
  function handleDelete(code) {
    console.log(code);

  }
  return (
    <>
      <h1>Coupons</h1>
      <button
        onClick={() => {
          setModalState("add");
        }}
      >
        + Add Coupon
      </button>
      <div className="coupons-table-wrapper">
        <table className="coupons-table">
          <thead>
            <tr>
              <th>S.no</th>
              <th>Coupon Code</th>
              <th>Discount Type</th>
              <th>Value</th>
              <th>Minimum Order Value</th>
              <th>Expiry</th>
              <th>Usage Limit</th>
              <th>Per User Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {couponsList.map((item, index) => (
              <tr
                key={index}
                className={`coupons-${item.expiry < new Date().toISOString().split("T")[0] ? "expired" : "active"}`}
              >
                <td>{index + 1}</td>
                <td>{item.code}</td>
                <td>{item.type}</td>
                <td>{item.value}</td>
                <td>{item.minOrder}</td>
                <td>{item.expiry}</td>
                <td>{item.usageLimit}</td>
                <td>{item.perUserLimit}</td>
                <td>
                  <span
                    className={`status-chip ${
                      item.expiry < new Date().toISOString().split("T")[0]
                        ? "expired"
                        : "active"
                    }`}
                  >
                    {item.expiry < new Date().toISOString().split("T")[0]
                      ? "Expired"
                      : "Active"}
                  </span>
                </td>
                <td className="coupons-actions-btn">
                  <span className="edit-btn" onClick={()=>handleEdit(item.code)}>
                    <FaPencilAlt />
                  </span>
                  <span className="delete-btn" onClick={()=>handleDelete(item.code)}>
                    <FaTrash color="red" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CouponsModal
        open={modalState}
        handleAddCoupon={handleAddCoupon}
        handleChange={handleChange}
        handleModalClose={handleModalClose}
        error={error}
      />
    </>
  );
}

export default Coupons;

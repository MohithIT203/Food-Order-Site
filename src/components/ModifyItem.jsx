import { useState, useEffect } from "react";
import Modal from "./Modal";
import toast from "react-hot-toast";
import Dropdown from "./Dropdown";

function ModifyItem({ item: initialItem, mode = "add", onSave, onClose }) {
  const [item, setItem] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "Veg",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (mode === "edit" && initialItem) {
      setItem({
        id: initialItem.id,
        name: initialItem.name,
        description: initialItem.description,
        price: initialItem.price,
        category: initialItem.category,
        image: initialItem.image || "",
      });
    } else {
      setItem({
        id: "",
        name: "",
        description: "",
        price: 0,
        category: "Veg",
        image: "",
      });
    }
    setErrors({});
    setTouched({});
  }, [initialItem, mode]);

  const validate = (data) => {
    const errs = {};
    if (!data.name.trim()) errs.name = "Name is required.";

    if (!data.description.trim()) errs.description = "Description is required.";

    if (data.price === "" || data.price === null || isNaN(data.price))
      errs.price = "Price is required.";
    else if (Number(data.price) < 0) errs.price = "Price cannot be negative.";
    else if (Number(data.price) === 0)
      errs.price = "Price must be greater than 0.";

    if (data.image && !/^https?:\/\/.+\..+/.test(data.image.trim()))
      errs.image = "Enter a valid image URL (must start with http/https).";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = {
      ...item,
      [name]: name === "price" ? Number(value) : value,
    };
    setItem(updated);

    if (touched[name]) {
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleSelectChange = (name, index) => {
    const CATEGORIES = ["Veg", "Non-Veg", "Drinks"];
    const value = CATEGORIES[index];
    const updated = { ...item, [name]: value };
    setItem(updated);
    if (touched[name]) {
      const errs = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(item);
    setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSave = () => {
    setTouched({ name: true, description: true, price: true, image: true });
    const errs = validate(item);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (mode === "add") {
      onSave({ ...item, id: Date.now() });
      toast.success("Item Added Successfully!");
    } else {
      onSave(item);
      toast.success("Item Updated Successfully!");
    }
    onClose();
  };

  const ErrorMsg = ({ field }) =>
    touched[field] && errors[field] ? (
      <span className="field-error">{errors[field]}</span>
    ) : null;

  return (
    <Modal open={true} onClose={onClose}>
      <div className="modify-item-modal">
        <h2>{mode === "add" ? "Add New Item" : "Edit Item"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? "input-error" : ""}
            />
            <ErrorMsg field="name" />
          </label>

          <label>
            Description:
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                touched.description && errors.description ? "input-error" : ""
              }
            />
            <ErrorMsg field="description" />
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              className={touched.price && errors.price ? "input-error" : ""}
            />
            <ErrorMsg field="price" />
          </label>

          <label>
            Category:
            {/* <select
              name="category"
              value={item.category}
              onChange={handleChange}
            >
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non Veg</option>
              <option value="Drinks">Drinks</option>
            </select> */}
            <Dropdown
              name="modifyitem"
              options={["Veg", "Non-Veg", "Drinks"]}
              value={["Veg", "Non-Veg", "Drinks"].indexOf(item.category)}
              onChange={(index) => handleSelectChange("category", index)}
            />
          </label>

          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={item.image}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.image && errors.image ? "input-error" : ""}
            />
            <ErrorMsg field="image" />
          </label>

          {item.image && !errors.image && (
            <label>
              Image Preview:
              <img
                src={item.image}
                style={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
                alt="Preview"
              />
            </label>
          )}

          <div className="modal-buttons">
            <button type="submit">
              {mode === "add" ? "Add Item" : "Update Item"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModifyItem;

import { useDispatch, useSelector } from "react-redux";
import FoodItems from "../components/FoodItems";
import "../styles/home.css";
import { modalSlice } from "../store/cart";
import ModifyItem from "../components/ModifyItem";
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/ConfirmDialog";
import Dropdown from "../components/Dropdown";
import { FaPlus } from "react-icons/fa";


const CATEGORIES = ["All", "Veg", "Non-Veg", "Drinks"];
const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹100", min: 0, max: 100 },
  { label: "₹100 - ₹300", min: 100, max: 300 },
  { label: "₹300 - ₹500", min: 300, max: 500 },
  { label: "Above ₹500", min: 500, max: Infinity },
];

function Home() {
  const [isopen, setIsopen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("food-items") || "[]"),
  );
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const role = user?.role;
  // const items = JSON.parse(localStorage.getItem("food-items") || "[]");

  const dispatch = useDispatch();
  const { modalState, selectedItem } = useSelector((state) => state.modal);

  const filteredItems = useMemo(() => {
    const { min, max } = PRICE_RANGES[priceRange];
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesPrice = item.price >= min && item.price <= max;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [items, searchQuery, activeCategory, priceRange]);

  function handleItemsSave(newItem) {
    const existingItems = JSON.parse(
      localStorage.getItem("food-items") || "[]",
    );
    const index = existingItems.findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
      existingItems[index] = newItem;
    } else {
      existingItems.push(newItem);
    }
    setItems(existingItems);
    localStorage.setItem("food-items", JSON.stringify(existingItems));
  }

  function handleConfirm(itemId) {
    setIsopen(true);
    setPendingDeleteId(itemId);
  }
  
  function handleDelete() {
    const itemId = pendingDeleteId;
    if (itemId == null) return;
    const items = JSON.parse(localStorage.getItem("food-items")) || [];
    const finalItems = items.filter((i) => i.id !== itemId);
    setItems(finalItems);
    localStorage.setItem("food-items", JSON.stringify(finalItems));
    toast.success("Item Removed Successfully!");
    setIsopen(false);
  }

  return (
    <>
      <div className="home-header">
        <h2 className="home-title">Food Items</h2>

        <div className="home-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {role === "admin" && (
            <button
              className="add-item-btn"
              style={{
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                gap:"5px"

              }}
              onClick={() => dispatch(modalSlice.actions.openAddModal())}
            >
              <FaPlus/> Add Item
            </button>
          )}
        </div>
      </div>

      <div className="filters-bar">
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? "tab-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === "All"}
              {cat === "Veg"}
              {cat === "Non-Veg"}
              {cat === "Drinks"}
              {cat}
            </button>
          ))}
        </div>

        <Dropdown
          name="price"
          options={PRICE_RANGES}
          value={priceRange}
          onChange={(value) => setPriceRange(Number(value))}
        />

        {/* <select
          className="price-select"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        >
          {PRICE_RANGES.map((range, i) => (
            <option key={i} value={i}>
              {range.label}
            </option>
          ))}
        </select> */}
      </div>

      <p className="results-count">
        {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
      </p>

      <div className="card-container">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FoodItems
              key={item.id}
              item={item}
              role={role}
              onDelete={handleConfirm}
            />
          ))
        ) : (
          <div className="no-results">
            <span>😕</span>
            {items.length >0 && <p>No items match your filters.</p>}
            {items.length===0 && <p>No items Available!</p>}
          {items.length>0 && 
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setPriceRange(0);
              }}
            >
              Clear Filters
            </button>
        }
          </div>
        )}
      </div>

      {modalState && (
        <ModifyItem
          mode={modalState === "add-item" ? "add" : "edit"}
          item={selectedItem}
          onSave={handleItemsSave}
          onClose={() => dispatch(modalSlice.actions.closeModal())}
        />
      )}
      {/* <Quotes/> */}
      <ConfirmDialog
        open={isopen}
        message="This actions removes the food Item from menu"
        onClose={() => setIsopen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default Home;

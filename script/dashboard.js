const tableBody = document.getElementById("productTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const formError = document.getElementById("formError");
const statusMessage = document.getElementById("statusMessage");

let products = [
  {
    id: 1,
    name: "MacBook Air M3",
    description: "Laptop Apple dengan chip M3 untuk kebutuhan kerja dan produktivitas.",
    price: 18999000,
    stock: 12
  },
  {
    id: 2,
    name: "iPhone 15",
    description: "Smartphone Apple dengan kamera 48MP dan USB-C.",
    price: 12999000,
    stock: 25
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    description: "Smartphone flagship Samsung dengan layar Dynamic AMOLED.",
    price: 11999000,
    stock: 18
  }
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);

const setStatus = (message, isError = false) => {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
};

const loadProducts = () => {
  renderProducts();
  updateStats();
};

const renderProducts = () => {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(keyword)
  );

  tableBody.innerHTML = "";

  filtered.forEach((product) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <div class="product-name">${escapeHtml(product.name)}</div>
      </td>
      <td>
        <div class="description">${escapeHtml(product.description || "-")}</div>
      </td>
      <td>${formatCurrency(Number(product.price))}</td>
      <td>${product.stock}</td>
      <td class="action-column">
        <div class="actions">
          <button
            class="action-button edit"
            data-action="edit"
            data-id="${product.id}"
          >
            Edit
          </button>
          <button
            class="action-button delete"
            data-action="delete"
            data-id="${product.id}"
          >
            Delete
          </button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  emptyState.classList.toggle("visible", filtered.length === 0);
};

const updateStats = () => {
  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock),
    0
  );

  const inventoryValue = products.reduce(
    (total, product) =>
      total + Number(product.price) * Number(product.stock),
    0
  );

  document.getElementById("totalProducts").textContent = products.length;
  document.getElementById("totalStock").textContent = totalStock;
  document.getElementById("inventoryValue").textContent =
    formatCurrency(inventoryValue);
};

const openModal = (product = null) => {
  productForm.reset();
  formError.textContent = "";

  if (product) {
    modalTitle.textContent = "Edit Product";

    document.getElementById("productId").value = product.id;
    document.getElementById("productName").value = product.name;
    document.getElementById("productDescription").value =
      product.description || "";
    document.getElementById("productPrice").value = product.price;
    document.getElementById("productStock").value = product.stock;
  } else {
    modalTitle.textContent = "Add Product";
    document.getElementById("productId").value = "";
  }

  modal.classList.remove("hidden");
  document.getElementById("productName").focus();
};

const closeModal = () => {
  modal.classList.add("hidden");
};

const saveProduct = (event) => {
  event.preventDefault();
  formError.textContent = "";

  const id = document.getElementById("productId").value;

  const payload = {
    name: document.getElementById("productName").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
    price: Number(document.getElementById("productPrice").value),
    stock: Number(document.getElementById("productStock").value)
  };

  if (!payload.name) {
    formError.textContent = "Product name is required.";
    return;
  }

  if (id) {
    const index = products.findIndex(
      (product) => product.id === Number(id)
    );

    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...payload
      };

      setStatus("Product updated successfully.");
    }
  } else {
    const newProduct = {
      id: products.length
        ? Math.max(...products.map((product) => product.id)) + 1
        : 1,
      ...payload
    };

    products.push(newProduct);

    setStatus("Product created successfully.");
  }

  closeModal();
  loadProducts();
};

const deleteProduct = (id) => {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  if (!window.confirm(`Delete "${product.name}"?`)) return;

  products = products.filter((item) => item.id !== id);

  setStatus("Product deleted successfully.");
  loadProducts();
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

document
  .getElementById("addProductButton")
  .addEventListener("click", () => openModal());

document
  .getElementById("closeModalButton")
  .addEventListener("click", closeModal);

document
  .getElementById("cancelButton")
  .addEventListener("click", closeModal);

productForm.addEventListener("submit", saveProduct);

searchInput.addEventListener("input", renderProducts);

modal.addEventListener("click", (event) => {
  if (event.target.hasAttribute("data-close-modal")) {
    closeModal();
  }
});

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;

  const id = Number(button.dataset.id);
  const product = products.find((item) => item.id === id);

  if (button.dataset.action === "edit") {
    openModal(product);
  }

  if (button.dataset.action === "delete") {
    deleteProduct(id);
  }
});

loadProducts();
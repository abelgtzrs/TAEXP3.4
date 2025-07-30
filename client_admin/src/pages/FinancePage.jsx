import { useState, useEffect } from "react";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import { Plus, Settings, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square, Edit, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// --- Sub-Component: Category Manager Modal ---
const CategoryManagerModal = ({ isOpen, onClose, categories, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6B7280");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    if (editingCategory) {
      setNewCategoryName(editingCategory.name);
      setNewCategoryColor(editingCategory.color);
    } else {
      setNewCategoryName("");
      setNewCategoryColor("#6B7280");
    }
  }, [editingCategory]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const categoryData = { name: newCategoryName, color: newCategoryColor };

    try {
      if (editingCategory) {
        await api.put(`/finance/categories/${editingCategory._id}`, categoryData);
      } else {
        await api.post("/finance/categories", categoryData);
      }
      setEditingCategory(null);
      onUpdate();
    } catch (error) {
      alert(`Failed to ${editingCategory ? "update" : "create"} category.`);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure? Deleting a category may affect existing transactions.")) {
      try {
        await api.delete(`/finance/categories/${categoryId}`);
        onUpdate();
      } catch (error) {
        alert("Failed to delete category.");
      }
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-md rounded-lg border border-gray-700 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white">Manage Categories</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span className="text-text-main">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEditClick(cat)} className="text-gray-500 hover:text-primary">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="text-gray-500 hover:text-status-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="bg-transparent h-10 w-10 p-1 rounded"
            />
            <StyledInput
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <StyledButton type="submit" className="py-2 px-4">
              {editingCategory ? "Update" : <Plus size={20} />}
            </StyledButton>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-Component: Add Transaction Form ---
const AddTransactionForm = ({ categories, onTransactionAdded }) => {
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/finance/transactions", { type, description, amount: Number(amount), category, date });
      onTransactionAdded();
      setDescription("");
      setAmount("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setType("expense");
    } catch (error) {
      alert("Failed to add transaction.");
    }
  };

  return (
    <Widget title="Log New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <StyledInput
              type="text"
              placeholder="Description (e.g., Groceries, Paycheck)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="text-sm"
            />
          </div>

          <StyledInput
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="text-sm"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded border border-gray-600 text-sm"
          >
            <option value="">-- Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <StyledInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="text-sm"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("income")}
              className={`w-full p-2 rounded transition-colors text-sm font-medium ${
                type === "income" ? "bg-green-500 text-white" : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`w-full p-2 rounded transition-colors text-sm font-medium ${
                type === "expense" ? "bg-red-500 text-white" : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        <StyledButton type="submit" className="w-full text-sm py-2.5">
          Log Transaction
        </StyledButton>
      </form>
    </Widget>
  );
};

// --- Sub-Component: Transaction Edit Modal ---
const TransactionEditModal = ({ transaction, isOpen, onClose, onUpdate, onDelete, categories }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (transaction) {
      // Set up form data, ensuring category is an ID and date is formatted
      setFormData({
        ...transaction,
        date: new Date(transaction.date).toISOString().split("T")[0],
        category: transaction.category?._id || "",
      });
    }
  }, [transaction]);

  if (!isOpen || !formData) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const dataToSubmit = { ...formData, amount: Number(formData.amount) };
    try {
      await api.put(`/finance/transactions/${transaction._id}`, dataToSubmit);
      onUpdate(); // Refresh data on the main page
      onClose();
    } catch (error) {
      alert("Failed to update transaction.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this transaction?")) {
      try {
        await api.delete(`/finance/transactions/${transaction._id}`);
        onUpdate();
        onClose();
      } catch (error) {
        alert("Failed to delete transaction.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-lg rounded-lg border border-gray-700 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white">Edit Transaction</h2>
        <div className="space-y-4">
          <StyledInput name="description" label="Description" value={formData.description} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <StyledInput name="amount" label="Amount" type="number" value={formData.amount} onChange={handleChange} />
            <StyledInput name="date" label="Date" type="date" value={formData.date} onChange={handleChange} />
          </div>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded border border-gray-600"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-700/50">
          <StyledButton onClick={handleDelete} className="bg-status-danger/80 hover:bg-status-danger">
            Delete
          </StyledButton>
          <div className="flex gap-2">
            <StyledButton onClick={onClose} className="bg-gray-600 hover:bg-gray-500">
              Cancel
            </StyledButton>
            <StyledButton onClick={handleSave}>Save Changes</StyledButton>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Budget Status ---
const BudgetStatus = ({ categories, transactions, selectedMonth, budgets, onUpdateBudgets }) => {
  const [localBudgets, setLocalBudgets] = useState({});

  useEffect(() => {
    // Initialize local state when budgets prop changes
    const initialBudgets = categories.reduce((acc, cat) => {
      acc[cat._id] = budgets.find((b) => b.category === cat._id)?.amount || "";
      return acc;
    }, {});
    setLocalBudgets(initialBudgets);
  }, [budgets, categories]);

  const handleBudgetChange = (categoryId, amount) => {
    // Allow empty string to clear budget, otherwise store as number
    const newAmount = amount === "" ? "" : Number(amount);
    setLocalBudgets({ ...localBudgets, [categoryId]: newAmount });
  };

  const handleSave = () => {
    // Filter out empty/invalid budget entries before saving
    const budgetsToSave = Object.entries(localBudgets)
      .map(([categoryId, amount]) => ({
        category: categoryId,
        amount: Number(amount),
      }))
      .filter((b) => b.amount > 0);
    onUpdateBudgets(budgetsToSave);
  };

  // Calculate spending for the selected month
  const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

  const spendingByCat = transactions
    .filter((t) => {
      const tDate = new Date(t.date);
      return t.type === "expense" && tDate >= monthStart && tDate <= monthEnd;
    })
    .reduce((acc, t) => {
      if (t.category?._id) {
        acc[t.category._id] = (acc[t.category._id] || 0) + t.amount;
      }
      return acc;
    }, {});

  return (
    <Widget title="Monthly Budget Status" className="flex flex-col h-full">
      <div className="flex-grow min-h-0 flex flex-col">
        <div className="space-y-4 overflow-y-auto pr-2 flex-grow min-h-0">
          {categories
            .filter((c) => c.name !== "Income") // Assuming 'Income' is not a budgetable category
            .map((cat) => {
              const budget = localBudgets[cat._id] || 0;
              const spent = spendingByCat[cat._id] || 0;
              const percentage = budget > 0 ? (spent / budget) * 100 : 0;
              const remaining = budget - spent;

              let progressBarColor = "bg-green-500";
              if (percentage > 100) progressBarColor = "bg-red-500";
              else if (percentage > 80) progressBarColor = "bg-yellow-500";
              progressBarColor = "bg-yellow-500";

              return (
                <div key={cat._id}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="font-medium text-text-main">{cat.name}</span>
                    </div>
                    <div className="w-1/3">
                      <StyledInput
                        type="number"
                        placeholder="Budget"
                        value={localBudgets[cat._id] || ""}
                        onChange={(e) => handleBudgetChange(cat._id, e.target.value)}
                        className="text-xs py-1 px-2 text-right"
                      />
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`${progressBarColor} h-2.5 rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>${spent.toFixed(2)} spent</span>
                    <span>
                      {budget > 0
                        ? percentage > 100
                          ? `-$${Math.abs(remaining).toFixed(2)} over`
                          : `$${remaining.toFixed(2)} left`
                        : "No budget set"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <StyledButton onClick={handleSave} className="w-full">
            Save Budgets
          </StyledButton>
        </div>
      </div>
    </Widget>
  );
};

// --- Sub-Component: Transaction List ---
const TransactionList = ({ transactions, onEdit }) => {
  return (
    <Widget title="Recent Transactions" className="h-full flex flex-col">
      <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
        {transactions.map((t) => (
          <li key={t._id} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md group">
            <div>
              <p className="font-semibold text-text-main">{t.description}</p>
              <p className="text-xs" style={{ color: t.category?.color || "#9CA3AF" }}>
                {t.category?.name || "Uncategorized"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`font-mono font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                </p>
                <p className="text-xs text-text-secondary">{new Date(t.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => onEdit(t)}
                className="text-gray-600 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Widget>
  );
};

const BillManagerModal = ({ isOpen, onClose, bills, categories, onUpdate }) => {
  const [formData, setFormData] = useState({ name: "", amount: "", dueDay: "", category: "" });
  const [editingBillId, setEditingBillId] = useState(null);

  if (!isOpen) return null;

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEditClick = (bill) => {
    setEditingBillId(bill._id);
    setFormData({
      name: bill.name,
      amount: bill.amount,
      dueDay: bill.dueDay,
      category: bill.category._id, // Use the ID for the select value
    });
  };

  const resetForm = () => {
    setFormData({ name: "", amount: "", dueDay: "", category: "" });
    setEditingBillId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData, amount: Number(formData.amount), dueDay: Number(formData.dueDay) };
    try {
      if (editingBillId) {
        await api.put(`/finance/bills/${editingBillId}`, dataToSubmit);
      } else {
        await api.post("/finance/bills", dataToSubmit);
      }
      resetForm();
      onUpdate(); // Refresh the main page data
    } catch (error) {
      alert(`Failed to ${editingBillId ? "update" : "create"} bill.`);
    }
  };

  const handleDelete = async (billId) => {
    if (window.confirm("Are you sure you want to delete this recurring bill?")) {
      try {
        await api.delete(`/finance/bills/${billId}`);
        onUpdate();
      } catch (error) {
        alert("Failed to delete bill.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-lg rounded-lg border border-gray-700 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white">Manage Recurring Bills</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {bills.map((bill) => (
            <div key={bill._id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-md">
              <span className="text-text-main">
                {bill.name} - ${bill.amount} (Day {bill.dueDay})
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(bill)} className="text-gray-500 hover:text-primary">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(bill._id)} className="text-gray-500 hover:text-status-danger">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="pt-4 border-t border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">{editingBillId ? "Edit Bill" : "Add New Bill"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StyledInput
              name="name"
              placeholder="Bill Name (e.g., Netflix)"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
            <StyledInput
              name="amount"
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleFormChange}
              required
            />
            <StyledInput
              name="dueDay"
              type="number"
              placeholder="Due Day (1-31)"
              value={formData.dueDay}
              onChange={handleFormChange}
              required
              min="1"
              max="31"
            />
          </div>
          <select
            name="category"
            value={formData.category}
            onChange={handleFormChange}
            required
            className="w-full p-3 mt-4 bg-gray-700 rounded border border-gray-600"
          >
            <option value="">-- Assign a Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2 mt-4">
            {editingBillId && (
              <StyledButton type="button" onClick={resetForm} className="bg-gray-600 hover:bg-gray-500">
                Cancel Edit
              </StyledButton>
            )}
            <StyledButton type="submit">{editingBillId ? "Update Bill" : "Add Bill"}</StyledButton>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Sub-Component: Bill Checklist ---
const BillChecklist = ({ bills, onTogglePaid, selectedMonth, setSelectedMonth }) => {
  const changeMonth = (offset) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  const monthYearString = selectedMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const currentMonthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;

  const totalAmount = bills.reduce((acc, bill) => acc + bill.amount, 0);

  return (
    <Widget title="Monthly Bills & Subscriptions" className="h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-700 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-semibold text-white">{monthYearString}</h3>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-700 rounded-full">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="space-y-1 overflow-y-auto flex-grow pr-2">
          {bills.map((bill) => {
            const isPaid = bill.paidForMonths.includes(currentMonthKey);
            return (
              <div
                key={bill._id}
                className={`flex items-center p-2 rounded-md transition-colors ${
                  isPaid ? "bg-green-900/30" : "bg-gray-900/50"
                }`}
              >
                <button onClick={() => onTogglePaid(bill._id, !isPaid)} className="mr-3">
                  {isPaid ? (
                    <CheckSquare size={20} className="text-green-400" />
                  ) : (
                    <Square size={20} className="text-gray-500" />
                  )}
                </button>
                <div className="flex-grow">
                  <p className={`font-medium ${isPaid ? "line-through text-gray-500" : "text-text-main"}`}>
                    {bill.name}
                  </p>
                  <p className="text-xs text-text-secondary">Due: Day {bill.dueDay}</p>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-semibold ${isPaid ? "line-through text-gray-500" : "text-white"}`}>
                    ${bill.amount.toFixed(2)}
                  </p>
                  <p className="text-xs" style={{ color: bill.category?.color }}>
                    {bill.category?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 pt-3 border-t border-gray-700/50 flex justify-between font-bold text-white flex-shrink-0">
          <span>Total Monthly Bills:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </Widget>
  );
};

// --- Sub-Component: Bill Analytics ---
const BillAnalytics = ({ bills, selectedMonth }) => {
  const currentMonthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;
  const paidBills = bills.filter((b) => b.paidForMonths.includes(currentMonthKey));
  const unpaidBills = bills.filter((b) => !b.paidForMonths.includes(currentMonthKey));
  const paidTotal = paidBills.reduce((acc, bill) => acc + bill.amount, 0);
  const unpaidTotal = unpaidBills.reduce((acc, bill) => acc + bill.amount, 0);

  const categorySpending = paidBills.reduce((acc, bill) => {
    const categoryName = bill.category?.name || "Uncategorized";
    const categoryColor = bill.category?.color || "#6B7280";
    if (!acc[categoryName]) {
      acc[categoryName] = { name: categoryName, value: 0, color: categoryColor };
    }
    acc[categoryName].value += bill.amount;
    return acc;
  }, {});

  const chartData = Object.values(categorySpending);

  return (
    <Widget title="Bill Analytics">
      <div className="flex justify-around text-center mb-4">
        <div>
          <p className="text-xl font-bold text-green-400">${paidTotal.toFixed(2)}</p>
          <p className="text-xs text-text-secondary">Paid This Month</p>
        </div>
        <div>
          <p className="text-xl font-bold text-red-400">${unpaidTotal.toFixed(2)}</p>
          <p className="text-xs text-text-secondary">Remaining</p>
        </div>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={40}
              paddingAngle={5}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid #374151", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Widget>
  );
};

// --- Main Page Component ---
const FinancePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const refreshData = async () => {
    try {
      const [transRes, catRes, billRes] = await Promise.all([
        api.get("/finance/transactions"),
        api.get("/finance/categories"),
        api.get("/finance/bills"),
      ]);
      setTransactions(transRes.data.data);
      setCategories(catRes.data.data);
      setBills(billRes.data.data);
    } catch (error) {
      console.error("Failed to load financial data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleUpdateTransaction = async () => {
    refreshData();
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditTransactionModalOpen(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await api.delete(`/finance/transactions/${transactionId}`);
      refreshData();
    } catch (error) {
      alert("Failed to delete transaction.");
    }
  };

  const handleToggleBillPaid = async (billId, isPaid) => {
    try {
      const monthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;
      await api.put(`/finance/bills/${billId}/toggle-paid`, { monthKey, isPaid });
      refreshData();
    } catch (error) {
      alert("Failed to update bill status.");
    }
  };

  if (loading) return <p className="text-center text-text-secondary">Loading Financial Data...</p>;

  return (
    // This outer div now controls the height of the entire page content area
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {" "}
      {/* Adjust 120px based on your header/padding height */}
      <div className="flex justify-between items-center flex-shrink-0">
        <PageHeader title="Financial Tracker" subtitle="Manage your income, expenses, and budgets." />
        <div className="flex gap-2">
          <StyledButton
            onClick={() => setIsBillModalOpen(true)}
            className="py-2 px-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-sm"
          >
            <Plus size={16} /> Manage Bills
          </StyledButton>
          <StyledButton
            onClick={() => setIsCategoryModalOpen(true)}
            className="py-2 px-3 flex items-center gap-2 text-sm"
          >
            <Settings size={16} /> Manage Categories
          </StyledButton>
        </div>
      </div>
      {/* This grid now grows to fill the remaining vertical space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2 flex-grow">
        {/* Column 1: Budget Status & Add Transaction */}

        <div className="lg:col-span-4 flex flex-col gap-2 h-full">
          <div>
            <AddTransactionForm categories={categories} onTransactionAdded={refreshData} />
          </div>
          <div className="flex-grow min-h-0">
            <BudgetStatus
              categories={categories}
              transactions={transactions}
              selectedMonth={selectedMonth}
              budgets={bills} // Assuming budgets are part of the bills data
              onUpdateBudgets={async (budgets) => {
                try {
                  await Promise.all(
                    budgets.map((b) => api.put(`/finance/bills/${b.category}/budget`, { amount: b.amount }))
                  );
                  refreshData();
                } catch (error) {
                  alert("Failed to update budgets.");
                }
              }}
            />
          </div>
        </div>

        {/* Column 2: Transaction List */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <TransactionList transactions={transactions} onEdit={handleEditTransaction} />
        </div>

        {/* Column 3: Bills & Analytics */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <BillChecklist
            bills={bills}
            onTogglePaid={handleToggleBillPaid}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <BillAnalytics bills={bills} selectedMonth={selectedMonth} />
        </div>
      </div>
      {/* Modals */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onUpdate={refreshData}
      />
      <BillManagerModal
        isOpen={isBillModalOpen}
        onClose={() => setIsBillModalOpen(false)}
        bills={bills}
        categories={categories}
        onUpdate={refreshData}
      />
      {isEditTransactionModalOpen && (
        <TransactionEditModal
          transaction={selectedTransaction}
          isOpen={isEditTransactionModalOpen}
          onClose={() => setIsEditTransactionModalOpen(false)}
          onUpdate={refreshData}
          onDelete={refreshData}
          categories={categories}
        />
      )}
      {/* BudgetStatus moved to first column above */}
    </div>
  );
};

export default FinancePage;

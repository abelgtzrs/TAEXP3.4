import { useState, useEffect } from "react";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import { Plus, Settings, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// --- Sub-Component: Category Manager Modal ---
const CategoryManagerModal = ({ isOpen, onClose, categories, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6B7280");

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await api.post("/finance/categories", { name: newCategoryName, color: newCategoryColor });
      setNewCategoryName("");
      onUpdate();
    } catch (error) {
      alert("Failed to create category.");
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
              <button onClick={() => handleDelete(cat._id)} className="text-gray-500 hover:text-status-danger">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleCreate} className="pt-4 border-t border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-2">Add New Category</h3>
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
              <Plus size={20} />
            </StyledButton>
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
    } catch (error) {
      alert("Failed to add transaction.");
    }
  };

  return (
    <Widget title="Log New Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("income")}
            className={`w-full p-2 rounded transition-colors ${
              type === "income" ? "bg-green-500 text-white" : "bg-gray-600"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`w-full p-2 rounded transition-colors ${
              type === "expense" ? "bg-red-500 text-white" : "bg-gray-600"
            }`}
          >
            Expense
          </button>
        </div>
        <StyledInput
          type="text"
          placeholder="Description (e.g., Groceries)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StyledInput
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="md:col-span-1"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 md:col-span-2"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <StyledInput type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <StyledButton type="submit" className="w-full">
          Log Transaction
        </StyledButton>
      </form>
    </Widget>
  );
};

// --- Sub-Component: Transaction List ---
const TransactionList = ({ transactions }) => {
  return (
    <Widget title="Recent Transactions" className="h-full">
      <ul className="space-y-3 overflow-y-auto h-full pr-2">
        {transactions.map((t) => (
          <li key={t._id} className="flex justify-between items-center p-2 bg-gray-900/50 rounded-md">
            <div>
              <p className="font-semibold text-text-main">{t.description}</p>
              <p className="text-xs" style={{ color: t.category?.color || "#9CA3AF" }}>
                {t.category?.name || "Uncategorized"}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-mono font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
              </p>
              <p className="text-xs text-text-secondary">{new Date(t.date).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </Widget>
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
        <div className="space-y-3 overflow-y-auto flex-grow pr-2">
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
        <div className="mt-4 pt-3 border-t border-gray-700/50 flex justify-between font-bold text-white flex-shrink-0">
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
      <div className="flex justify-around text-center mb-6">
        <div>
          <p className="text-2xl font-bold text-green-400">${paidTotal.toFixed(2)}</p>
          <p className="text-xs text-text-secondary">Paid This Month</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-red-400">${unpaidTotal.toFixed(2)}</p>
          <p className="text-xs text-text-secondary">Remaining</p>
        </div>
      </div>
      <div className="h-48 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              fill="#8884d8"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid #374151" }} />
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
    <div>
      <div className="flex justify-between items-start">
        <PageHeader title="Financial Tracker" subtitle="Manage your income, expenses, and budgets." />
        <StyledButton onClick={() => setIsCategoryModalOpen(true)} className="py-2 px-4 flex items-center gap-2">
          <Settings size={20} /> Manage Categories
        </StyledButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        <div className="lg:col-span-4 space-y-6">
          <BillChecklist
            bills={bills}
            onTogglePaid={handleToggleBillPaid}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <BillAnalytics bills={bills} selectedMonth={selectedMonth} />
        </div>
        <div className="lg:col-span-8 space-y-6">
          <AddTransactionForm categories={categories} onTransactionAdded={refreshData} />
          <TransactionList transactions={transactions} />
        </div>
      </div>

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onUpdate={refreshData}
      />
    </div>
  );
};

export default FinancePage;

// NOTE: This file was reconstructed after a merge/patch corruption introduced
// large blocks of misplaced JSX and missing imports. The implementation
// below restores a stable FinancePage with the previously added "terminal mode"
// (Bloomberg-style) features: TickerBar, CommandBar, MetricsPanel (KPI + Sparkline),
// TransactionBlotter, dense widgets, and classic drag/drop list in non-terminal mode.

import { useState, useEffect, useMemo, useCallback } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Settings, Trash2, X, Edit, ChevronLeft, ChevronRight, CheckSquare, Square } from "lucide-react";
// Charts
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import PageHeader from "../components/ui/PageHeader";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import DebtTracker from "../components/finances/DebtTracker";
import api from "../services/api";

// ---------------------------------------------------------------------------
// Utility Components
// ---------------------------------------------------------------------------

// Overview bar (standard mode) summarizing key balances & month snapshot
const OverviewBar = ({ selectedMonth, checkings, savings, transactions }) => {
  const monthIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === selectedMonth.getMonth() &&
        new Date(t.date).getFullYear() === selectedMonth.getFullYear()
    )
    .reduce((a, b) => a + b.amount, 0)
    .toFixed(2);
  const monthExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === selectedMonth.getMonth() &&
        new Date(t.date).getFullYear() === selectedMonth.getFullYear()
    )
    .reduce((a, b) => a + b.amount, 0)
    .toFixed(2);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Widget title="Checkings">
        <p className="text-xl md:text-2xl font-bold text-emerald-400">${checkings.toFixed(2)}</p>
      </Widget>
      <Widget title="Savings">
        <p className="text-xl md:text-2xl font-bold text-sky-400">${savings.toFixed(2)}</p>
      </Widget>
      <Widget title="Month Income">
        <p className="text-xs text-text-secondary">{selectedMonth.toLocaleString("en-US", { month: "short" })}</p>
        <p className="text-lg font-semibold text-green-400">${monthIncome}</p>
      </Widget>
      <Widget title="Month Expenses">
        <p className="text-xs text-text-secondary">{selectedMonth.toLocaleString("en-US", { month: "short" })}</p>
        <p className="text-lg font-semibold text-red-400">${monthExpenses}</p>
      </Widget>
    </div>
  );
};

// Scrolling ticker (terminal mode)
const TickerBar = ({ selectedMonth, checkings, savings, transactions }) => {
  const monthIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        new Date(t.date).getMonth() === selectedMonth.getMonth() &&
        new Date(t.date).getFullYear() === selectedMonth.getFullYear()
    )
    .reduce((a, b) => a + b.amount, 0)
    .toFixed(2);
  const monthExpenses = transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        new Date(t.date).getMonth() === selectedMonth.getMonth() &&
        new Date(t.date).getFullYear() === selectedMonth.getFullYear()
    )
    .reduce((a, b) => a + b.amount, 0)
    .toFixed(2);
  const net = (parseFloat(monthIncome) - parseFloat(monthExpenses)).toFixed(2);
  const monthLabel = selectedMonth.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const items = [
    { label: "CHK", value: `$${checkings.toFixed(2)}`, color: "text-emerald-400" },
    { label: "SAV", value: `$${savings.toFixed(2)}`, color: "text-sky-400" },
    { label: `${monthLabel} INC`, value: `$${monthIncome}`, color: "text-green-400" },
    { label: `${monthLabel} EXP`, value: `$${monthExpenses}`, color: "text-red-400" },
    { label: "NET", value: `$${net}`, color: net >= 0 ? "text-emerald-400" : "text-red-500" },
  ];
  return (
    <div className="relative border border-amber-600/40 bg-[#10130F] overflow-hidden rounded shadow-inner shadow-amber-900/40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_110%,#1a1f11_0%,#0b0e0a_70%)] opacity-70 pointer-events-none" />
      <div className="flex gap-8 px-4 py-2 text-xs font-mono animate-[ticker_35s_linear_infinite] whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, loop) => (
          <div className="flex gap-8" key={loop}>
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="text-amber-300 tracking-wide">{it.label}:</span>
                <span className={`${it.color} font-semibold tabular-nums`}>{it.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Command bar for terminal mode commands
const CommandBar = ({ onCommand, placeholder = "Type HELP for commands..." }) => {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onCommand(value.trim());
    setValue("");
  };
  return (
    <form onSubmit={handleSubmit} className="terminal-command-bar mt-3">
      <span className="text-amber-400 font-semibold text-xs select-none">CMD</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Command Input"
      />
    </form>
  );
};

const Sparkline = ({ data, maxAbs }) => {
  if (!data || data.length === 0) return <div className="sparkline" />;
  const peak = maxAbs || Math.max(...data.map((d) => Math.abs(d)), 1);
  return (
    <div className="sparkline">
      {data.map((v, i) => {
        const h = Math.max(2, Math.round((Math.abs(v) / peak) * 24));
        return <div key={i} className={`sparkline-bar ${v >= 0 ? "pos" : "neg"}`} style={{ height: h }} />;
      })}
    </div>
  );
};

const MetricsPanel = ({ transactions, checkings, savings, selectedMonth }) => {
  const { kpis, spark } = useMemo(() => {
    const month = selectedMonth.getMonth();
    const year = selectedMonth.getFullYear();
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const income = monthTx.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const expense = monthTx.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const net = income - expense;
    const avg = monthTx.length ? (income + expense) / monthTx.length : 0;

    // Build 30-day net series
    const days = 30;
    const daily = Array.from({ length: days }, (_, i) => {
      const dayDate = new Date(year, month, i + 1);
      const dayKey = dayDate.toDateString();
      const dayNet = monthTx
        .filter((t) => new Date(t.date).toDateString() === dayKey)
        .reduce((acc, t) => acc + (t.type === "income" ? t.amount : -t.amount), 0);
      return dayNet;
    });

    return {
      kpis: [
        { label: "INCOME", value: income.toFixed(2), color: "text-green-400" },
        { label: "EXPENSE", value: expense.toFixed(2), color: "text-red-400" },
        { label: "NET", value: net.toFixed(2), color: net >= 0 ? "text-emerald-400" : "text-red-500" },
        { label: "AVG TX", value: avg.toFixed(2), color: "text-amber-300" },
        { label: "CHK BAL", value: checkings.toFixed(2), color: "text-sky-300" },
        { label: "SAV BAL", value: savings.toFixed(2), color: "text-sky-400" },
        { label: "TX COUNT", value: monthTx.length, color: "text-amber-200" },
      ],
      spark: daily,
    };
  }, [transactions, checkings, savings, selectedMonth]);

  const maxAbs = useMemo(() => Math.max(...spark.map((v) => Math.abs(v)), 1), [spark]);

  return (
    <Widget title="Monthly Metrics" className="font-mono text-[11px]">
      <div className="terminal-kpi-grid mb-3">
        {kpis.map((k) => (
          <div key={k.label} className="terminal-kpi">
            <div className="label">{k.label}</div>
            <div className={`value tabular-nums font-semibold ${k.color}`}>{k.value}</div>
          </div>
        ))}
      </div>
      <Sparkline data={spark} maxAbs={maxAbs} />
    </Widget>
  );
};

// ---------------------------------------------------------------------------
// Transaction / Budget / Bill Subcomponents
// ---------------------------------------------------------------------------

const AddTransactionForm = ({ categories, onTransactionAdded, terminalMode = false }) => {
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
    <Widget title="Log New Transaction" className={terminalMode ? "text-[11px] font-mono tracking-tight" : ""}>
      <form onSubmit={handleSubmit} className={terminalMode ? "space-y-3" : "space-y-4"}>
        <div className={`grid grid-cols-1 md:grid-cols-2 ${terminalMode ? "gap-3" : "gap-4"}`}>
          <div className="md:col-span-2">
            <StyledInput
              type="text"
              placeholder="Description (e.g., Groceries, Paycheck)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className={terminalMode ? "text-[11px] py-1" : "text-sm"}
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
            className={terminalMode ? "text-[11px] py-1" : "text-sm"}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={`w-full bg-gray-700 rounded border border-gray-600 ${
              terminalMode ? "p-1.5 text-[11px]" : "p-2 text-sm"
            }`}
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
            className={terminalMode ? "text-[11px] py-1" : "text-sm"}
          />

          <div className={`flex gap-2 ${terminalMode ? "text-[11px]" : ""}`}>
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
        <StyledButton type="submit" className={`w-full ${terminalMode ? "!py-1.5 text-[11px]" : "text-sm py-2.5"}`}>
          Log Transaction
        </StyledButton>
      </form>
    </Widget>
  );
};

const SortableTransactionItem = ({ id, transaction, onEdit, balance }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md group cursor-grab border border-gray-700/30 shadow-s shadow-blue-500/90 hover:shadow-blue-500/20 transition-shadow"
    >
      <div>
        <p className="font-semibold text-text-main">{transaction.description}</p>
        <p className="text-xs" style={{ color: transaction.category?.color || "#9CA3AF" }}>
          {transaction.category?.name || "Uncategorized"}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className={`font-mono font-semibold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
          </p>
          <p className="text-xs text-text-secondary">{new Date(transaction.date).toLocaleDateString()}</p>
        </div>
        <div className="text-right w-24">
          <p className="font-mono text-sm text-text-main">${balance.toFixed(2)}</p>
          <p className="text-xs text-text-secondary">Balance</p>
        </div>
        <button
          onClick={() => onEdit(transaction)}
          className="text-gray-600 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit size={16} />
        </button>
      </div>
    </li>
  );
};
const BudgetStatus = ({ categories, transactions, selectedMonth, budgets, onUpdateBudgets, terminalMode = false }) => {
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
    <Widget
      title="Monthly Budget Status"
      className={`flex flex-col h-full ${terminalMode ? "text-[11px] font-mono tracking-tight" : ""}`}
    >
      <div className="flex-grow min-h-0 flex flex-col">
        <div className={`${terminalMode ? "space-y-2" : "space-y-4"} overflow-y-auto pr-2 flex-grow min-h-0`}>
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
                  <div className={`flex justify-between items-center mb-1 ${terminalMode ? "text-[11px]" : "text-sm"}`}>
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
                        className={`${terminalMode ? "text-[10px] py-0.5 px-1.5" : "text-xs py-1 px-2"} text-right`}
                      />
                    </div>
                  </div>
                  <div className={`w-full bg-gray-700 rounded-full ${terminalMode ? "h-2" : "h-2.5"}`}>
                    <div
                      className={`${progressBarColor} ${terminalMode ? "h-2" : "h-2.5"} rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div
                    className={`flex justify-between ${
                      terminalMode ? "text-[10px]" : "text-xs"
                    } text-text-secondary mt-1 tabular-nums`}
                  >
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
          <StyledButton onClick={handleSave} className={`w-full ${terminalMode ? "!py-1 text-[11px]" : ""}`}>
            Save Budgets
          </StyledButton>
        </div>
      </div>
    </Widget>
  );
};

const TransactionList = ({ transactions, onEdit, currentPage, setCurrentPage, totalPages, onSortEnd, balances }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // over can be null if dropped outside the context
    if (!over) return;
    if (active.id !== over.id) onSortEnd(active.id, over.id);
  };

  return (
    <Widget title="Recent Transactions" className="h-full flex flex-col">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={transactions.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3 pr-2">
            {transactions.map((t, index) => (
              <SortableTransactionItem
                key={t._id}
                id={t._id}
                transaction={t}
                onEdit={onEdit}
                balance={balances[index]}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      {totalPages > 1 && (
        <div className="flex-shrink-0 flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
          <StyledButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
          </StyledButton>
          <span className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          <StyledButton
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </StyledButton>
        </div>
      )}
    </Widget>
  );
};

const TransactionBlotter = ({ transactions, balances, onEdit, currentPage, totalPages, setCurrentPage }) => {
  return (
    <Widget title="Blotter" className="h-full flex flex-col font-mono text-[11px]">
      <div className="overflow-auto max-h-[560px] border border-amber-700/40 rounded bg-[#0B0E0A]">
        <table className="w-full border-collapse">
          <thead className="bg-[#161C12] text-amber-300 sticky top-0">
            <tr className="uppercase tracking-wider">
              <th className="p-1 font-semibold text-left">Date</th>
              <th className="p-1 font-semibold text-left">Desc</th>
              <th className="p-1 font-semibold text-left">Cat</th>
              <th className="p-1 font-semibold text-right">Amt</th>
              <th className="p-1 font-semibold text-right">Bal</th>
              <th className="p-1 font-semibold">Edit</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const amt = (t.type === "income" ? "+" : "-") + "$" + t.amount.toFixed(2);
              const bal = `$${balances[i]?.toFixed(2)}`;
              return (
                <tr key={t._id} className="odd:bg-[#10140F] even:bg-[#121811] hover:bg-[#1d2618] transition-colors">
                  <td className="p-1 whitespace-nowrap text-amber-200/90">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="p-1 max-w-[160px] truncate text-gray-200">{t.description}</td>
                  <td className="p-1 whitespace-nowrap" style={{ color: t.category?.color || "#888" }}>
                    {t.category?.name || "—"}
                  </td>
                  <td
                    className={`p-1 text-right tabular-nums ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                  >
                    {amt}
                  </td>
                  <td className="p-1 text-right tabular-nums text-sky-300">{bal}</td>
                  <td className="p-1 text-center">
                    <button onClick={() => onEdit(t)} className="text-amber-300 hover:text-amber-200">
                      <Edit size={12} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex-shrink-0 flex justify-between items-center mt-2 pt-2 border-t border-[#2a3322] text-[10px]">
          <StyledButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft size={14} />
          </StyledButton>
          <span className="text-amber-300">
            Page {currentPage} / {totalPages}
          </span>
          <StyledButton
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={14} />
          </StyledButton>
        </div>
      )}
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

const BillChecklist = ({ bills, onTogglePaid, selectedMonth, setSelectedMonth, terminalMode = false }) => {
  const changeMonth = (offset) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedMonth(newDate);
  };

  const monthYearString = selectedMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const currentMonthKey = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`;

  const totalAmount = bills.reduce((acc, bill) => acc + bill.amount, 0);

  return (
    <Widget
      title="Monthly Bills & Subscriptions"
      className={`h-full ${terminalMode ? "text-[11px] font-mono tracking-tight" : ""}`}
    >
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
        <div className="space-y-[2px] overflow-y-auto flex-grow pr-2">
          {bills.map((bill) => {
            const isPaid = bill.paidForMonths.includes(currentMonthKey);
            return (
              <div
                key={bill._id}
                className={`flex items-center ${terminalMode ? "p-1.5" : "p-2"} rounded-sm transition-colors border ${
                  isPaid
                    ? "bg-green-900/20 border-green-700/40"
                    : "bg-gray-900/40 border-gray-700/40 hover:border-amber-600/40"
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
                  <p className="text-[10px] text-text-secondary">Due: {bill.dueDay}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`tabular-nums ${terminalMode ? "text-[11px]" : "font-mono font-semibold"} ${
                      isPaid ? "line-through text-gray-500" : "text-white"
                    }`}
                  >
                    ${bill.amount.toFixed(2)}
                  </p>
                  <p className={`${terminalMode ? "text-[10px]" : "text-xs"}`} style={{ color: bill.category?.color }}>
                    {bill.category?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`mt-2 pt-2 border-t border-gray-700/50 flex justify-between font-bold text-white flex-shrink-0 ${
            terminalMode ? "text-[11px]" : ""
          }`}
        >
          <span>Total:</span>
          <span className="tabular-nums">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </Widget>
  );
};

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

// Simple toolbar component (re-implemented - original was lost in corruption)
const TransactionToolbar = ({
  txSearch,
  setTxSearch,
  txCategoryFilter,
  setTxCategoryFilter,
  txTypeFilter,
  setTxTypeFilter,
  categories,
  shownCount,
  onReset,
}) => {
  return (
    <Widget title="Filters" className="flex flex-col gap-2 font-mono text-[11px]">
      <div className="grid grid-cols-2 gap-2">
        <StyledInput
          placeholder="Search..."
          value={txSearch}
          onChange={(e) => setTxSearch(e.target.value)}
          className="text-[11px] py-1"
        />
        <select
          value={txCategoryFilter}
          onChange={(e) => setTxCategoryFilter(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded text-[11px] px-2"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={txTypeFilter}
          onChange={(e) => setTxTypeFilter(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded text-[11px] px-2 flex-1"
        >
          <option value="All">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <StyledButton type="button" onClick={onReset} className="text-[11px] py-1 px-2">
          Reset
        </StyledButton>
        <span className="text-[10px] text-amber-300 tabular-nums">{shownCount} shown</span>
      </div>
    </Widget>
  );
};

// Category manager modal (re-implemented)
const CategoryManagerModal = ({ isOpen, onClose, categories, onUpdate }) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#ffaa00");
  const [editingCategory, setEditingCategory] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: newCategoryName, color: newCategoryColor };
    try {
      if (editingCategory) {
        await api.put(`/finance/categories/${editingCategory._id}`, payload);
      } else {
        await api.post("/finance/categories", payload);
      }
      setEditingCategory(null);
      setNewCategoryName("");
      onUpdate();
    } catch {
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/finance/categories/${id}`);
      onUpdate();
    } catch {
      alert("Failed to delete category");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-md rounded-lg border border-gray-700 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold">Categories</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {categories.map((c) => (
            <div key={c._id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.color }} />
                <span>{c.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(c);
                    setNewCategoryName(c.name);
                    setNewCategoryColor(c.color);
                  }}
                  className="text-gray-400 hover:text-primary"
                >
                  <Edit size={14} />
                </button>
                <button onClick={() => handleDelete(c._id)} className="text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t border-gray-700/50">
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="h-10 w-10 p-1 bg-transparent"
          />
          <StyledInput
            placeholder="Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <StyledButton type="submit" className="py-2 px-3">
            {editingCategory ? "Update" : <Plus size={16} />}
          </StyledButton>
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setNewCategoryName("");
              }}
              className="p-2 rounded bg-gray-600 hover:bg-gray-500"
            >
              <X size={16} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

// Edit transaction modal (minimal)
const TransactionEditModal = ({ isOpen, transaction, onClose, onUpdate, categories, onDelete }) => {
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (transaction) setForm({ ...transaction, category: transaction.category?._id || "" });
  }, [transaction]);
  if (!isOpen || !form) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/finance/transactions/${transaction._id}`, {
        description: form.description,
        amount: Number(form.amount),
        date: form.date,
        type: form.type,
        category: form.category,
      });
      onUpdate();
      onClose();
    } catch {
      alert("Failed to update transaction");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/finance/transactions/${transaction._id}`);
      onDelete();
      onClose();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface w-full max-w-md p-6 rounded border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <StyledInput
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <StyledInput
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <StyledInput
            type="date"
            value={form.date.split("T")[0]}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded p-2"
          >
            <option value="">-- Category --</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex justify-between pt-2">
            <StyledButton type="button" onClick={handleDelete} className="bg-red-700 hover:bg-red-600">
              Delete
            </StyledButton>
            <div className="flex gap-2">
              <StyledButton type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500">
                Cancel
              </StyledButton>
              <StyledButton type="submit">Save</StyledButton>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const FinancialActionLogModal = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface max-w-2xl w-full p-6 rounded border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Action Log</h2>
        <div className="max-h-[60vh] overflow-y-auto space-y-1 font-mono text-[11px] pr-2">
          {logs.map((l) => (
            <div key={l._id || l.timestamp} className="flex justify-between border-b border-gray-700/50 py-1">
              <span className="text-amber-300">{new Date(l.timestamp).toLocaleString()}</span>
              <span className="text-gray-200 truncate flex-1 px-2">{l.message || l.action}</span>
              <span className="text-gray-500">{l.user || "you"}</span>
            </div>
          ))}
        </div>
        <div className="text-right mt-4">
          <StyledButton onClick={onClose}>Close</StyledButton>
        </div>
      </div>
    </div>
  );
};

// Main Finance Page
const FinancePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [actionLogs, setActionLogs] = useState([]);
  const fetchActionLog = async () => {
    try {
      const res = await api.get("/finance/log");
      setActionLogs(res.data.data);
    } catch (error) {
      setActionLogs([]);
    }
  };
  const handleClearFinances = async () => {
    if (!window.confirm("Are you sure you want to clear ALL your financial data? This cannot be undone!")) return;
    try {
      await api.post("/finance/clear");
      refreshData();
      fetchActionLog();
      alert("All finances cleared.");
    } catch (error) {
      alert("Failed to clear finances.");
    }
  };
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [activeAccount, setActiveAccount] = useState("checkings"); // 'checkings' or 'savings'
  const [displayTransactions, setDisplayTransactions] = useState([]);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [groupByDay, setGroupByDay] = useState(false);
  // Experimental: Bloomberg-style dense terminal UI mode
  const [terminalMode, setTerminalMode] = useState(false);
  // Filter controls
  const [txSearch, setTxSearch] = useState("");
  const [txCategoryFilter, setTxCategoryFilter] = useState("All");
  const [txTypeFilter, setTxTypeFilter] = useState("All");
  const ITEMS_PER_PAGE = 10; // Reduced to fit on single screen height without widget scrolling

  useEffect(() => {
    if (transactions.length > 0) {
      const savingsCategory = categories.find((cat) => cat.name && cat.name.trim().toLowerCase().includes("savings"));
      const savingsCategoryId = savingsCategory ? savingsCategory._id : null;

      const filtered = transactions.filter((t) => {
        const isSavings = t.category && t.category._id === savingsCategoryId;
        if (activeAccount === "savings") {
          return isSavings;
        }
        return !isSavings;
      });

      const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
      setDisplayTransactions(sorted);
      setCurrentPage(1); // Reset to first page on filter change
    }
  }, [transactions, activeAccount, categories]);

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
    fetchActionLog();
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

  const handleSortEnd = (activeId, overId) => {
    setDisplayTransactions((items) => {
      const oldIndex = items.findIndex((item) => item._id === activeId);
      const newIndex = items.findIndex((item) => item._id === overId);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  // --- Calculations ---
  const savingsCategory = categories.find((cat) => cat.name && cat.name.trim().toLowerCase().includes("savings"));
  const savingsCategoryId = savingsCategory ? savingsCategory._id : null;

  const { checkingsBalance, savingsBalance, transactionBalances } = useMemo(() => {
    const checkings = transactions.reduce((acc, t) => {
      if (t.category && t.category._id === savingsCategoryId) {
        return acc;
      }
      return acc + (t.type === "income" ? t.amount : -t.amount);
    }, 0);

    const savings = savingsCategory
      ? transactions.reduce((acc, t) => {
          if (t.category && t.category._id === savingsCategoryId) {
            return acc + (t.type === "income" ? t.amount : -t.amount);
          }
          return acc;
        }, 0)
      : 0;

    // Calculate balances starting from bottom (oldest) and working up
    let runningBalance = 0;
    const balanceMap = new Map();

    // Process transactions from bottom to top (oldest to newest)
    const reversedTransactions = [...displayTransactions].reverse();

    for (const t of reversedTransactions) {
      const amount = t.type === "income" ? t.amount : -t.amount;
      runningBalance += amount; // This now correctly sums up based on the filtered transaction log
      balanceMap.set(t._id, runningBalance);
    }

    const finalBalances = displayTransactions.map((t) => balanceMap.get(t._id) || 0);

    return {
      checkingsBalance: checkings,
      savingsBalance: savings,
      transactionBalances: finalBalances,
    };
  }, [displayTransactions, categories, savingsCategoryId, transactions, activeAccount]);

  // --- Filtering Logic (search/category/type) ---
  const filteredTransactions = useMemo(() => {
    return displayTransactions.filter((t, idx) => {
      const matchesSearch = txSearch
        ? (t.description || "").toLowerCase().includes(txSearch.toLowerCase()) ||
          (t.category?.name || "").toLowerCase().includes(txSearch.toLowerCase())
        : true;
      const matchesCategory = txCategoryFilter === "All" || t.category?._id === txCategoryFilter;
      const matchesType = txTypeFilter === "All" || t.type === txTypeFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [displayTransactions, txSearch, txCategoryFilter, txTypeFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [txSearch, txCategoryFilter, txTypeFilter]);

  // --- Pagination Logic (after filtering) ---
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const paginatedBalances = transactionBalances.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Command handler (must be declared before any conditional return to preserve hook order)
  const handleCommand = useCallback(
    (raw) => {
      const parts = raw.split(/\s+/);
      const cmd = parts[0].toUpperCase();
      switch (cmd) {
        case "HELP":
          alert("Commands: HELP, ADD, CAT, BILL, LOG, CLR, ACC SAV|CHK, SRCH <text>");
          break;
        case "ADD":
          document.querySelector('input[placeholder^="Description"], input[placeholder^="Search" ]')?.focus();
          break;
        case "CAT":
          setIsCategoryModalOpen(true);
          break;
        case "BILL":
          setIsBillModalOpen(true);
          break;
        case "LOG":
          setIsLogModalOpen(true);
          break;
        case "CLR":
          handleClearFinances();
          break;
        case "ACC":
          if (parts[1]) setActiveAccount(parts[1].toLowerCase().startsWith("s") ? "savings" : "checkings");
          break;
        case "SRCH":
          setTxSearch(parts.slice(1).join(" "));
          break;
        default:
          break;
      }
    },
    [handleClearFinances]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] px-4">
        <p className="text-center text-text-secondary animate-pulse">Loading Financial Data...</p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-[calc(100vh-120px)] max-w-[1800px] mx-auto w-full px-4 ${
        terminalMode ? "terminal-mode" : ""
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <PageHeader title="Financial Tracker" subtitle={`Managing your ${activeAccount} account.`} />
        <div className="flex gap-2 flex-wrap justify-end">
          <StyledButton
            onClick={() => setTerminalMode((m) => !m)}
            className={`py-2 px-3 flex items-center gap-2 text-sm transition-colors ${
              terminalMode
                ? "bg-amber-600 hover:bg-amber-500 text-black font-semibold"
                : "bg-gray-700 hover:bg-gray-600 text-amber-300"
            }`}
            title="Toggle Bloomberg Terminal Style"
          >
            {terminalMode ? "Terminal On" : "Terminal Off"}
          </StyledButton>
          <StyledButton
            onClick={() => setIsBillModalOpen(true)}
            className="py-2 px-3 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-sm"
          >
            <Plus size={16} /> Bills
          </StyledButton>
          <StyledButton
            onClick={() => setIsCategoryModalOpen(true)}
            className="py-2 px-3 flex items-center gap-2 text-sm"
          >
            <Settings size={16} /> Categories
          </StyledButton>
          <StyledButton
            onClick={handleClearFinances}
            className="py-2 px-3 flex items-center gap-2 bg-red-700 hover:bg-red-600 text-sm"
          >
            <Trash2 size={16} /> Clear
          </StyledButton>
          <StyledButton onClick={() => setIsLogModalOpen(true)} className="py-2 px-3 flex items-center gap-2 text-sm">
            Log
          </StyledButton>
        </div>
      </div>
      {/* Overview / Ticker */}
      <div className="mt-4">
        {terminalMode ? (
          <TickerBar
            selectedMonth={selectedMonth}
            checkings={checkingsBalance}
            savings={savingsBalance}
            transactions={transactions}
          />
        ) : (
          <OverviewBar
            selectedMonth={selectedMonth}
            checkings={checkingsBalance}
            savings={savingsBalance}
            transactions={transactions}
          />
        )}
      </div>
      {terminalMode && <CommandBar onCommand={handleCommand} />}
      {/* Layout */}
      {terminalMode ? (
        <div className="terminal-layout mt-5">
          {/* Metrics / Left */}
          <div className="flex flex-col gap-4 overflow-hidden">
            <MetricsPanel
              transactions={transactions}
              checkings={checkingsBalance}
              savings={savingsBalance}
              selectedMonth={selectedMonth}
            />
            <div className="flex items-center justify-center bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setActiveAccount("checkings")}
                className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors ${
                  activeAccount === "checkings"
                    ? "bg-emerald-500 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                Checkings
              </button>
              <button
                onClick={() => setActiveAccount("savings")}
                className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors ${
                  activeAccount === "savings"
                    ? "bg-sky-500 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                Savings
              </button>
            </div>
            <BillChecklist
              bills={bills}
              onTogglePaid={handleToggleBillPaid}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              terminalMode
            />
            <BudgetStatus
              categories={categories}
              transactions={transactions}
              selectedMonth={selectedMonth}
              budgets={bills}
              onUpdateBudgets={async (budgets) => {
                try {
                  await Promise.all(
                    budgets.map((b) => api.put(`/finance/bills/${b.category}/budget`, { amount: b.amount }))
                  );
                  refreshData();
                } catch {
                  alert("Failed to update budgets.");
                }
              }}
              terminalMode
            />
            <AddTransactionForm categories={categories} onTransactionAdded={refreshData} terminalMode />
          </div>
          {/* Center - Blotter */}
          <div className="flex flex-col gap-3">
            <TransactionToolbar
              txSearch={txSearch}
              setTxSearch={setTxSearch}
              txCategoryFilter={txCategoryFilter}
              setTxCategoryFilter={setTxCategoryFilter}
              txTypeFilter={txTypeFilter}
              setTxTypeFilter={setTxTypeFilter}
              categories={categories}
              shownCount={filteredTransactions.length}
              onReset={() => {
                setTxSearch("");
                setTxCategoryFilter("All");
                setTxTypeFilter("All");
              }}
            />
            <TransactionBlotter
              transactions={paginatedTransactions}
              balances={paginatedBalances}
              onEdit={handleEditTransaction}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
          {/* Right - Analytics */}
          <div className="flex flex-col gap-4">
            <DebtTracker />
            <BillAnalytics bills={bills} selectedMonth={selectedMonth} />
            <Widget title="Insights Coming Soon">
              <p className="text-xs text-text-secondary leading-relaxed">
                Trends, breakdowns, burn rate, saving trajectory coming soon.
              </p>
            </Widget>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div className="flex items-center justify-center bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setActiveAccount("checkings")}
                className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors ${
                  activeAccount === "checkings"
                    ? "bg-emerald-500 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                Checkings
              </button>
              <button
                onClick={() => setActiveAccount("savings")}
                className={`flex-1 py-2 px-4 text-sm font-bold rounded-md transition-colors ${
                  activeAccount === "savings"
                    ? "bg-sky-500 text-white"
                    : "bg-transparent text-gray-400 hover:bg-gray-700"
                }`}
              >
                Savings
              </button>
            </div>
            <BillChecklist
              bills={bills}
              onTogglePaid={handleToggleBillPaid}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
            <BudgetStatus
              categories={categories}
              transactions={transactions}
              selectedMonth={selectedMonth}
              budgets={bills}
              onUpdateBudgets={async (budgets) => {
                try {
                  await Promise.all(
                    budgets.map((b) => api.put(`/finance/bills/${b.category}/budget`, { amount: b.amount }))
                  );
                  refreshData();
                } catch {
                  alert("Failed to update budgets.");
                }
              }}
            />
            <AddTransactionForm categories={categories} onTransactionAdded={refreshData} />
          </div>
          <div className="lg:col-span-5 flex flex-col gap-4">
            <TransactionToolbar
              txSearch={txSearch}
              setTxSearch={setTxSearch}
              txCategoryFilter={txCategoryFilter}
              setTxCategoryFilter={setTxCategoryFilter}
              txTypeFilter={txTypeFilter}
              setTxTypeFilter={setTxTypeFilter}
              categories={categories}
              shownCount={filteredTransactions.length}
              onReset={() => {
                setTxSearch("");
                setTxCategoryFilter("All");
                setTxTypeFilter("All");
              }}
            />
            <TransactionList
              transactions={paginatedTransactions}
              onEdit={handleEditTransaction}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              onSortEnd={handleSortEnd}
              balances={paginatedBalances}
            />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-5">
            <DebtTracker />
            <BillAnalytics bills={bills} selectedMonth={selectedMonth} />
            <Widget title="Insights Coming Soon">
              <p className="text-xs text-text-secondary leading-relaxed">
                Trends, category breakdowns, burn rate, saving trajectory, etc.
              </p>
            </Widget>
          </div>
        </div>
      )}
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
      <TransactionEditModal
        isOpen={isEditTransactionModalOpen}
        transaction={selectedTransaction}
        onClose={() => setIsEditTransactionModalOpen(false)}
        onUpdate={refreshData}
        onDelete={refreshData}
        categories={categories}
      />
      <FinancialActionLogModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} logs={actionLogs} />
    </div>
  );
};

export default FinancePage;

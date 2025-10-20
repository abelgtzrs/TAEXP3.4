// RichFinancePage.jsx
// High-density financial dashboard (no vertical scroll on typical 1080p) providing
// transactions blotter, KPIs, bills, budgets, debts, and micro analytics.
// Keep this component self-contained (utility subcomponents inside) so it can
// be iterated independently from legacy FinancePage.

import { useState, useEffect, useMemo, useCallback } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis } from "recharts";
import { Plus, Trash2, Edit, ChevronLeft, ChevronRight, X } from "lucide-react";
import Widget from "../components/ui/Widget";
import StyledButton from "../components/ui/StyledButton";
import StyledInput from "../components/ui/StyledInput";
import PageHeader from "../components/ui/PageHeader";
import api from "../services/api";

// Layout constants
const VIEW_ROWS = 24; // conceptual baseline grid

// Helper: format number short
const fmt = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// KPI Panel
const KpiGrid = ({ kpis }) => (
  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
    {kpis.map((k) => (
      <div key={k.label} className="p-2 rounded bg-gray-800/60 border border-gray-700 flex flex-col">
        <span className="text-[10px] tracking-wide text-gray-400">{k.label}</span>
        <span className={`tabular-nums font-semibold ${k.color || "text-amber-200"}`}>{k.value}</span>
      </div>
    ))}
  </div>
);

// Sparkline (generic)
const Sparkline = ({ data }) => {
  if (!data || !data.length) return <div className="h-8" />;
  const max = Math.max(...data.map(Math.abs), 1);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className={`w-[3px] ${v >= 0 ? "bg-emerald-500" : "bg-red-500"}`}
          style={{ height: `${(Math.abs(v) / max) * 100}%` }}
        />
      ))}
    </div>
  );
};

// Bills mini list
const BillsMini = ({ bills, monthKey, onToggle, onAddRequest, onManageRequest }) => {
  const total = bills.reduce((a, b) => a + b.amount, 0);
  return (
    <Widget title="Bills" className="p-2 space-y-1 font-mono text-[11px]">
      <div className="flex justify-between mb-1 text-[10px]">
        <button onClick={onAddRequest} className="px-1 py-0.5 bg-gray-700/60 rounded hover:bg-gray-600">
          NEW
        </button>
        <button onClick={onManageRequest} className="px-1 py-0.5 bg-gray-700/60 rounded hover:bg-gray-600">
          MNG
        </button>
      </div>
      <div className="space-y-1 max-h-44 overflow-auto pr-1">
        {bills.map((b) => {
          const paid = b.paidForMonths.includes(monthKey);
          const rowClasses = paid
            ? "bg-green-900/20 border-green-700/40 line-through text-gray-500"
            : "bg-gray-900/40 border-gray-700/40 hover:border-amber-600/40";
          return (
            <div key={b._id} className={`flex items-center justify-between px-2 py-1 rounded border ${rowClasses}`}>
              <button onClick={() => onToggle(b._id, !paid)} className="text-xs font-bold mr-2">
                {paid ? "✓" : "○"}
              </button>
              <span className="truncate flex-1">{b.name}</span>
              <span className={`tabular-nums ml-2 ${paid ? "text-gray-500" : "text-gray-300"}`}>${fmt(b.amount)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between pt-1 border-t border-gray-700/40 text-[10px]">
        <span>Total</span>
        <span className="tabular-nums">${fmt(total)}</span>
      </div>
    </Widget>
  );
};

// Transaction blotter (compact)
const Blotter = ({ rows, balances, page, pages, setPage, onEdit }) => (
  <Widget title="Transactions" className="p-0 font-mono text-[11px] flex flex-col">
    <div className="overflow-auto" style={{ maxHeight: "420px" }}>
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-900/80 backdrop-blur border-b border-gray-700 text-gray-300">
          <tr className="uppercase text-[10px]">
            <th className="p-1 text-left">Date</th>
            <th className="p-1 text-left">Desc</th>
            <th className="p-1 text-left">Cat</th>
            <th className="p-1 text-right">Amt</th>
            <th className="p-1 text-right">Bal</th>
            <th className="p-1"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t, i) => {
            const amt = (t.type === "income" ? "+" : "-") + fmt(t.amount);
            return (
              <tr key={t._id} className="odd:bg-gray-800/40 even:bg-gray-800/20 hover:bg-gray-700/30">
                <td className="p-1 whitespace-nowrap text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                <td className="p-1 truncate max-w-[140px]">{t.description}</td>
                <td className="p-1" style={{ color: t.category?.color || "#888" }}>
                  {t.category?.name || "—"}
                </td>
                <td
                  className={`p-1 text-right tabular-nums ${t.type === "income" ? "text-green-400" : "text-red-400"}`}
                >
                  {amt}
                </td>
                <td className="p-1 text-right tabular-nums text-sky-300">{fmt(balances[i])}</td>
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
    {pages > 1 && (
      <div className="flex items-center justify-between px-2 py-1 border-t border-gray-700 text-[10px]">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>
        <span>
          Page {page}/{pages}
        </span>
        <button
          disabled={page === pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          className="disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    )}
  </Widget>
);

// Debt summary (placeholder minimal)
const DebtSummary = ({ debts }) => {
  const total = debts.reduce((a, d) => a + d.balance, 0);
  return (
    <Widget title="Debts" className="p-2 font-mono text-[11px] space-y-1">
      <div className="space-y-1 max-h-40 overflow-auto pr-1">
        {debts.map((d) => (
          <div key={d.id} className="flex justify-between px-2 py-1 rounded bg-gray-800/40 border border-gray-700/40">
            <span className="truncate">{d.name}</span>
            <span className="tabular-nums text-red-300">${fmt(d.balance)}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] pt-1 border-t border-gray-700/40">
        <span>Total</span>
        <span className="tabular-nums">${fmt(total)}</span>
      </div>
    </Widget>
  );
};

// Cash Flow micro chart
const CashFlow = ({ series }) => (
  <Widget title="Cash Flow 30d" className="p-2 font-mono text-[11px]">
    <div className="h-24">
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 4, left: 0, right: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cfPos" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cfNeg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#dc2626" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="d" hide />
          <YAxis hide domain={[(dataMin) => Math.min(dataMin, 0), (dataMax) => Math.max(dataMax, 0)]} />
          <Area
            type="monotone"
            dataKey="v"
            stroke="#10b981"
            fill="url(#cfPos)"
            isAnimationActive={false}
            dot={false}
            strokeWidth={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </Widget>
);

// Inline compact form component for adding a transaction
const InlineAddTransaction = ({ categories, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    type: "expense",
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    await onSubmit({ ...form, amount: Number(form.amount) });
    onClose();
  };
  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-end gap-2 p-2 bg-gray-900/80 border border-gray-700 rounded"
    >
      <select
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
        className="bg-gray-800 text-xs p-1 rounded"
      >
        <option value="income">INC</option>
        <option value="expense">EXP</option>
      </select>
      <input
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Desc"
        className="bg-gray-800 text-xs p-1 rounded flex-1"
      />
      <input
        type="number"
        step="0.01"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        placeholder="$"
        className="bg-gray-800 text-xs p-1 rounded w-20"
      />
      <select
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        className="bg-gray-800 text-xs p-1 rounded"
      >
        <option value="">Cat</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
        className="bg-gray-800 text-xs p-1 rounded"
      />
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2 py-1 rounded">
        ADD
      </button>
      <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1">
        Cancel
      </button>
    </form>
  );
};

// Inline compact form for adding/editing a bill
const InlineAddBill = ({ categories, onSubmit, onClose, editing }) => {
  const [form, setForm] = useState(editing || { name: "", amount: "", dueDay: 1, category: "" });
  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    await onSubmit({ ...form, amount: Number(form.amount), dueDay: Number(form.dueDay) });
    onClose();
  };
  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-end gap-2 p-2 bg-gray-900/80 border border-gray-700 rounded"
    >
      <input
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Bill"
        className="bg-gray-800 text-xs p-1 rounded flex-1"
      />
      <input
        type="number"
        step="0.01"
        value={form.amount}
        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
        placeholder="$"
        className="bg-gray-800 text-xs p-1 rounded w-20"
      />
      <input
        type="number"
        min={1}
        max={31}
        value={form.dueDay}
        onChange={(e) => setForm((f) => ({ ...f, dueDay: e.target.value }))}
        className="bg-gray-800 text-xs p-1 rounded w-14"
      />
      <select
        value={form.category}
        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
        className="bg-gray-800 text-xs p-1 rounded"
      >
        <option value="">Cat</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2 py-1 rounded">
        {editing ? "SAVE" : "ADD"}
      </button>
      <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1">
        Cancel
      </button>
    </form>
  );
};

// Minimal modal for editing a transaction
const EditTransactionModal = ({ tx, categories, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(() => (tx ? { ...tx, category: tx.category?._id || "" } : null));
  useEffect(() => {
    if (tx) setForm({ ...tx, category: tx.category?._id || "" });
  }, [tx]);
  if (!tx) return null;
  const submit = async (e) => {
    e.preventDefault();
    await onSave({ ...form, amount: Number(form.amount) });
  };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-gray-900 border border-gray-700 rounded p-4 space-y-3 text-sm"
      >
        <div className="flex justify-between items-start">
          <h2 className="font-semibold text-amber-200">Edit Transaction</h2>
          <button type="button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="bg-gray-800 p-1 rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Date</span>
            <input
              type="date"
              value={form.date.slice(0, 10)}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="bg-gray-800 p-1 rounded"
            />
          </label>
          <label className="flex flex-col gap-1 col-span-2">
            <span className="text-[10px] uppercase text-gray-400">Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="bg-gray-800 p-1 rounded"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Amount</span>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="bg-gray-800 p-1 rounded"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase text-gray-400">Category</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="bg-gray-800 p-1 rounded"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Delete transaction?")) onDelete();
            }}
            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
              Cancel
            </button>
            <button type="submit" className="text-xs px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white">
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const RichFinancePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bills, setBills] = useState([]);
  const [debts, setDebts] = useState([]); // placeholder data source
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showAddTx, setShowAddTx] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [editTx, setEditTx] = useState(null);
  const PER_PAGE = 14;

  const monthKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [txRes, catRes, billRes] = await Promise.all([
          api.get("/finance/transactions"),
          api.get("/finance/categories"),
          api.get("/finance/bills"),
        ]);
        setTransactions(txRes.data.data);
        setCategories(catRes.data.data);
        setBills(billRes.data.data);
        // fake debts (replace with API if exists)
        setDebts([
          { id: "1", name: "Student Loan", balance: 5200 },
          { id: "2", name: "Car", balance: 8300 },
        ]);
      } catch (e) {
        console.error("Failed to load finance data", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived balances
  const { runningBalances, checkingsBalance, savingsBalance } = useMemo(() => {
    let run = 0;
    const bal = [];
    const txSorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    for (const t of txSorted) {
      run += t.type === "income" ? t.amount : -t.amount;
      bal.push({ id: t._id, value: run });
    }
    const map = new Map(bal.map((b) => [b.id, b.value]));
    const displayOrder = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const runningBalances = displayOrder.map((t) => map.get(t._id));

    // crude partition: treat category containing 'savings' as savings bucket
    const savingsCat = categories.find((c) => c.name?.toLowerCase().includes("savings"));
    const savingsId = savingsCat?._id;
    let chk = 0,
      sav = 0;
    for (const t of transactions) {
      const amount = t.type === "income" ? t.amount : -t.amount;
      if (t.category?._id === savingsId) sav += amount;
      else chk += amount;
    }
    return { runningBalances, checkingsBalance: chk, savingsBalance: sav };
  }, [transactions, categories]);

  // Pagination
  const pages = Math.ceil(transactions.length / PER_PAGE) || 1;
  const pagedTx = useMemo(() => {
    const ordered = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return ordered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [transactions, page]);
  const pagedBalances = useMemo(() => {
    const ordered = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const slice = ordered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    return slice.map((t) => runningBalances[ordered.indexOf(t)]);
  }, [transactions, page, runningBalances]);

  // KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
    const inc = monthTx.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const exp = monthTx.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const net = inc - exp;
    const avg = monthTx.length ? (inc + exp) / monthTx.length : 0;
    const savingsRatio = inc ? ((savingsBalance > 0 ? savingsBalance : 0) / inc) * 100 : 0;
    return [
      { label: "INC", value: fmt(inc), color: "text-green-400" },
      { label: "EXP", value: fmt(exp), color: "text-red-400" },
      { label: "NET", value: fmt(net), color: net >= 0 ? "text-emerald-400" : "text-red-500" },
      { label: "AVG TX", value: fmt(avg) },
      { label: "CHK", value: fmt(checkingsBalance), color: "text-sky-300" },
      { label: "SAV", value: fmt(savingsBalance), color: "text-sky-400" },
      { label: "TX CNT", value: transactions.length, color: "text-amber-300" },
      { label: "SAV %", value: savingsRatio.toFixed(1) + "%", color: "text-amber-200" },
    ];
  }, [transactions, checkingsBalance, savingsBalance]);

  // Cash flow 30 day series
  const cashFlowSeries = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      map.set(key, (map.get(key) || 0) + (t.type === "income" ? t.amount : -t.amount));
    }
    const now = new Date();
    const series = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      series.push({ d: key, v: map.get(key) || 0 });
    }
    return series;
  }, [transactions]);

  const handleAddTransaction = async (payload) => {
    try {
      await api.post("/finance/transactions", payload);
      const r = await api.get("/finance/transactions");
      setTransactions(r.data.data);
    } catch (e) {
      alert("Add failed");
    }
  };

  const handleSaveTransaction = async (payload) => {
    if (!editTx) return;
    try {
      await api.put(`/finance/transactions/${editTx._id}`, payload);
      const r = await api.get("/finance/transactions");
      setTransactions(r.data.data);
      setEditTx(null);
    } catch (e) {
      alert("Update failed");
    }
  };

  const handleDeleteTransaction = async () => {
    if (!editTx) return;
    try {
      await api.delete(`/finance/transactions/${editTx._id}`);
      const r = await api.get("/finance/transactions");
      setTransactions(r.data.data);
      setEditTx(null);
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleAddBill = async (payload) => {
    try {
      await api.post("/finance/bills", payload);
      const r = await api.get("/finance/bills");
      setBills(r.data.data);
    } catch (e) {
      alert("Bill add failed");
    }
  };
  const handleUpdateBill = async (id, payload) => {
    try {
      await api.put(`/finance/bills/${id}`, payload);
      const r = await api.get("/finance/bills");
      setBills(r.data.data);
      setEditingBill(null);
    } catch (e) {
      alert("Bill update failed");
    }
  };
  const handleDeleteBill = async (id) => {
    if (!window.confirm("Delete bill?")) return;
    try {
      await api.delete(`/finance/bills/${id}`);
      const r = await api.get("/finance/bills");
      setBills(r.data.data);
      setEditingBill(null);
    } catch (e) {
      alert("Bill deletion failed");
    }
  };

  if (loading) return <p className="p-8 text-center text-sm text-gray-400">Loading...</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] mx-auto w-full max-w-[1900px] px-4 gap-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <PageHeader title="Financial Tracker" subtitle="High-density view" />
        <div className="flex gap-2">
          <StyledButton
            className="text-xs px-3 py-1"
            onClick={() => {
              setShowAddTx((s) => !s);
              setShowAddBill(false);
            }}
          >
            Add Transaction
          </StyledButton>
          <StyledButton
            className="text-xs px-3 py-1"
            onClick={() => {
              setShowAddBill((s) => !s);
              setShowAddTx(false);
            }}
          >
            Add Bill
          </StyledButton>
        </div>
      </div>
      {showAddTx && (
        <InlineAddTransaction
          categories={categories}
          onSubmit={handleAddTransaction}
          onClose={() => setShowAddTx(false)}
        />
      )}
      {showAddBill && (
        <InlineAddBill
          categories={categories}
          editing={
            editingBill
              ? {
                  name: editingBill.name,
                  amount: editingBill.amount,
                  dueDay: editingBill.dueDay,
                  category: editingBill.category?._id || "",
                }
              : null
          }
          onSubmit={async (data) => {
            if (editingBill) {
              await handleUpdateBill(editingBill._id, data);
            } else {
              await handleAddBill(data);
            }
          }}
          onClose={() => {
            setShowAddBill(false);
            setEditingBill(null);
          }}
        />
      )}
      {/* Top KPIs + Cash Flow */}
      <div className="grid grid-cols-12 gap-3 flex-shrink-0">
        <div className="col-span-8 space-y-3">
          <KpiGrid kpis={kpis} />
          <div className="grid grid-cols-3 gap-3">
            <CashFlow series={cashFlowSeries} />
            <Widget title="Net Spark" className="p-2 font-mono text-[11px]">
              <Sparkline data={cashFlowSeries.map((p) => p.v)} />
            </Widget>
            <Widget title="Category Split" className="p-2 font-mono text-[11px]">
              <ResponsiveContainer width="100%" height={96}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={categories.map((c) => ({
                      name: c.name,
                      value: transactions
                        .filter((t) => t.category?._id === c._id && t.type === "expense")
                        .reduce((a, b) => a + b.amount, 0),
                    }))}
                    outerRadius={38}
                    innerRadius={20}
                    paddingAngle={2}
                  >
                    {categories.map((c, i) => (
                      <Cell key={c._id} fill={c.color || "#888"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </Widget>
          </div>
        </div>
        <div className="col-span-4 grid grid-rows-2 gap-3">
          <BillsMini
            bills={bills}
            monthKey={monthKey}
            onToggle={async (id, p) => {
              try {
                await api.put(`/finance/bills/${id}/toggle-paid`, { monthKey, isPaid: p });
                const r = await api.get("/finance/bills");
                setBills(r.data.data);
              } catch {
                alert("Toggle failed");
              }
            }}
            onAddRequest={() => {
              setShowAddBill(true);
              setEditingBill(null);
            }}
            onManageRequest={() => {
              const bill = bills[0];
              if (bill) {
                setEditingBill(bill);
                setShowAddBill(true);
              }
            }}
          />
          <DebtSummary debts={debts} />
        </div>
      </div>
      {/* Middle: Transactions + Side analytics */}
      <div className="grid grid-cols-12 gap-3 flex-grow min-h-0">
        <div className="col-span-8 min-h-0">
          <Blotter
            rows={pagedTx}
            balances={pagedBalances}
            page={page}
            pages={pages}
            setPage={setPage}
            onEdit={(t) => setEditTx(t)}
          />
        </div>
        <div className="col-span-4 grid grid-rows-2 gap-3 min-h-0">
          <Widget title="Projections" className="p-2 font-mono text-[11px]">
            Coming soon
          </Widget>
          <Widget title="Notes" className="p-2 font-mono text-[11px]">
            Annotate anomalies, large one-offs, etc.
          </Widget>
        </div>
      </div>
      <EditTransactionModal
        tx={editTx}
        categories={categories}
        onClose={() => setEditTx(null)}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default RichFinancePage;

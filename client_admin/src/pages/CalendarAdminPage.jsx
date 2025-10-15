import { useEffect, useMemo, useState } from "react";
import { calendarService } from "../services/calendarService";
import MonthlyCalendar from "../components/calendar/MonthlyCalendar";

export default function CalendarAdminPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1); // 1-12

  const [events, setEvents] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    allDay: true,
    category: "personal",
    color: "#4f46e5",
  });
  const [billForm, setBillForm] = useState({
    name: "",
    amount: 0,
    dueDay: 1,
    category: "general",
    notes: "",
    autoPay: false,
    isActive: true,
  });
  const [yearlyForm, setYearlyForm] = useState({
    title: "",
    month: month,
    day: 1,
    category: "birthday",
    color: "#10b981",
    notes: "",
    isActive: true,
  });

  const refresh = async () => {
    setLoading(true);
    setError("");
    try {
      const [ev, bi] = await Promise.all([calendarService.listEvents(), calendarService.listBills()]);
      setEvents(ev);
      setBills(bi);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const monthlyItems = useMemo(() => ({ year, month }), [year, month]);
  const [monthlyFeed, setMonthlyFeed] = useState([]);
  useEffect(() => {
    calendarService
      .getMonthlySchedule(monthlyItems)
      .then(setMonthlyFeed)
      .catch(() => setMonthlyFeed([]));
  }, [monthlyItems.year, monthlyItems.month, events, bills]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await calendarService.createEvent({ ...eventForm, date: new Date(eventForm.date) });
      setEventForm({ title: "", description: "", date: "", allDay: true, category: "personal", color: "#4f46e5" });
      await refresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create event");
    }
  };

  const handleCreateBill = async (e) => {
    e.preventDefault();
    try {
      await calendarService.createBill(billForm);
      setBillForm({ name: "", amount: 0, dueDay: 1, category: "general", notes: "", autoPay: false, isActive: true });
      await refresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create bill");
    }
  };

  const handleCreateYearly = async (e) => {
    e.preventDefault();
    try {
      await calendarService.createYearly(yearlyForm);
      setYearlyForm({ title: "", month, day: 1, category: "birthday", color: "#10b981", notes: "", isActive: true });
      await refresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create yearly event");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 w-full">
        <h1 className="text-3xl font-bold text-main">Calendar Admin</h1>
      </div>

      {error && <div className="mb-4 text-red-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-3">
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="p-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value || now.getFullYear()))}
              className="p-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <button
              onClick={() => calendarService.getMonthlySchedule({ year, month }).then(setMonthlyFeed)}
              className="px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Refresh
            </button>
          </div>
          <MonthlyCalendar year={year} month={month} items={monthlyFeed} />
        </div>

        <div className="space-y-6">
          <form
            onSubmit={handleCreateEvent}
            className="p-4 rounded-lg border shadow-sm"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <h2 className="text-xl font-semibold text-main mb-3">Add Event</h2>
            <input
              placeholder="Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <input
              type="date"
              value={eventForm.date}
              onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <div className="flex items-center gap-2 mb-2">
              <label className="text-text-secondary text-sm">All Day</label>
              <input
                type="checkbox"
                checked={eventForm.allDay}
                onChange={(e) => setEventForm({ ...eventForm, allDay: e.target.checked })}
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-text-secondary text-sm">Category</label>
              <select
                value={eventForm.category}
                onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                className="p-2 rounded border"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="bill">Bill</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-text-secondary text-sm">Color</label>
              <input
                type="color"
                value={eventForm.color}
                onChange={(e) => setEventForm({ ...eventForm, color: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Create Event
            </button>
          </form>

          <form
            onSubmit={handleCreateBill}
            className="p-4 rounded-lg border shadow-sm"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <h2 className="text-xl font-semibold text-main mb-3">Add Monthly Bill</h2>
            <input
              placeholder="Name"
              value={billForm.name}
              onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={billForm.amount}
              onChange={(e) => setBillForm({ ...billForm, amount: parseFloat(e.target.value || 0) })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <input
              type="number"
              min="1"
              max="31"
              placeholder="Due Day"
              value={billForm.dueDay}
              onChange={(e) => setBillForm({ ...billForm, dueDay: parseInt(e.target.value || 1) })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <input
              placeholder="Category"
              value={billForm.category}
              onChange={(e) => setBillForm({ ...billForm, category: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <textarea
              placeholder="Notes"
              value={billForm.notes}
              onChange={(e) => setBillForm({ ...billForm, notes: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <div className="flex items-center gap-2 mb-4">
              <label className="text-text-secondary text-sm">Auto Pay</label>
              <input
                type="checkbox"
                checked={billForm.autoPay}
                onChange={(e) => setBillForm({ ...billForm, autoPay: e.target.checked })}
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Create Bill
            </button>
          </form>

          <form
            onSubmit={handleCreateYearly}
            className="p-4 rounded-lg border shadow-sm"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}
          >
            <h2 className="text-xl font-semibold text-main mb-3">Add Yearly Event</h2>
            <input
              placeholder="Title"
              value={yearlyForm.title}
              onChange={(e) => setYearlyForm({ ...yearlyForm, title: e.target.value })}
              className="w-full p-2 mb-2 rounded border"
              style={{
                backgroundColor: "var(--color-bg)",
                borderColor: "var(--color-primary)",
                color: "var(--color-text-main)",
              }}
            />
            <div className="flex items-center gap-2 mb-2">
              <label className="text-text-secondary text-sm">Month</label>
              <select
                value={yearlyForm.month}
                onChange={(e) => setYearlyForm({ ...yearlyForm, month: parseInt(e.target.value) })}
                className="p-2 rounded border"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <label className="text-text-secondary text-sm">Day</label>
              <input
                type="number"
                min="1"
                max="31"
                value={yearlyForm.day}
                onChange={(e) => setYearlyForm({ ...yearlyForm, day: parseInt(e.target.value || 1) })}
                className="p-2 rounded border"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-text-secondary text-sm">Category</label>
              <select
                value={yearlyForm.category}
                onChange={(e) => setYearlyForm({ ...yearlyForm, category: e.target.value })}
                className="p-2 rounded border"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-primary)",
                  color: "var(--color-text-main)",
                }}
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <label className="text-text-secondary text-sm">Color</label>
              <input
                type="color"
                value={yearlyForm.color}
                onChange={(e) => setYearlyForm({ ...yearlyForm, color: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 rounded bg-primary/20 hover:bg-primary/30 border border-primary/40 text-main"
            >
              Create Yearly
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

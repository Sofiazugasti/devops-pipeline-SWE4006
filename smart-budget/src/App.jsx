import { useState, useMemo } from "react"; // Ya no necesitas useEffect aquí
import "./app.css";
import logo from "./assets/logo2.png";

const TYPES = ["income", "expense"];

export default function App() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ type: "income", label: "", amount: "" });
  const totalIncome = useMemo(() => income.reduce((s, r) => s + Number(r.amount || 0), 0), [income]);
  const totalExpenses = useMemo(
    () => expenses.reduce((s, r) => s + Number(r.amount || 0), 0),
    [expenses]
  );
  const balance = totalIncome - totalExpenses;
  const spentPct = totalIncome ? ((totalExpenses / totalIncome) * 100).toFixed(1) : "0.0";

  const money = (n) => (Number(n) || 0).toLocaleString(undefined, { style: "currency", currency: "USD" });

  // acciones
  const handleAdd = () => {
    const amt = Number(form.amount);
    if (!form.label.trim() || !amt || amt <= 0) return;

    if (form.type === "income") {
      setIncome((prev) => [...prev, { label: form.label.trim(), amount: amt }]);
    } else {
      setExpenses((prev) => [...prev, { label: form.label.trim(), amount: amt }]);
    }
    setForm({ type: form.type, label: "", amount: "" });
  };

  return (
    <div className="page">
      <header className="header">
        <img src={logo} alt="SmartBudget logo" className="logo" />
        <p className="tagline">Track your income and expenses easily</p>
      </header>

      {/* Summary */}
      <section className="card summary-card">
        <div className="summary-title">Summary</div>
        <div className="summary-row">
          <div className="metric">
            <span className="metric-label">Income:</span>
            <span className="metric-value">{money(totalIncome)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Expenses:</span>
            <span className="metric-value">{money(totalExpenses)}</span>
          </div>
          <div className="metric">
            <span className="metric-label">Balance:</span>
            <span className={`metric-value ${balance < 0 ? "bad" : ""}`}>{money(balance)}</span>
          </div>
        </div>
        <p className="spent-line">You spent {spentPct}% of your income</p>
      </section>

      {/* Formulario único: Type · Label · Amount */}
      <section className="card entry-card">
        <div className="form-grid">
          <div className="form-field">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field span-2">
            <label>Label</label>
            <input
              type="text"
              placeholder={form.type === "income" ? "e.g., Salary" : "e.g., Rent"}
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            />
          </div>

          <div className="form-field">
            <label>Amount</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder={form.type === "income" ? "e.g., 3000" : "e.g., 1200"}
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>

          <div className="form-actions">
            <button className="add-btn" onClick={handleAdd}>Add</button>
          </div>
        </div>
      </section>

      {/* Columnas */}
      <section className="columns">
        <div className="card col">
          <h3>Incomes</h3>
          <div className="list-header">
            <span>Label</span>
            <span>Amount</span>
          </div>
          <ul className="list">
            {income.length === 0 && <li className="empty">No incomes yet</li>}
            {income.map((row, idx) => (
              <li key={`inc-${idx}`} className="row">
                <span className="cell">{row.label}</span>
                <span className="cell money">{money(row.amount)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card col">
          <h3>Expenses</h3>
          <div className="list-header">
            <span>Label</span>
            <span>Amount</span>
          </div>
          <ul className="list">
            {expenses.length === 0 && <li className="empty">No expenses yet</li>}
            {expenses.map((row, idx) => (
              <li key={`exp-${idx}`} className="row">
                <span className="cell">{row.label}</span>
                <span className="cell money">{money(row.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

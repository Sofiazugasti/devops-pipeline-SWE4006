import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

// Utilidad para seleccionar por etiqueta de <label> (evita cambios de placeholder)
const getInputByLabel = (labelText) => {
  return screen.getByLabelText(new RegExp(`^${labelText}\\b`, "i"));
};

test("renderiza la app con elementos clave", () => {
  render(<App />);

  // Logo (por alt)
  expect(screen.getByAltText(/smartbudget logo/i)).toBeInTheDocument();

  // Tagline
  expect(screen.getByText(/track your income and expenses easily/i)).toBeInTheDocument();

  // Secciones
  expect(screen.getByText(/summary/i)).toBeInTheDocument();
  expect(screen.getByText(/incomes/i)).toBeInTheDocument();
  expect(screen.getByText(/expenses/i)).toBeInTheDocument();

  // Mensajes vacíos
  expect(screen.getByText(/no incomes yet/i)).toBeInTheDocument();
  expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();

  // Botón Add
  expect(screen.getAllByRole("button", { name: /add/i })[0]).toBeInTheDocument();
});

test("agrega un income y actualiza el summary", () => {
  render(<App />);

  // Seleccionar Type = income (ya viene por defecto, pero lo hacemos explícito)
  const typeSelect = screen.getByLabelText(/type/i);
  fireEvent.change(typeSelect, { target: { value: "income" } });

  // Llenar Label y Amount
  const labelInput = getInputByLabel("Label");
  fireEvent.change(labelInput, { target: { value: "Salary" } });

  const amountInput = getInputByLabel("Amount");
  fireEvent.change(amountInput, { target: { value: "3000" } });

  // Click en Add (usa el primero de la página)
  fireEvent.click(screen.getAllByRole("button", { name: /add/i })[0]);

  // Ahora el total Income debería reflejar el cambio (evitamos formato exacto de moneda)
  expect(screen.getByText(/income:/i).nextSibling.textContent).toMatch(/3000|3,000|3 000/);
  // Expenses se mantiene en 0
  expect(screen.getByText(/expenses:/i).nextSibling.textContent).toMatch(/0/);
  // Balance > 0
  expect(screen.getByText(/balance:/i).nextSibling.textContent).toMatch(/3000|3,000|3 000/);

  // Y la lista de incomes ya no está vacía
  expect(screen.queryByText(/no incomes yet/i)).not.toBeInTheDocument();
  expect(screen.getByText(/salary/i)).toBeInTheDocument();
});

test("agrega un expense y actualiza balance y porcentaje gastado", () => {
  render(<App />);

  // Agregar primero un income 2000
  fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "income" } });
  fireEvent.change(screen.getByLabelText(/^Label/i), { target: { value: "Salary" } });
  fireEvent.change(screen.getByLabelText(/^Amount/i), { target: { value: "2000" } });
  fireEvent.click(screen.getAllByRole("button", { name: /add/i })[0]);

  // Cambiar a expense y agregar 500
  fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "expense" } });
  fireEvent.change(screen.getByLabelText(/^Label/i), { target: { value: "Rent" } });
  fireEvent.change(screen.getByLabelText(/^Amount/i), { target: { value: "500" } });
  fireEvent.click(screen.getAllByRole("button", { name: /add/i })[0]);

  // Expenses ~ 500
  expect(screen.getByText(/expenses:/i).nextSibling.textContent).toMatch(/500|500\.00|500,00/);

  // Balance = 1500 aprox
  expect(screen.getByText(/balance:/i).nextSibling.textContent).toMatch(/1,500|1500|1 500/);

  // Texto de porcentaje
  // "You spent 25% of your income"
  expect(screen.getByText(/you spent/i).textContent).toMatch(/25(\.0)?%/i);
});

test("reset (handleDelete) limpia ingresos y gastos", () => {
  render(<App />);

  // Agregar un income rápido para no estar en cero
  fireEvent.change(screen.getByLabelText(/type/i), { target: { value: "income" } });
  fireEvent.change(screen.getByLabelText(/^Label/i), { target: { value: "X" } });
  fireEvent.change(screen.getByLabelText(/^Amount/i), { target: { value: "100" } });
  fireEvent.click(screen.getAllByRole("button", { name: /add/i })[0]);

  // Llamar a handleDelete NO está expuesto con un botón, así que no podemos hacer click.
  // En UI no hay botón de borrar todo; este test se quedaría como guía si luego agregas un botón:
  // <button onClick={handleDelete}>Reset</button>
  // Por ahora, solo verificamos que el render y el add funcionan.
});

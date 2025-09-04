import React, { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";

// Helper function to create an empty row object
const emptyLine = () => ({
  code: "",
  group: "",
  name: "",
  packing: "",
  batch: "",
  quantity: "",
  scheme: "",
  rate: "",
  discountPct: "",
  gstPct: "",
  mrp: "",
  ptr: "",
});

function RetailSalesBill() {
  const initialRows = 5;

  // Bill Info
  const [billInfo, setBillInfo] = useState({
    stockPoint: "",
    billDate: new Date().toISOString().slice(0, 10),
    billNumber: "",
    billType: "Cash",
    lastDueDate: "",
  });

  // Party/Header Info
  const [partyInfo, setPartyInfo] = useState({
    partyCode: "",
    partyName: "",
    area: "",
    city: "",
    cell: "",
    gst: "",
    aadhar: "",
    pan: "",
    dl20b: "",
    dl21b: "",
  });

  // Medicines Table
  const [lines, setLines] = useState(
    Array.from({ length: initialRows }, emptyLine)
  );

  const updateBillInfo = (key, value) =>
    setBillInfo((p) => ({ ...p, [key]: value }));
  const updatePartyInfo = (key, value) =>
    setPartyInfo((p) => ({ ...p, [key]: value }));

  const updateLine = (idx, key, value) => {
    setLines((prev) => {
      const next = [...prev];
      if (!next[idx]) next[idx] = emptyLine();
      next[idx][key] = value;
      return next;
    });
  };

  const addLine = () => {
    setLines((prev) => [...prev, emptyLine()]);
  };

  const removeLine = (idx) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetAll = () => {
    setBillInfo({
      stockPoint: "",
      billDate: new Date().toISOString().slice(0, 10),
      billNumber: "",
      billType: "Cash",
      lastDueDate: "",
    });
    setPartyInfo({
      partyCode: "",
      partyName: "",
      area: "",
      city: "",
      cell: "",
      gst: "",
      aadhar: "",
      pan: "",
      dl20b: "",
      dl21b: "",
    });
    setLines(Array.from({ length: initialRows }, emptyLine));
  };

  // Calculations
  const derived = useMemo(() => {
    let baseSum = 0,
      discSum = 0,
      gstSum = 0;

    const rows = lines.map((row) => {
      const r = row || emptyLine(); // safety
      const qty = Number(r.quantity) || 0;
      const rate = Number(r.rate) || 0;
      const dis = Number(r.discountPct) || 0;
      const gst = Number(r.gstPct) || 0;

      const base = qty * rate;
      const discount = (base * dis) / 100;
      const taxable = base - discount;
      const gstAmt = (taxable * gst) / 100;
      const lineTotal = taxable + gstAmt;

      baseSum += base;
      discSum += discount;
      gstSum += gstAmt;

      return { base, discount, gstAmt, lineTotal };
    });

    const net = baseSum - discSum + gstSum;
    return { rows, baseSum, discSum, gstSum, net };
  }, [lines]);

  const toINR = (n) =>
    isNaN(n)
      ? "–"
      : n.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  // Enter key navigation
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll("input, select"));
      const currentIndex = inputs.indexOf(e.target);
      if (inputs[currentIndex + 1]) {
        inputs[currentIndex + 1].focus();
      }
    }
  };

  const handleMedicineEnter = (e, rowIdx) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = Array.from(
        document.querySelectorAll(
          `tr[data-row-index="${rowIdx}"] input, select`
        )
      );
      const currentIndex = inputs.indexOf(e.target);

      // If it's the last input in the row, add a new row
      if (currentIndex === inputs.length - 1) {
        addLine();
        setTimeout(() => {
          const newRow = document.querySelector(
            `tr[data-row-index="${rowIdx + 1}"]`
          );
          if (newRow) {
            newRow.querySelector("input")?.focus();
          }
        }, 0);
      } else {
        // Otherwise, move to the next input in the current row
        if (inputs[currentIndex + 1]) {
          inputs[currentIndex + 1].focus();
        }
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 antialiased no-print-background py-4 px-2 sm:px-4">
      <div className="invoice-container w-full bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden print:shadow-none print:ring-0 print:rounded-none print:border-none">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 p-4 md:p-6 no-print">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              Rx
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold leading-tight">
                Distributor Invoice
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Pharma Billing Theme • Distributor → Pharmacy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={resetAll}
              className="px-3 md:px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[.99] cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 md:px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-[.99] cursor-pointer"
            >
              Print
            </button>
          </div>
        </div>

        {/* Bill & Party Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          <section className="lg:col-span-1 rounded-2xl border border-gray-200 p-4">
            <h2 className="text-base font-semibold mb-3">Bill Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <LabeledInput
                label="Stock Point"
                value={billInfo.stockPoint}
                onChange={(v) => updateBillInfo("stockPoint", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                type="date"
                label="Bill Date"
                value={billInfo.billDate}
                onChange={(v) => updateBillInfo("billDate", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="Bill Number"
                value={billInfo.billNumber}
                onChange={(v) => updateBillInfo("billNumber", v)}
                onKeyDown={handleEnter}
              />
              <LabeledSelect
                label="Bill Type"
                value={billInfo.billType}
                onChange={(v) => updateBillInfo("billType", v)}
                options={["Cash", "Credit", "Online", "UPI", "Card"]}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                type="date"
                label="Bill Last Due Date"
                value={billInfo.lastDueDate}
                onChange={(v) => updateBillInfo("lastDueDate", v)}
                onKeyDown={handleEnter}
              />
            </div>
          </section>

          <section className="lg:col-span-2 rounded-2xl border border-gray-200 p-4">
            <h2 className="text-base font-semibold mb-3">
              Party / Header Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <LabeledInput
                label="Party Code"
                value={partyInfo.partyCode}
                onChange={(v) => updatePartyInfo("partyCode", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="Party Name"
                value={partyInfo.partyName}
                onChange={(v) => updatePartyInfo("partyName", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="Area"
                value={partyInfo.area}
                onChange={(v) => updatePartyInfo("area", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="City"
                value={partyInfo.city}
                onChange={(v) => updatePartyInfo("city", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="Cell"
                value={partyInfo.cell}
                onChange={(v) => updatePartyInfo("cell", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="GST"
                value={partyInfo.gst}
                onChange={(v) => updatePartyInfo("gst", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="Aadhar"
                value={partyInfo.aadhar}
                onChange={(v) => updatePartyInfo("aadhar", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="PAN"
                value={partyInfo.pan}
                onChange={(v) => updatePartyInfo("pan", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="DL20B"
                value={partyInfo.dl20b}
                onChange={(v) => updatePartyInfo("dl20b", v)}
                onKeyDown={handleEnter}
              />
              <LabeledInput
                label="DL21B"
                value={partyInfo.dl21b}
                onChange={(v) => updatePartyInfo("dl21b", v)}
                onKeyDown={handleEnter}
              />
            </div>
          </section>
        </div>

        {/* Medicines Table */}
        <section className="p-4 md:p-6 pt-0">
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-semibold">Medicines</h2>
            </div>

            {/* Combined Table with overflow */}
            <div className="overflow-x-auto max-h-[720px] rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">S.No</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Code</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Group</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Name</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Packing</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Batch</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Qty</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Scheme</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Rate</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Dis %</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">GST %</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">Value</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">MRP</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600">PTR</th>
                    <th className="px-3 py-2 border-b font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((row, idx) => {
                    if (!row) row = emptyLine();
                    const calc = derived.rows[idx] || { lineTotal: 0 };
                    return (
                      <tr key={idx} className="odd:bg-white even:bg-gray-50" data-row-index={idx}>
                        <td className="px-3 py-2 border-b border-r text-center align-middle">{idx + 1}</td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.code ?? ""}
                            onChange={(v) => updateLine(idx, "code", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.group ?? ""}
                            onChange={(v) => updateLine(idx, "group", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.name ?? ""}
                            onChange={(v) => updateLine(idx, "name", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.packing ?? ""}
                            onChange={(v) => updateLine(idx, "packing", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.batch ?? ""}
                            onChange={(v) => updateLine(idx, "batch", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Number
                            value={row.quantity ?? ""}
                            onChange={(v) => updateLine(idx, "quantity", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.scheme ?? ""}
                            onChange={(v) => updateLine(idx, "scheme", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Number
                            value={row.rate ?? ""}
                            onChange={(v) => updateLine(idx, "rate", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Number
                            value={row.discountPct ?? ""}
                            onChange={(v) => updateLine(idx, "discountPct", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Number
                            value={row.gstPct ?? ""}
                            onChange={(v) => updateLine(idx, "gstPct", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-3 py-2 border-b border-r align-middle text-right tabular-nums text-gray-600">
                          ₹ {toINR(calc.lineTotal)}
                        </td>
                        <td className="px-0 py-0 border-b border-r">
                          <Input
                            value={row.mrp ?? ""}
                            onChange={(v) => updateLine(idx, "mrp", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-0 py-0 border-b">
                          <Number
                            value={row.ptr ?? ""}
                            onChange={(v) => updateLine(idx, "ptr", v)}
                            onKeyDown={(e) => handleMedicineEnter(e, idx)}
                          />
                        </td>
                        <td className="px-3 py-2 border-b text-center align-middle">
                          <button
                            onClick={() => removeLine(idx)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-100 cursor-pointer"
                            aria-label="Remove row"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={addLine}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-blue-600 font-medium hover:bg-blue-50 active:scale-[.99] cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-gray-700">Notes:</span> Value
                = (Qty × Rate) − Discount + GST. MRP/PTR are reference values
                from item master.
              </p>
              <p>Validate GSTIN, Aadhar, PAN formats as per your backend rules.</p>
            </div>
            <div className="ml-auto w-full md:w-[420px]">
              <div className="space-y-2 text-sm">
                <Row label="Subtotal" value={`₹ ${toINR(derived.baseSum)}`} />
                <Row
                  label="Total Discount"
                  value={`₹ ${toINR(derived.discSum)}`}
                />
                <Row label="Total GST" value={`₹ ${toINR(derived.gstSum)}`} />
                <div className="h-px bg-gray-200 my-2" />
                <Row label="Net Payable" value={`₹ ${toINR(derived.net)}`} bold />
              </div>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-6">
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold mb-2">
              Authorized Signature (Distributor)
            </h3>
            <div className="h-20 border border-dashed rounded-xl" />
          </div>
          <div className="rounded-2xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold mb-2">Received By (Pharmacy)</h3>
            <div className="h-20 border border-dashed rounded-xl" />
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .invoice-container {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            max-width: none !important;
            overflow: visible !important;
          }
          input, select, button {
            appearance: none;
            border: none;
            background: transparent;
          }
          td, th {
            border-color: #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
}

// UI Primitives
function LabeledInput({ label, value, onChange, type = "text", placeholder, onKeyDown }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/50"
      />
    </label>
  );
}

function LabeledSelect({ label, value, onChange, options = [], onKeyDown }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600/50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

// Input component with minimal styling, relying on the parent td for borders
function Input({ value, onChange, placeholder = "", onKeyDown }) {
  return (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      className="block w-full h-full border-none px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600/20"
    />
  );
}

// Number component with minimal styling, relying on the parent td for borders
function Number({ value, onChange, onKeyDown, placeholder = "0" }) {
  return (
    <input
      type="number"
      step="any"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="block w-full h-full border-none px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600/20 tabular-nums"
    />
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? "font-semibold text-gray-900" : "text-gray-700"
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

export default RetailSalesBill;

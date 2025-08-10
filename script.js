const { useState } = React;

function Calculator() {
  const [expr, setExpr] = useState("0");
  const [lastEval, setLastEval] = useState(false);

  function formatResult(n) {
    if (!isFinite(n)) return "Error";
    const s = parseFloat(n.toFixed(10)).toString();
    return s;
  }

  function handleNumber(digit) {
    if (lastEval) {
      setExpr(digit);
      setLastEval(false);
      return;
    }
    const match = expr.match(/([0-9.]+)$/);
    const lastNumber = match ? match[0] : "";
    if (lastNumber === "0" && !lastNumber.includes(".")) {
      if (digit === "0") return; 
      setExpr(prev => prev.slice(0, -1) + digit);
      return;
    }
    setExpr(prev => (prev === "0" ? digit : prev + digit));
  }

  function handleDecimal() {
    if (lastEval) {
      setExpr("0.");
      setLastEval(false);
      return;
    }

    const match = expr.match(/([0-9.]+)$/);
    const lastNumber = match ? match[0] : "";
    if (lastNumber.includes(".")) return;

    if (/[\+\-\*\/]$/.test(expr)) {
      setExpr(prev => prev + "0.");
    } else {
      setExpr(prev => prev + ".");
    }
  }

  function handleOperator(op) {
    if (lastEval) {
      setExpr(prev => prev + op);
      setLastEval(false);
      return;
    }
    if (op === "-") {
      if (/[\+\-\*\/]$/.test(expr)) {
        if (/[\+\-\*\/]-$/.test(expr)) return;
        setExpr(prev => prev + "-");
      } else {
        setExpr(prev => prev + "-");
      }
      return;
    }
    setExpr(prev => prev.replace(/[\+\-\*\/]+$/, "") + op);
  }

  function handleClear() {
    setExpr("0");
    setLastEval(false);
  }

  function handleEquals() {
    try {
      let safe = expr.replace(/[\+\-\*\/]+$/, "");
      if (safe === "") {
        setExpr("0");
        setLastEval(true);
        return;
      }
      const result = Function('"use strict";return (' + safe + ')')();
      const formatted = formatResult(result);
      setExpr(formatted);
      setLastEval(true);
    } catch (err) {
      setExpr("Error");
      setLastEval(true);
    }
  }

  return (
    <div id="calculator" style={{ width: 340 }}>
      <div id="display" style={{
        background: "linear-gradient(180deg,#fff7f0,#fffdfa)",
        padding: 12,
        borderRadius: 8,
        textAlign: "right",
        fontSize: 24,
        marginBottom: 12,
        border: "1px solid rgba(0,0,0,0.05)",
        color: "#5a3b00"
      }}>
        {expr}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        <button id="clear" onClick={handleClear} style={{ background: "#f87171", color: "#fff", padding: 14, borderRadius: 8 }}>AC</button>
        <button id="divide" onClick={() => handleOperator("/")} style={opBtn}>/</button>
        <button id="multiply" onClick={() => handleOperator("*")} style={opBtn}>*</button>
        <button id="subtract" onClick={() => handleOperator("-")} style={opBtn}>-</button>

        <button id="seven" onClick={() => handleNumber("7")} style={numBtn}>7</button>
        <button id="eight" onClick={() => handleNumber("8")} style={numBtn}>8</button>
        <button id="nine" onClick={() => handleNumber("9")} style={numBtn}>9</button>
        <button id="add" onClick={() => handleOperator("+")} style={opBtn}>+</button>

        <button id="four" onClick={() => handleNumber("4")} style={numBtn}>4</button>
        <button id="five" onClick={() => handleNumber("5")} style={numBtn}>5</button>
        <button id="six" onClick={() => handleNumber("6")} style={numBtn}>6</button>
        <button id="equals" onClick={handleEquals} style={{ gridRow: "span 2", padding: 16, background: "#fcd34d", fontWeight: 700, borderRadius: 8 }}>=</button>

        <button id="one" onClick={() => handleNumber("1")} style={numBtn}>1</button>
        <button id="two" onClick={() => handleNumber("2")} style={numBtn}>2</button>
        <button id="three" onClick={() => handleNumber("3")} style={numBtn}>3</button>

        <button id="zero" onClick={() => handleNumber("0")} style={{ gridColumn: "span 2", padding: 14, borderRadius: 8 }}>0</button>
        <button id="decimal" onClick={handleDecimal} style={{ padding: 14, borderRadius: 8 }}>.</button>
      </div>
    </div>
  );
}

const numBtn = {
  padding: 14,
  borderRadius: 8,
  background: "linear-gradient(180deg,#fff,#f8f8f8)",
  boxShadow: "0 4px 8px rgba(0,0,0,0.05)"
};
const opBtn = {
  padding: 14,
  borderRadius: 8,
  background: "#ffecd1",
  color: "#8b4513",
  fontWeight: 700
};

ReactDOM.render(<Calculator />, document.getElementById("root"));


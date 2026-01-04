import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Day from "./Day";

function App() {
  return (
    <div>
      {/* HEADER */}
      <header
        style={{
          textAlign: "center",
          padding: "24px 0",
          fontSize: "28px",
          fontWeight: "700",
          letterSpacing: "0.5px"
        }}
      >
        Daily Planer
      </header>

      <hr style={{ border: "none", borderTop: "1px solid #ddd", marginBottom: "20px" }} />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/day/:date" element={<Day />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Routes } from "react-router-dom";
import Login from "../router/Login";
import Signup from "../router/Signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<div>BarberShop </div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;

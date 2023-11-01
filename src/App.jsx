import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './home/components/Home'
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./access/Login";
import Register from "./access/Register";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={Home} path="/" exact />
          <Route Component={AdminDashboard} path="/dashboard-admin" exact />
          <Route Component={Register} path="/register" exact />
          <Route Component={Login} path="/login" exact />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

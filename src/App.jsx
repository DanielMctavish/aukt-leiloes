import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './home/components/Home'
import AdminDashboard from "./admin/AdminDashboard";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route Component={Home} path="/" exact />
          <Route Component={AdminDashboard} path="/dashboard-admin" exact />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

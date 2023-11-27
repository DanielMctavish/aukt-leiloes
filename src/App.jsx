import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from './home/components/Home'
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./access/Login";
import Register from "./access/Register";
import { AdvertiserAddProduct } from "./advertiser/addProduct/AdvertiserAddProduct";
import { AdvertiserAuctions } from "./advertiser/auctions/AdvertiserAuctions";
import { AdvertiserFinancial } from "./advertiser/financial/AdvertiserFinancial";
import { AdvertiserProductsList } from "./advertiser/productsList/AdvertiserProductsList";
import { DashboardAdvertiser } from "./advertiser/_dashboard/DashboardAdvertiser";
import AdminAuctions from "./admin/AdminAuctions";
import AuctsDetail  from "./admin/AdminAuctsDetail";
import AdminAdvertisers from "./admin/AdminAdvertisers";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Home AUK */}
          <Route Component={Home} path="/" exact />
          <Route Component={AdminDashboard} path="/dashboard-admin" exact />
          <Route Component={Register} path="/register" exact />
          <Route Component={Login} path="/login" exact />

          {/* Anunciante */}
          <Route Component={DashboardAdvertiser} path="/advertiser" exact />
          <Route Component={AdvertiserAddProduct} path="/advertiser/add-product" exact />
          <Route Component={AdvertiserAddProduct} path="/advertiser/add-product" exact />
          <Route Component={AdvertiserAuctions} path="/advertiser/auctions" exact />
          <Route Component={AdvertiserFinancial} path="/advertiser/advertiser-financial" exact />
          <Route Component={AdvertiserProductsList} path="/advertiser/products" exact />

          {/* ADMIN */}
          <Route Component={AdminAuctions} path="/auctions-admin" exact />
          <Route Component={AuctsDetail} path="/aucts-detail" exact />
          <Route Component={AdminAdvertisers} path="/advertisers-admin" exact />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

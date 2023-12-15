import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./home/components/Home";
import AdminDashboard from "./admin/AdminDashboard";
import Login from "./access/Login";
import Register from "./access/Register";
import {  AdvertiserCreateAuct } from "./advertiser/CreateAuct/AdvertiserCreateAuct";
import { AdvertiserAuctions } from "./advertiser/auctions/AdvertiserAuctions";
import { AdvertiserFinancial } from "./advertiser/financial/AdvertiserFinancial";
import { AdvertiserProductsList } from "./advertiser/productsList/AdvertiserProductsList";
import { DashboardAdvertiser } from "./advertiser/_dashboard/DashboardAdvertiser";
import AdminAuctions from "./admin/AdminAuctions";
import AuctsDetail from "./admin/AdminAuctsDetail";
import AdminAdvertisers from "./admin/AdminAdvertisers";
import AdminClient from "./admin/AdminClient";
import AdminProfile from "./admin/AdminProfile";
import AdminWallet from "./admin/AdminWallet";
import AuctionedProductDetails from "./admin/AuctsDetails/auctionedProductDetails";
import AssideAdmin from "./admin/asside/AssideAdmin";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Home AUK */}
          <Route Component={Home} path="/" exact />
          <Route Component={Register} path="/register" exact />
          <Route Component={Login} path="/login" exact />

          {/* ADMIN */}
          <Route Component={AdminDashboard} path="/admin/dashboard" exact />
          <Route Component={AdminAuctions} path="/admin/aucts" exact />
          <Route Component={AdminAdvertisers} path="/admin/advertisers" exact />
          <Route Component={AdminClient} path="/admin/clients" exact />
          <Route Component={AdminProfile} path="/admin/profile" exact />
          <Route Component={AuctsDetail} path="/admin/aucts/details" exact />
          <Route Component={AdminWallet} path="/admin/wallet" exact />
          <Route Component={AuctionedProductDetails} path="/admin/products/details" exact />
          <Route Component={AssideAdmin} path="asside-admin" exact />

          {/* Anunciante */}
          <Route Component={DashboardAdvertiser}
            path="/advertiser/dashboard"
            exact />
          <Route
            Component={AdvertiserCreateAuct}
            path="/advertiser/create-auct"
            exact
          />
          <Route
            Component={AdvertiserAuctions}
            path="/advertiser/auctions"
            exact
          />
          <Route
            Component={AdvertiserFinancial}
            path="/advertiser/advertiser-financial"
            exact
          />
          <Route
            Component={AdvertiserProductsList}
            path="/advertiser/products"
            exact
          />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

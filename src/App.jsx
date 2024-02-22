import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./home/components/Home";
import AdminDashboard from "./admin/AdminDashboard";
import { AdvertiserCreateAuct } from "./advertiser/CreateAuct/AdvertiserCreateAuct";
import { AdvertiserAuctions } from "./advertiser/auctions/AdvertiserAuctions";
import { AdvertiserFinancial } from "./advertiser/financial/AdvertiserFinancial";
import { AdvertiserProductsList } from "./advertiser/productsList/AdvertiserProductsList";
import { DashboardAdvertiser } from "./advertiser/_dashboard/DashboardAdvertiser";
import AdminAuctions from "./admin/AdminAuctions";
import AuctsDetail from "./admin/AdminAuctsDetail";
import AdminAdvertisers from "./admin/AdminAdvertisers";
import AdminClient from "./admin/AdminClient";
import AdminProfile from "./admin/AdminProfile";
import AdminWallet from "./admin/wallet/AdminWallet";
import AuctionedProductDetails from "./admin/AuctsDetails/auctionedProductDetails";
import AssideAdmin from "./admin/asside/AssideAdmin";
import AdvertiserClients from "./advertiser/clients/AdvertiserClients";
import AdvertiserWallet from "./advertiser/Wallet/AdvertiserWallet";
import ClientRegister from "./access/client/ClientRegister";
import ClientLogin from "./access/client/ClientLogin";
import AdvertiserRegister from "./access/advertiser/AdvertiserRegister";
import AdvertiserLogin from "./access/advertiser/AdvertiserLogin";
import AuctFloor from "./a-floor/AuctFloor";
import AdvertiserProfile from "./advertiser/profile/AdvertiserProfile";
import AdminLogin from "./access/admin/AdminLogin";
import AdvertiserAuctDetails from "./advertiser/auctions/details/AdvertiserAuctDetails";
import AdvertiserProductDetails from "./advertiser/auctions/details/AdvertiserProductDetails";
import { AdvertiserEdtiAuct } from "./advertiser/CreateAuct/AdvertiserEdtiAuct";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Home AUK */}
          <Route Component={Home} path="/" exact />

          {/* ACCESS */}
          <Route Component={ClientRegister} path="/client/register" exact />
          <Route Component={ClientLogin} path="/client/login" exact />
          <Route Component={AdvertiserRegister} path="/advertiser/register" exact />
          <Route Component={AdvertiserLogin} path="/advertiser/login" exact />

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
          <Route Component={AdminLogin} path="/admin/login" exact />

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
            Component={AdvertiserEdtiAuct}
            path="/advertiser/edit-auct"
            exact
          />
          <Route
            Component={AdvertiserAuctions}
            path="/advertiser/auctions"
            exact
          />
          <Route
            Component={AdvertiserAuctDetails}
            path="/advertiser/auctions-details"
            exact
          />
          <Route
            Component={AdvertiserProductDetails}
            path="/advertiser/product-details/:param"
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
          <Route
            Component={AdvertiserClients}
            path="/advertiser/clients"
            exact
          />
          <Route
            Component={AdvertiserWallet}
            path="/advertiser/wallet"
            exact
          />
          <Route
            Component={AdvertiserProfile}
            path="/advertiser/profile"
            exact
          />

          {/* AUCT FLOOR */}
          <Route Component={AuctFloor} path="/floor" exact />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

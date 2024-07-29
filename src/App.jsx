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
import DashboardClient from "./Clients/Dashboard/DashboardClient";
import ClientArremates from "./Clients/arremates/ClientArremates";
import ClientAucts from "./Clients/aucts/ClientAucts";
import ClientWallet from "./Clients/wallet/ClientWallet";
import ClientProfile from "./Clients/profile/ClientProfile";
import HomeAdvertiser from "./home/advertiser-home/HomeAdv";
import ProductDetailAdv from "./home/advertiser-home/ProductDetailAdv";
import DashboardAuctControl from "./advertiser/control/DashboardAuctControl";
import SecurityConfirmation from "./access/security/SecurityConfirmation";
import SubscriptionAdvertiser from "./home/forms/SubscriptionAdvertiser";
import ClientBids from "./Clients/bids/ClientBids";
import FloorHub from "./a-floor/hub/FloorHub";
import Categorias from "./home/components/Categorias";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Home AUK */}
          <Route Component={Home} path="/" exact />
          <Route Component={Categorias} path="/categorias" exact />
          {/* Home Advertiser */}
          <Route Component={HomeAdvertiser} path="/advertiser/home/:advertiser_id" exact />
          <Route Component={ProductDetailAdv} path="/advertiser/home/product/:product_id" exact />
          <Route Component={SubscriptionAdvertiser} path="/advertiser/form/subscription" exact />

          {/* ACCESS */}
          <Route Component={ClientRegister} path="/client/register" exact />
          <Route Component={ClientLogin} path="/client/login" exact />
          <Route Component={AdvertiserRegister} path="/advertiser/register/:register_token" exact />
          <Route Component={AdvertiserLogin} path="/advertiser/login" exact />
          <Route Component={SecurityConfirmation} path="/security-confirmation" exact />

          {/* CLIENTS */}
          <Route Component={DashboardClient} path="/client/dashboard" exact />
          <Route Component={ClientArremates} path="/client/auctioned" exact />
          <Route Component={ClientBids} path="/client/bids" exact />
          <Route Component={ClientAucts} path="/client/aucts" exact />
          <Route Component={ClientWallet} path="/client/wallet" exact />

          <Route Component={ClientProfile} path="/client/profile" exact />
          <Route Component={ClientLogin} path="/client/login" exact />
          <Route Component={ClientRegister} path="/client/register" exact />

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
          <Route Component={DashboardAdvertiser} path="/advertiser/dashboard" exact />
          <Route Component={AdvertiserCreateAuct} path="/advertiser/create-auct" exact />
          <Route Component={AdvertiserEdtiAuct} path="/advertiser/edit-auct" exact />
          <Route Component={AdvertiserAuctions} path="/advertiser/auctions" exact />
          <Route Component={AdvertiserAuctDetails} path="/advertiser/auctions-details" exact />
          <Route Component={AdvertiserProductDetails} path="/advertiser/product-details/:product_id" exact />
          <Route Component={AdvertiserFinancial} path="/advertiser/advertiser-financial" exact />
          <Route Component={AdvertiserProductsList} path="/advertiser/products" exact />
          <Route Component={AdvertiserClients} path="/advertiser/clients" exact />
          <Route Component={AdvertiserWallet} path="/advertiser/wallet" exact />
          <Route Component={AdvertiserProfile} path="/advertiser/profile" exact />
          <Route Component={DashboardAuctControl} path="/advertiser/auctions-controls" exact />

          {/* AUCT FLOOR */}
          <Route Component={FloorHub} path="/floor/hub" exact />
          <Route Component={AuctFloor} path="/floor/:auct_id" exact />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

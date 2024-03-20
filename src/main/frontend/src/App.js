import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "./pages/login/Login";
import CreateNickname from "./pages/login/CreateNickname";
import Token from "./pages/join/Token";
import TabBar from "./component/TabBar";
import Home from "./pages/home/Home";
import ProductList from "./component/ProductList";
import FarmList from "./component/FarmList";
import AuctionList from "./component/AuctionList";
import AllProduct from "./pages/product/AllProduct";

function App() {
  return (
      <BrowserRouter>
        <div className="App">
          <Routes>
              <Route
                  path="/"
                  element={
                      localStorage.getItem("jwt") ? (
                          <Navigate replace to="/home" />
                      ) : (
                          <Navigate replace to="/auth" />
                      )
                  }
              />
              <Route path="auth" element={<Login />} />
              <Route path="home" element={<Home />} />
              <Route
                  path="/user/login/oauth_kakao"
                  element={
                      localStorage.getItem("jwt") ? (
                          <Navigate replace to="/home" />
                      ) : (
                          <Token />
                      )
                  }
              />
              <Route
                  path="/user/nickname/create"
                  element={<CreateNickname />}
              />
              <Route
                  path="/tabbar"
                  element={<TabBar />}
              />
              <Route
                  path="/home"
                  element={<Home />}
              />
              <Route
                  path="/product/list"
                  element={<AllProduct />}
              />
              <Route
                  path="/farm/list"
                  element={<FarmList />}
              />
              <Route
                  path="/auction/list"
                  element={<AuctionList />}
              />
          </Routes>
        </div>
      </BrowserRouter>
  )
}

export default App;

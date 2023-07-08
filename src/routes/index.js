// import Menu from "../pages/Menu";
// import Cart from "../pages/Cart/indexCart";
// import Detail from "../pages/Detail";
// import ShowAll from "../pages/ShowAll";
import Home from "~/pages/home/home.js";
import Menu from "~/pages/menu/menu";
import AddDish from "~/pages/AddDish/index";
import Bill from "~/pages/Bill/Bill";
import Login from "~/pages/Login/index";
import { Fragment } from "react";
import HiddenMenu from "~/pages/hidden_menu/hidden_menu";

export const publicRoutes = [
//   { path: "/home/:table", component: Home, layout: null },
  { path: "/", component: Home },
  { path: "/menu", component: Menu},
  { path: "/hidden-menu", component: HiddenMenu},
  { path: "/addDish", component: AddDish},
  { path: "/bill", component: Bill},
  { patg: "/login", component: Login},
//   { path: "/cart", component: Cart, layout: null },
//   { path: "/showall", component: ShowAll, layout: null },

//   { path: "/detail", component: Detail },
  { path: "*", component: Fragment, layout: null },

  //{ path: "/upload", component: Upload, layout: null },
];

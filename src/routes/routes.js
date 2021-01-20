import { lazy } from "react";
import Items from "../views/items";

const Dashboard = lazy(() => import("../views/dashboard"));
const Transaction = lazy(() => import("../views/transaction"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/transaction", name: "Transaction", component: Transaction },
  { path: "/items", name: "Items", component: Items },
];

export default routes;

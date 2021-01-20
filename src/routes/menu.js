import HomeIcon from "@material-ui/icons/Home";
import ReceiptIcon from "@material-ui/icons/Receipt";
const menu = [
  {
    name: "Home",
    icon: <HomeIcon />,
    to: "/dashboard",
  },
  {
    name: "Transaction",
    icon: <ReceiptIcon />,
    to: "/transaction",
  },
];

export default menu;

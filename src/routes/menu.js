import HomeIcon from "@material-ui/icons/Home";
import ReceiptIcon from "@material-ui/icons/Receipt";
import DescriptionIcon from "@material-ui/icons/Description";
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
  {
    name: "Items",
    icon: <DescriptionIcon />,
    to: "/items",
  },
];

export default menu;

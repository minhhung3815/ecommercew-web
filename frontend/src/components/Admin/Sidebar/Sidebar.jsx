import { Link, useNavigate, redirect } from "react-router-dom";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ReviewsIcon from "@mui/icons-material/Reviews";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css";
import { useSnackbar } from "notistack";
import { logoutUser } from "../../../actions/userAction";

const navMenu = [
  {
    id: 1,
    icon: <EqualizerIcon />,
    label: "Dashboard",
    ref: "/admin/dashboard",
  },
  {
    id: 2,
    icon: <ShoppingBagIcon />,
    label: "Orders",
    ref: "/admin/orders",
  },
  {
    id: 3,
    icon: <InventoryIcon />,
    label: "Products",
    ref: "/admin/products",
  },
  {
    id: 4,
    icon: <AddBoxIcon />,
    label: "Add Product",
    ref: "/admin/new_product",
  },
  {
    id: 5,
    icon: <GroupIcon />,
    label: "Users",
    ref: "/admin/users",
  },
  {
    id: 10,
    icon: <PersonAddIcon />,
    label: "Add User",
    ref: "/admin/new_user",
  },
  {
    id: 6,
    icon: <ReviewsIcon />,
    label: "Reviews",
    ref: "/admin/reviews",
  },
  {
    id: 7,
    icon: <AccountBoxIcon />,
    label: "My Profile",
    ref: "/account",
  },
  {
    id: 8,
    icon: <LogoutIcon />,
    label: "Logout",
  },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    enqueueSnackbar("Logout Successfully", { variant: "success" });
  };

  return (
    <aside className="sidebar z-10 sm:z-0 block min-h-screen fixed left-0 pb-14 max-h-screen w-2/4 sm:w-1/5 bg-gray-800 text-white overflow-x-hidden border-r">
      <div className="flex items-center gap-3 bg-gray-500 p-2 rounded-lg shadow-lg my-4 mx-3.5">
        <Avatar alt="Avatar" src={user.avatar.url} />
        <div className="flex flex-col gap-0">
          <span className="font-medium text-lg">{user.name}</span>
          <span className="text-gray-300 text-sm">{user.email}</span>
        </div>
        <button
          onClick={() => setToggleSidebar(false)}
          className="sm:hidden bg-gray-800 ml-auto rounded-full w-10 h-10 flex items-center justify-center"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col w-full gap-0 my-8">
        {navMenu.map((item, index) => {
          const { icon, label, ref } = item;
          return (
            <>
              {label === "Logout" ? (
                <button
                  onClick={handleLogout}
                  key={item.id}
                  className="hover:bg-gray-700 flex gap-3 items-center py-3 px-4 font-medium"
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ) : (
                <Link
                  to={ref}
                  key={item.id}
                  className={`${
                    activeTab === index ? "bg-gray-700" : "hover:bg-gray-700"
                  } flex gap-3 items-center py-3 px-4 font-medium`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              )}
            </>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;

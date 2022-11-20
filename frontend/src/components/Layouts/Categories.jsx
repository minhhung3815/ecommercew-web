import mobiles from "../../assets/images/Categories/phone.png";
import fashion from "../../assets/images/Categories/fashion.png";
import electronics from "../../assets/images/Categories/laptop-removebg-preview.png";
import home from "../../assets/images/Categories/home.png";
import travel from "../../assets/images/Categories/travel.png";
import appliances from "../../assets/images/Categories/screen.png";
import furniture from "../../assets/images/Categories/camera.png";
import beauty from "../../assets/images/Categories/beauty.png";
import grocery from "../../assets/images/Categories/gamepad.png";
import tablet from "../../assets/images/Categories/tablet-removebg-preview.png"
import headphone from "../../assets/images/Categories/headphone-removebg-preview.png"
import Apple from "../../assets/images/Categories/Apple.png"
import charge from "../../assets/images/Categories/charge-removebg-preview.png"
import { Link } from "react-router-dom";
import axios from "axios";

const catNav = [
  {
    name: "Mobiles",
    icon: mobiles,
  },
  {
    name: "Tablets",
    icon: tablet,
  },
  {
    name: "Headphones",
    icon: headphone,
  },
  {
    name: "Apple",
    icon: Apple,
  },
  {
    name: "Accessories",
    icon: charge,
  },
  {
    name: "Screens",
    icon: appliances,
  },
  {
    name: "Cameras",
    icon: furniture,
  },
  {
    name: "Laptops",
    icon: electronics,
  },
  {
    name: "Gamepads",
    icon: grocery,
  },
];



const Categories = () => {
  return (
    <section className="hidden sm:block bg-white mt-10 mb-4 min-w-full px-12 py-1 shadow overflow-hidden">
      <div className="flex items-center justify-between mt-4">
        {catNav.map((item, i) => (
          <Link
            to={`/products?category=${item.name}`}
            className="flex flex-col gap-1 items-center p-2 group"
            key={i}
          >
            <div className="h-16 w-16">
              <img
                draggable="true"
                className="h-full w-full object-contain"
                src={item.icon}
                alt={item.name}
              />
            </div>
            <span className="text-sm text-gray-800 font-medium group-hover:text-primary-blue">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;

import {Link, useLocation} from "react-router";
import logo from "../assets/Logo.png";

const links = [
  {to:"/dashboard", label:"Dashboard"},
  {to:"/profile", label:"My Items"},
  {to:"#", label:"Messages"},
//  {to:"#", label:"Transactions" },
  {to:"/settings", label:"Settings"},
];

export default function Menu(){
  const location = useLocation();

  return (
    <nav className="menu">
      <div className="brand">
        <img src={logo} alt="mElita logo" />
      </div>

      <div>
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className={location.pathname === link.to ? "active": ""} >
            {link.label}
          </Link>
        ))}
      </div>

      <button
        className="logout"
        onClick={() =>{
          localStorage.removeItem("token");
          window.location.href="/login";    
          }} >
        Log Out
      </button>
    </nav>
  );
}
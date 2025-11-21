import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import './Menu.scss';

const menuList =
    [
        { name: "DUAREALIZM", path: "/duarealizm" },
        { name: "PROEGZYSTENCJALIZM", path: "/proegzystencjalizm" },
        { name: "UNIFORMIZM", path: "/uniformizm" },
    ]

const Menu = () => {

    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const onClickHandler = (path: string) => {
        setActiveLink(path);
    };

    return (
        <div className="main_menu">
          <ul>
            {menuList.map(({ name, path }) => (
              <li key={path}>
                <Link
                  className={`menu_link ${activeLink === path ? "active" : ""}`}
                  to={path}
                  onClick={() => onClickHandler(path)}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
}

export default Menu

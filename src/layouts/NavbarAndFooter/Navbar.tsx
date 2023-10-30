import React from "react";
import {Link, NavLink} from 'react-router-dom'
import { useOktaAuth } from "@okta/okta-react";
import SpinLoading from "../Utils/SpinLoading";

const Navbar = () => {

  const { oktaAuth, authState } = useOktaAuth();

  if (!authState){
    return <SpinLoading/>
  }

  const handleLogout =async () => oktaAuth.signOut()

  console.log(authState)


  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">LU v 2 Read</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarDropdown"
          aria-controls="navbarDropdown"
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to='/home'>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to='/search'>
                Search Book
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto ">

            { !authState.isAuthenticated ?
              <li className="nav-item m-1">
                <Link to='/login' type="button" className="btn btn-outline-light" href="#">
                  Sign-in
                </Link>
              </li>
              :
              <li className="nav-item m-1">
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

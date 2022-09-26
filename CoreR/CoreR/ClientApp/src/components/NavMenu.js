import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { MsalContext } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export class NavMenu extends Component {
    static displayName = NavMenu.name;
    static contextType = MsalContext;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
    }

    

    handleLogin() {
        const msalInstance = this.context.instance;
        msalInstance.loginRedirect(loginRequest).catch(e => {
            console.log(e);
        });
    }

    handleLogout() {
        const msalInstance = this.context.instance;
        msalInstance.logoutRedirect({
            postLogoutRedirectUri: "/",
        });
    }

    logged() {
        const msalInstance = this.context.instance;
        return msalInstance.getAllAccounts().length > 0;
    }


    render() {
        

    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">CoreR</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav flex-grow">
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} className="text-dark" to="/counter">Counter</NavLink>
              </NavItem>
            {this.logged() ?
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/user-info">User info</NavLink>
                </NavItem>
                : ""}
            {this.logged() ?
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/fetch-data">Fetch data</NavLink>
                </NavItem>
                :""}
                 {this.logged() ? <button className="btn btn-primary" onClick={() => this.handleLogout()}>Logout</button> : <button className="btn btn-primary" onClick={() => this.handleLogin()}>Login</button>}
            </ul>
          </Collapse>
            </Navbar>
      </header>
    );
  }
}

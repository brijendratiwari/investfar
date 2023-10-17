import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Link, NavLink } from "react-router-dom";
import icons from "../../icons/image--001.png";
import icons2 from "../../icons/image--000.png";
import icons3 from "../../icons/image--002.png";
import icons4 from "../../icons/image--003.png";


class Sidebar extends Component {

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        //const { user } = this.props.auth;
        return (
            <div className="h-100" id="sidebar-wrapper">
                <div className="list-group list-group-flush sidebar-hieght">

                    <div class="sidebar">
                        <nav class="navbar navbar-expand-lg mb-0 p-0">
                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon align-items-center justify-content-center d-flex"><i
                                    class="fa fa-bars text-white"></i></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul class="navbar-nav">
                                    <li>
                                        <NavLink to="/dashboard" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons} /><span>Manage Customers</span></div>
                                        </NavLink>
                                    </li>
                                    <li >
                                        <NavLink to="/manageCompanies" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons} /><span>Manage Companies</span></div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/manageProperties" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons2} /><span>Manage Properties</span></div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/manageCategory" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons3} /><span>Manage Category/
                                                SubCategory
                                              </span>
                                            </div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/managePropertiesRequests" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons2} /><span>Manage Properties Requests</span></div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/manageInvesterConsultant" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons4} /><span>Manage Investor Consultant</span></div>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/manageBlog" activeClassName="active">
                                            <div class="linkblock d-flex align-items-center"><img
                                                src={icons2} /><span>Manage Blog</span></div>
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                    {/* <Link to="/dashboard" className="list-group-item list-group-item-action">Dashboard</Link>
                    <Link to="/users" className="list-group-item list-group-item-action">Users</Link>
                    <Link to="/events" className="list-group-item list-group-item-action">Events</Link>
                    <button className="list-group-item list-group-item-action" onClick={this.onLogoutClick}>Logout <FontAwesomeIcon icon={faSignOutAlt} /></button> */}
                </div>
            </div>
        );
    }
}

Sidebar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Sidebar);

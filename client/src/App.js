import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import React, { Component } from 'react';
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import NotFound from "./components/layout/NotFound";
import { Provider } from "react-redux";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/Register";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import '../node_modules/font-awesome/css/font-awesome.css';
import '../node_modules/jquery/dist/jquery.min';
import '../node_modules/popper.js/dist/popper';

import User from "./components/pages/Users";
import ChangePassword from "./components/auth/ChangePassword";
import ManageCompanies from "./components/pages/ManageCompanies";
import ManageProperties from "./components/pages/ManageProperties";
import ManageCategory from "./components/pages/ManageCategory";
import ManageInvesterConsultant from "./components/pages/ManageInvesterConsultant";
import ManagePropertiesRequests from "./components/pages/ManagePropertiesRequests";
import ManageBlog from "./components/pages/ManageBlog";

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        window.location.href = "./login";
    }
}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/forgotPassword" component={ForgotPassword} />
                            <Switch>
                                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                                <PrivateRoute exact path="/users" component={User} />
                                <PrivateRoute exact path="/changePassword" component={ChangePassword} />
                                <PrivateRoute exact path="/manageCompanies" component={ManageCompanies} />
                                <PrivateRoute exact path="/manageProperties" component={ManageProperties} />
                                <PrivateRoute exact path="/manageCategory" component={ManageCategory} />
                                <PrivateRoute exact path="/manageInvesterConsultant" component={ManageInvesterConsultant} />
                                <PrivateRoute exact path="/managePropertiesRequests" component={ManagePropertiesRequests} />
                                <PrivateRoute exact path="/manageBlog" component={ManageBlog} />
                            </Switch>
                            <Route exact path="*" component={NotFound} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;

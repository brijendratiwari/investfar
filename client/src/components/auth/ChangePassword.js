import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import icons from "../../../src/icons/loginlogo.jpg";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import loading from "../../../src/icons/loading.gif";
import axios from "axios";

class ChangePassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {},
            pagetitle: 'Change Password'
        };
    }

    componentDidMount() {

    };

    componentWillReceiveProps(nextProps) {

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData);
    };

    handleSubmit = (e) => {
        this.setState({ isLoading: true });
        e.preventDefault();
        const userData = {
            email: this.state.email
        };
        axios.post("/api/forgot_email_password", userData).then(result => {
            if(result.status == 200){
                this.setState({
                    displayMsg: result.data.message
                });
                this.setState({email: ''});
                this.loadingAPI();

                setTimeout(()=>{
                    this.setState({
                        displayMsg: ''
                    });

                },5000);
            }
        })
        .catch(err => {
            this.setState({
                displayMsg:"An Error Occurred While Resetting Password."
            });
            console.error(err);
            this.loadingAPI();
        });
    };

    loadingAPI(){
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 500);
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="">
                <Navbar pagetitle={this.state.pagetitle} />
                <div className="d-flex" id="wrapper">
                    <Sidebar />
                    <div id="page-content-wrapper">
                        <div class="content">
                        <div class="changepassword">
                            <div class="text-center">
                                {this.state.isLoading ? (
                                    <div className="loader"><img src={loading}/></div>
                                ) : (
                                    <div></div>
                                )}
                                <form noValidate onSubmit={this.handleSubmit}>
                                    <div class="row justify-content-center">
                                    <div class="col-lg-2 text-lg-right"><label for="category_name">Change Password</label></div>
                                    <div class="col-lg-4">
                                        <div class="form-group mb-2"> <input
                                            onChange={this.onChange}
                                            value={this.state.email}
                                            error={errors.email}
                                            id="email"
                                            type="email"
                                            className={classnames("form-control", {
                                                invalid: errors.email
                                            })}
                                            placeholder="Email Address"
                                        />
                                        
                                        </div>
                                        <div class="success-msg">{this.state.displayMsg}</div>
<div class="text-left">
                                        <button class="thamebtn">Send</button></div>
                                    </div>
                                     </div>
                                </form>
                            </div>
                            </div>
                        </div>
                    </div>
                </div></div>
        );
    }
}

ChangePassword.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});
export default connect(
    mapStateToProps,
    { loginUser }
)(ChangePassword);
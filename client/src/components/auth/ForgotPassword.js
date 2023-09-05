import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import icons from "../../../src/icons/loginlogo.jpg";
import axios from "axios";
import loading from "../../../src/icons/loading.gif";


class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
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
      
  fieldCheck = () => {
    var errorList = [];
    if (this.state.email == null || this.state.email == "") {
      errorList.push("Email Field is Required;");
    }
    return errorList;
  };
    

    render() {
        const { errors } = this.state;
        return (
            <div className="">
                {/* <div className="row mt-5">
                    <div className="col-md-4 mx-auto mt-5 card shadow-lg">
                        <div className="card-body p-1"> */}
                <section>
                         {this.state.isLoading ? (
                            <div className="loader"><img src={loading}/></div>
                        ) : (
                            <div>
                            </div>
                        )}
                    <div class="loginwrap">
                        <div class="logininner">
                            <div class="loginimg"><img src={icons} /></div>
                            <div class="foamlogin text-center">
                                <div class="success-msg">{this.state.displayMsg}</div>
                                <h2>Forget password</h2>
                                <p>Please entered your registered email address to retrieve Password </p>
                                <form noValidate onSubmit={this.handleSubmit}>
                                    <div class="form-group mleft">
                                    <input
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
                                        <span className="text-danger">{errors.email}</span>
                                    </div>
                                    <div class="loginbtnwrap">

                                        <button type="submit" class=" loginbtn dab add lgnbtn">Send</button>

                                    </div>
                                </form>
                            </div>
                            {/* <div class="foamlogin">
                                <h2 class="text-center">Admin Web Panel</h2>
                                <form>
                                    <div class="form-group">
                                        <input type="text" placeholder="Email Address" class="form-control" name="Email" required />
                                    </div>

                                    <div class="form-group">
                                        <input type="password" placeholder="Password" class="form-control" name="psw" required />
                                    </div>
                                    <div class="text-right"><a href="#">lost password?</a></div>
                                    <div class="text-center"> <button type="submit">Login</button></div>

                                </form>
                            </div> */}
                        </div>
                    </div>
                </section>
                {/* </div></div></div> */}











                {/* 


                <div className="row mt-5">
                    <div className="col-md-4 mx-auto mt-5 card shadow-lg">
                        <div className="card-body p-1">
                            <h2 className="text-center text-primary mt-3">Login</h2>
                            <form noValidate onSubmit={this.onSubmit} className="white">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                    })}
                                />
                                <span className="text-danger">{errors.email}</span>
                                <br />
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password
                                    })}
                                />
                                <span className="text-danger">{errors.password}</span>
                                <p className="text-center pb-0 mt-2">
                                    <button
                                        type="submit"
                                        className="btn btn-large btn-primary mt-2 px-5">
                                        Login
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div> */}



            </div>
        );
    }
}

ForgotPassword.propTypes = {
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
)(ForgotPassword);
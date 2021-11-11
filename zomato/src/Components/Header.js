import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import Server from 'axios';
import { API_URL } from '../Contants';
import FacebookLogin from 'react-facebook-login'
import GoogleLogin from 'react-google-login'
import '../Styles/Header.css';

const CustomStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "450px",
        background: "white",
        zIndex: "999999"
    }
};

Modal.setAppElement("#root");

class Header extends Component {

    constructor() {
        super();
        this.state = {
            BackgroundStyle: "",
            IsLoginModalOpen: false,
            IsSignUpModalOpen: false,
            UserName: "",
            Password: "",
            FirstName: "",
            LastName: "",
            MobileNumber: null,
            User: undefined,
            IsLoggedIn: false,
            LoginError: undefined,
            SignUpError: undefined
        };
    };

    componentDidMount() {
        const InitialPath = this.props.history.location.pathname;
        this.SetHeaderStyle(InitialPath);
        this.props.history.listen((Location, Action) => {
            this.SetHeaderStyle(Location.pathname);
        });
    };

    SetHeaderStyle = (Path) => {
        let Background = "";
        if (Path === "/" || Path === "/Home") {
            Background = "transparent";
        } else {
            Background = 'coloured';
        };

        this.setState({
            BackgroundStyle: Background
        });
    };

    navigate = (Path) => {
        this.props.history.push(Path);
    };

    OpenLoginModal = () => {
        this.setState({
            IsLoginModalOpen: true
        });
    };

    CloseLoginModal = () => {
        this.setState({
            IsLoginModalOpen: false
        });
    };

    LoginHandler = () => {
        const { UserName, Password } = this.state;
        const LoginRequest = {
            UserName: UserName,
            Password: Password
        };

        Server({
            method: "POST",
            url: `${API_URL}/Login`,
            headers: { "Content-Type": "application/json" },
            data: LoginRequest
        }).then(Result => {
            const user = Result.data.User;

            localStorage.setItem("User-Email", JSON.stringify(user.Email));
            localStorage.setItem("User-FirstName", JSON.stringify(user.FirstName));
            localStorage.setItem("User-LastName", JSON.stringify(user.LastName));
            localStorage.setItem("User-MobileNumber", JSON.stringify(user.MobileNumber));
            localStorage.setItem("isLoggedIn", true);

            this.setState({
                User: user,
                IsLoggedIn: true,
                LoginError: undefined,
                IsLoginModalOpen: false
            });

        }).catch(Error => {
            this.setState({
                IsLoggedIn: false,
                LoginError: "UserName or Password Incorrect"
            });
        });

    };

    CancelLoginHandler = () => {
        this.CloseLoginModal();
    };

    OpenSignUpModal = () => {
        this.setState({
            IsSignUpModalOpen: true
        });
    };

    CloseSignUpModal = () => {
        this.setState({
            IsSignUpModalOpen: false
        });
    };

    SignUpHandler = () => {
        const { UserName, Password, FirstName, LastName, MobileNumber } = this.state;
        const SignUpRequest = {
            Email: UserName,
            Password: Password,
            FirstName: FirstName,
            LastName: LastName,
            MobileNumber: MobileNumber
        };

        Server({
            method: "POST",
            url: `${API_URL}/Signup`,
            headers: { "Content-Type": "application/json" },
            data: SignUpRequest
        }).then(Result => {
            const user = Result.data.User;

            localStorage.setItem("User-Email", JSON.stringify(user.Email));
            localStorage.setItem("User-FirstName", JSON.stringify(user.FirstName));
            localStorage.setItem("User-LastName", JSON.stringify(user.LastName));
            localStorage.setItem("User-MobileNumber", JSON.stringify(user.MobileNumber));
            localStorage.setItem("isLoggedIn", true);

            this.setState({
                User: user,
                IsLoggedIn: true,
                SignUpError: undefined,
                IsSignUpModalOpen: false
            });

        }).catch(Error => {
            this.setState({
                IsLoggedIn: false,
                SignUpError: `Error Signing Up ${Error}`
            });
        });
    };

    CancelSignUpHandler = () => {
        this.CloseSignUpModal();
    };

    Logout = () => {
        localStorage.removeItem("User-Email");
        localStorage.removeItem("User-FirstName");
        localStorage.removeItem("User-LastName");
        localStorage.removeItem("User-MobileNumber");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            User: undefined,
            IsLoggedIn: false,
            UserName: '',
            Password: ''
        });
    };

    HandleChange = (Event, Field) => {
        const Value = Event.target.value;

        this.setState({
            [Field]: Value,
            LoginError: undefined,
            SignUpError: undefined
        });
    };

    HandleFaceboookLogin = (Event) => {
        console.log(Event);
    };

    HandleGoogleLogin = (Event) => {
        const FirstName = Event.profileObj.givenName;
        const LastName = Event.profileObj.familyName;
        const Email = Event.profileObj.email;
        const GoogleID = Event.profileObj.googleId;

        const GoogleSignUpRequest = {
            FirstName: FirstName,
            LastName: LastName,
            UserName: Email,
            Password: GoogleID
        };

        console.log(GoogleSignUpRequest);
    };

    render() {

        const { BackgroundStyle, IsLoginModalOpen, IsSignUpModalOpen, UserName, Password, FirstName, LastName, LoginError, SignUpError, IsLoggedIn, User, MobileNumber } = this.state;

        return (
            <React.Fragment>

                <div className="Header" style={{ "background": BackgroundStyle === "transparent" ? "transparent" : "#eb2929" }}>

                    <div className="container">
                        <div className="row">
                            <div className="Logo-Section col-6">
                                {
                                    BackgroundStyle === "transparent"
                                        ?
                                        null
                                        :
                                        <div className="logo-small" onClick={() => this.navigate("/Home")} >e!</div>
                                }
                            </div>
                            <div className="Login-and-Creant-an-account-Options col-6 position-relative">

                                {
                                    IsLoggedIn
                                        ?
                                        <>
                                            <span className="User text-center position-absolute top-0 end-0">{User.LastName}</span>
                                            <button className="Logout text-center position-absolute top-0 end-0" onClick={this.Logout}>Logout</button>
                                        </>
                                        :
                                        <>
                                            <button className="Login-Button text-center position-absolute top-0 end-0" onClick={this.OpenLoginModal}>Login</button>
                                            <button className="Create-an-account-button mx-5 text-center position-absolute top-0 end-0" onClick={this.OpenSignUpModal}>Create an account</button>
                                        </>
                                }

                            </div>
                        </div>
                    </div>

                </div>

                <Modal isOpen={IsLoginModalOpen} style={CustomStyles}>

                    <h2>
                        Login
                        <button onClick={this.CloseLoginModal} className="btn btn-outline-danger float-end">X</button>
                    </h2>

                    <form className="mt-4">
                        {LoginError ? <div className="alert alert-danger text-center"> {LoginError} </div> : null}
                        <input className="form-control" type="text" placeholder="Username or Email" value={UserName} required onChange={(Event) => this.HandleChange(Event, "UserName")} />
                        <input className="form-control my-3" type="password" placeholder="Password" value={Password} required onChange={(Event) => this.HandleChange(Event, "Password")} />


                        <div className="text-center my-3">
                            <input type="button" className="btn btn-primary mx-3" onClick={this.LoginHandler} value="Login" />
                            <button className="btn btn-primary" onClick={this.CancelLoginHandler}>Cancel</button>
                        </div>

                        <div className="mt-4">
                            <FacebookLogin
                                appId="4346450875452933"
                                textButton="Continue With Facebook"
                                autoLoad={false}
                                fields="Email,Name,Picture"
                                callback={this.HandleFaceboookLogin}
                                icon="fa-facebook"
                                cssClass="Facebook-Login-Button"
                            />

                            <GoogleLogin
                                clientId="920438850013-dths23qe0d2opqapg96m8a88kg6aivdj.apps.googleusercontent.com"
                                buttonText="Continue With Google"
                                onSuccess={this.HandleGoogleLogin}
                                onFailure={this.HandleGoogleLogin}
                                cookiePolicy={"single_host_origin"}
                                className="Google-Login-Button"
                            />
                        </div>

                    </form>

                </Modal>

                <Modal isOpen={IsSignUpModalOpen} style={CustomStyles}>

                    <h2>
                        Signup
                        <button onClick={this.CloseSignUpModal} className="btn btn-outline-danger float-end">X</button>
                    </h2>

                    <form className="my-4">
                        {SignUpError ? <div className="alert alert-danger text-center"> {SignUpError} </div> : null}
                        <input className="form-control my-3" type="text" placeholder="First Name" value={FirstName} required onChange={(Event) => this.HandleChange(Event, "FirstName")} />
                        <input className="form-control my-3" type="text" placeholder="Last Name" value={LastName} required onChange={(Event) => this.HandleChange(Event, "LastName")} />
                        <input className="form-control" type="text" placeholder="Username or Email" value={UserName} required onChange={(Event) => this.HandleChange(Event, "UserName")} />
                        <input className="form-control my-3" type="password" placeholder="Password" value={Password} required onChange={(Event) => this.HandleChange(Event, "Password")} />
                        <input className="form-control my-3" type="text" placeholder="Mobile Number" value={MobileNumber} required onChange={(Event) => this.HandleChange(Event, "MobileNumber")} />


                        <div className="text-center my-3">
                            <input type="button" className="btn btn-primary mx-3" onClick={this.SignUpHandler} value="SignUp" />
                            <button className="btn btn-primary" onClick={this.CancelSignUpHandler}>Cancel</button>
                        </div>

                        <div className="mt-4">
                            <FacebookLogin
                                appId="4346450875452933"
                                textButton="Continue With Facebook"
                                autoLoad={false}
                                fields="Email,Name,Picture"
                                callback={this.HandleFaceboookLogin}
                                icon="fa-facebook"
                                cssClass="Facebook-Login-Button"
                            />

                            <GoogleLogin
                                clientId="920438850013-dths23qe0d2opqapg96m8a88kg6aivdj.apps.googleusercontent.com"
                                buttonText="Continue With Google"
                                onSuccess={this.HandleGoogleLogin}
                                onFailure={this.HandleGoogleLogin}
                                cookiePolicy={"single_host_origin"}
                                className="Google-Login-Button"
                            />
                        </div>

                    </form>

                </Modal>

            </React.Fragment>
        )
    };
};

export default withRouter(Header);
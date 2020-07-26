import React, {Component} from 'react'
import AuthManager from '../libs/authentication'
import Link from 'next/link'

export default class NavBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user : {
                name : ''
            },
        };
    }

    componentDidMount() {
        this.auth = new AuthManager(this.loginDone);
    }

    loginDone = (userRes) => {
        console.log(userRes.name);
        this.setState({
            user: {
                name: userRes.name,
            }
        });
    }

    loginRequest = () => {
        this.auth.login();
    }

    logoutRequest = () => {
        this.auth.logout();
        this.setState({
            user: {
                name: '',
            }
        });
    }

    render() {
        const isLoggedIn = this.state.user.name != '';
        let links;
        if (!isLoggedIn) {
            links = <PublicNavLinks loginRequest={this.loginRequest}/>
        }
        else {
            links = <AuthenticatedLinks user={this.state.user} logoutRequest={this.logoutRequest}/>
        }

        return (
            <header className="sticky">
                <div>
                    <nav>
                        <div className="links">
                            <a href="#">
                                <img src="/logo.svg" alt="logo" className="logo"/>
                            </a>
                            {links}
                        </div>
                    </nav>
                </div>
                <style jsx>
                        {`
                            header {
                                width: 100%;
                                border-bottom: 1px solid #eaeaea;
                                font-size: 1rem;
                                background-color: #fff;
                            }

                            .sticky {
                                position: sticky;
                                top: 0;
                            }

                            header div {
                                margin: 0 auto;
                                max-width: 1024px;
                            }

                            nav {
                                height: 80px;
                                display: flex;
                                align-items: center;
                            }
                            
                            .links {
                                display: flex;
                                flex-grow: 1;
                                align-items: center;
                                justify-content: space-between;
                            }

                            .links :global(a) {
                                text-decoration: none #696969;
                                color: #696969;
                                transition: color 0.2s ease 0s;
                            }

                            .links :global(a:hover) {
                                color: #000;
                            }

                            .logo {
                                height: 50px;
                            }

                            .links :global(.username) {
                                margin: 0 1rem;
                            }
                        `}
                        </style>
            </header>
        );
    }
}

function PublicNavLinks(props) {
    return (
        <>
        <a href="#" onClick={props.loginRequest}>Login</a>
        </>
    );
}

function AuthenticatedLinks(props) {
    return (
        <>
        <Link href="/admin">
            <a>Admin</a>
        </Link>    
        <div>
            <span className="username">Welcome {props.user.name}</span>
            <a href="#" onClick={props.logoutRequest}>Logout</a>
        </div>
        </>
    );
}
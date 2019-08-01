import React from 'react';
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { Async } from './async';
import Login from '../templates/login';

export const getSession = () => {
    const jwt = Cookies.get('__ds_cookie_control')
    let session
    try {
        if (jwt) {
            const base64Url = jwt.split('.')[1]
            const base64 = base64Url.replace('-', '+').replace('_', '/')
            session = JSON.parse(window.atob(base64))
        }
    } catch (error) {
        console.log('[getSession]', error)
        return session
    }
    return session
}

export const publicPath = [
    '/login'
]

const ManagerRoute = props => {
    const { location } = props
    return (
        getSession() && publicPath.indexOf(location.pathname) === -1 ?
            <Route {...props} /> :
            <div>Anda belum masuk, Silakan <Link to="/login">klik disini</Link> untuk masuk</div>
    )
}

class Router extends React.PureComponent {
    render() {
        const { location } = this.props
        return (
            // <TransitionGroup>
            //     <CSSTransition key={location.pathname} classNames="bounce" timeout={500}>
            //         <div className="ds-container-style">
                        <Switch location={location}>
                            <Route path="/login" component={Login} />
                            <ManagerRoute exact path={`/:module?/:type?/:id?`} render={props => <Async key={location.pathname} param={props} />} />
                        </Switch>
            //         </div>
            //     </CSSTransition>
            // </TransitionGroup>
        )
    }
}

export default withRouter(Router)
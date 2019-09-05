import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import Router, { getSession } from './components/router';
import Topbar from './components/topbar';
import Generalbar from './components/generalbar';
import Sidebar from './components/sidebar';
import global from './stores/globalstore';
import { login } from './templates/login';
import { socket } from './components/xhr';
import { toast } from './components/myparts';

class Body extends PureComponent {

    componentWillMount() {
        if (getSession()) {
            login._checkSession().then(() => {
                login._getMenuByToken()
                socket.on('privilege updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._getMenuByToken()
                })
                socket.on('user updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._checkSession().then(() => login._getMenuByToken())
                })
                socket.on('client updated', msg => {
                    if (global.cookie.user !== msg.itId) {
                        toast.show({ message: msg.message, intent: 'warning', icon: 'automatic-updates' })
                    }
                    login._checkSession()
                })  
            })
        } else {
            this.props.history.replace("/login")
        }

        


    }

    componentWillUnmount() {
        socket.removeAllListeners()
    }

    render() {
        return (
            <>
                {Cookies.get("__dys_cookie_control") ? <Topbar /> : <Generalbar />}
                <div className="wrapInline">
                    {Cookies.get("__dys_cookie_control") &&
                        <div id="wrapper" className={`wrapSidebar ${window.innerWidth > 768 && "wrapper-active"}`}>
                            <Sidebar />
                        </div>
                    }
                    <div className="wrapRouter">
                        <Router />
                    </div>
                </div>
            </>
        )
    }
}

export default withRouter(Body)
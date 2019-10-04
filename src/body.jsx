import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';

import Router, { getSession } from './components/router';
import { socket } from './components/xhr';
import Topbar from './components/topbar';
import Generalbar from './components/generalbar';
import Sidebar from './components/sidebar';
import { login } from './templates/login';

class Body extends PureComponent {

    componentWillMount() {
        if (getSession()) {                        
            login._checkSession().then(() => {
                login._getMenuByToken().then(() => {
                    login._getNotification()
                    login._getNotificationPrivilegeById()
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
                        <div id="wrapper" className={`wrapSidebar print-off ${window.innerWidth > 768 && "wrapper-active"}`}>
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
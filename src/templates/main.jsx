import React, { PureComponent } from 'react';
import { Observer } from 'mobx-react';

import global from '../stores/globalstore';

class Dashboard extends PureComponent {

    componentDidMount() {
        document.title = `Selamat Datang | ${global.appname}`
    }

    render() {
        return (
            <div className="clover-container">
                Hallo, <Observer>{() => global.control.userFullname}</Observer> !
            </div>
        );
    }
}

export default Dashboard
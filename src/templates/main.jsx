import React, { PureComponent } from 'react';

import global from '../stores/globalstore';

class Dashboard extends PureComponent {
    
    componentDidMount() {
        document.title = `Selamat Datang | ${global.appname}`
    }

    render() {
        return (
            <div className="ds-container">
                Hallo, {global.control.fullname} !
            </div>
        );
    }
}

export default Dashboard
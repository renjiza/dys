import React, { PureComponent } from 'react';
import { Navbar, NavbarGroup, NavbarHeading, Button, Icon, Popover, Menu, MenuItem, MenuDivider, NavbarDivider, Tooltip, Card, Colors, Label } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react-lite';

import global from '../stores/globalstore';
import { login } from '../templates/login';
import { Link } from 'react-router-dom';
import history from './history';
import moment from 'moment';


const Header = observer(() => (
    <Tooltip content="Kembali ke dashboard" position="bottom-right" usePortal={false}>
        <Link to="/">
            <NavbarHeading className="bold heading">
                <Observer>{() => global.control.clientName}</Observer>
            </NavbarHeading>
        </Link>
    </Tooltip>
))

const UserContext = () => {
    const logout = () => {
        login._logout()
    }

    const preference = () => {
        history.replace('/preference')
    }
    return (
        <Menu>
            <MenuItem onClick={() => preference()} icon="cog" text="Preferensi" />
            <MenuDivider />
            <MenuItem onClick={logout} icon="log-out" text="Keluar" />
        </Menu>
    )
}

const UserButton = () => (
    <Popover content={<UserContext />} position="bottom-right" usePortal={false}>
        <Observer>{() =>
            <Button minimal icon="user" text={global.control.userEmail} className="btnUserTopBar" />
        }</Observer>
    </Popover>
)

const NotificationContext = () => {
    return (
        <Menu className="notificationContext">
            <Observer>{() => global.notification.length > 0 ? global.notification.map((o, i) => (
                <Card key={i} onClick={() => {
                    if (o.notificationLink) {
                        global.notificationPopoverOpen = false
                        history.replace(o.notificationLink)
                    }                    
                    return true
                }} 
                interactive={true} 
                className="notificationCard"
                >
                    <Label className="bold">
                        {o.notificationIcon && <Icon icon={o.notificationIcon} />} {o.notificationTitle}
                    </Label>
                    <p>{o.notificationContent}</p>
                    <footer>
                        <span className="datetime">{moment(o.notificationDatetime).format('DD MMM YYYY HH:mm')}</span>
                    </footer>
                </Card>
            ))
            :
                <Card style={{ border: 0, boxShadow: 'none', padding: 1, color: Colors.GRAY3, textAlign: 'center' }}>
                <h5>
                    <Icon icon="notifications-updated" /> &nbsp;Tidak ada pemberitahuan
                </h5>
            </Card>
            }</Observer>
        </Menu>
    )
}

const NotificationButton = () => (
    <Observer>{() =>
        <Popover             
            minimal 
            content={<NotificationContext />} 
            position="bottom-right" 
            usePortal={false}
        >
                <div className="notification">
                    <Button 
                        minimal 
                        icon="notifications" 
                        className="btnUserTopBar" 
                    />
                    {global.notification.length > 0 && <span className="badge">{global.notification.length}</span>}
                </div>
        </Popover>
    }</Observer>
)

export default class Topbar extends PureComponent {
    toggleShowMenu() {
        const btn = document.getElementById('wrapper')
        btn.classList.toggle('wrapper-active')
    }

    render() {
        return (
            <Navbar className="bprimary3 print-off">
                <NavbarGroup align="left">
                    <Button minimal onClick={this.toggleShowMenu}>
                        <Icon icon="menu" />
                    </Button>
                    <Observer>{() => 
                        global.control.super === 1 &&
                        <>
                        <NavbarDivider />
                        <Tooltip content="Konfigurasi Perusahaan">
                            <Link to="/config">
                                <Button minimal icon="office" />
                            </Link>
                        </Tooltip>
                        </>
                    }</Observer>                    
                    <NavbarDivider />
                    <Header />
                </NavbarGroup>
                <NavbarGroup align="right">
                    <NotificationButton />                 
                    <NavbarDivider />
                    <UserButton />
                </NavbarGroup>
            </Navbar>
        )
    }
}
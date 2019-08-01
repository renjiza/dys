import React, { PureComponent } from 'react';
import { Navbar, NavbarGroup, NavbarHeading, Button, Icon, Colors, Popover, Menu, MenuItem, MenuDivider, NavbarDivider, Tooltip } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react-lite';

import global from '../stores/globalstore';
import { Link } from 'react-router-dom';


const Header = observer(() => (
    <Tooltip content="Kembali ke halaman awal" position="bottom" usePortal={false}>
        <Link to="/">
            <NavbarHeading className="bold" style={{ color: Colors.INDIGO3 }}>{global.control.branchname}</NavbarHeading>
        </Link>
    </Tooltip>
))

const UserContext = () => {
    const logout = () => {
        global._logout()
    }
    return (
        <Menu>
            <MenuItem icon="cog" text="Pengaturan" />
            <MenuDivider />
            <MenuItem onClick={logout} icon="log-out" text="Keluar" />
        </Menu>
    )
}

const UserButton = () => (
    <Popover content={<UserContext />} position="bottom-right" usePortal={false}>
        <Observer>{() =>
            <Button minimal intent="primary" icon="user" text={global.control.email} />
        }</Observer>
    </Popover>
)

export default class Topbar extends PureComponent {
    toggleShowMenu() {
        const btn = document.getElementById('wrapper')
        btn.classList.toggle('wrapper-active')
    }

    render() {
        return (
            <Navbar>
                <NavbarGroup align="left">
                    <Button minimal intent="primary" onClick={this.toggleShowMenu}>
                        <Icon icon="menu" />
                    </Button>
                    <NavbarDivider />
                    <Header />
                </NavbarGroup>
                <NavbarGroup align="right">
                    <UserButton />
                </NavbarGroup>
            </Navbar>
        )
    }
}
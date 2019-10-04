import React, { PureComponent } from 'react';
import { Navbar, NavbarHeading, NavbarGroup, Tooltip, AnchorButton, Icon } from '@blueprintjs/core';
import global from '../stores/globalstore';

export default class Generalbar extends PureComponent {

    componentDidMount() {
        document.title = global.appname
    }

    render() {
        return (
            <Navbar className="bprimary3">
                <NavbarGroup align="left">
                    <NavbarHeading className="bold">{global.appname}</NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align="right">
                    <Tooltip content={`kunjungi website`} position="right" usePortal={false}>
                        <AnchorButton href="" minimal={true}>
                            <Icon icon="globe-network" />
                        </AnchorButton>
                    </Tooltip>
                </NavbarGroup>
            </Navbar>
        )
    }
}
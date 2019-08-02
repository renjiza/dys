import React, { PureComponent } from 'react';
import { Navbar, NavbarHeading, NavbarGroup, Tooltip, Colors, AnchorButton, Icon } from '@blueprintjs/core';

export default class Generalbar extends PureComponent {

    componentDidMount() {
        document.title = "DYS Resources"
    }

    render() {
        return (
            <Navbar>
                <NavbarGroup align="left">
                    <NavbarHeading className="bold" style={{ color: Colors.INDIGO3 }}>DYS Resources</NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align="right">
                    <Tooltip content={`kunjungi website`} position="right" usePortal={false}>
                        <AnchorButton href="" minimal={true} intent="primary">
                            <Icon icon="globe-network" />
                        </AnchorButton>
                    </Tooltip>
                </NavbarGroup>
            </Navbar>
        )
    }
}
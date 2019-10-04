import React from 'react';
import { Card, Menu, MenuItem, Icon } from '@blueprintjs/core';
import { observer } from 'mobx-react';

import global from '../stores/globalstore';
import history from './history';

const Sidebar = observer(() => {
    const parent = global.menu.filter(o => o.menuParentId === 0)
    const children = global.menu.filter(o => o.menuParentId > 0 && o.menuAction === 'view')
    return (
        <Card className="sidebar">
            <Menu>
                {parent.map(p => (
                    children.filter(o => o.menuParentId === p.menuId).length > 0 
                    && 
                    <MenuItem key={p.menuId} text={p.menuLabel} icon={<Icon icon={p.menuIcon} color="#99D79C" />} popoverProps={{
                        hoverCloseDelay: 300,
                        captureDismiss: true,
                    }}>
                        {children.filter(o => o.menuParentId === p.menuId).map(c => (
                            <MenuItem 
                                key={c.menuId} 
                                onClick={() => {
                                    const btn = document.getElementById('wrapper')
                                    btn.classList.toggle('wrapper-active')
                                    history.replace(`${c.menuLink}/view`)
                                }} 
                                text={c.menuLabel} 
                                icon={<Icon icon={c.menuIcon} color="#99D79C" />} 
                            />
                        ))}
                    </MenuItem>                
                ))}
            </Menu>
        </Card>
    )
})

export default Sidebar
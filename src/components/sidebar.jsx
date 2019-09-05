import React from 'react';
import { Card, Menu, MenuItem, PopoverInteractionKind } from '@blueprintjs/core';
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
                    <MenuItem key={p.menuId} text={p.menuLabel} icon={p.menuIcon} popoverProps={{
                        hoverCloseDelay: 300,
                        captureDismiss: true,
                    }}>
                        {children.filter(o => o.menuParentId === p.menuId).map(c => (
                            <MenuItem key={c.menuId} onClick={() => history.replace(`${c.menuLink}/view`)} text={c.menuLabel} icon={c.menuIcon} />
                        ))}
                    </MenuItem>                
                ))}
            </Menu>
        </Card>
    )
})

export default Sidebar
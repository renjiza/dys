import React from 'react';
import { Card, Menu, MenuItem } from '@blueprintjs/core';
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
                    children.length > 0 
                    && 
                    <MenuItem key={p.menuId} text={p.menuLabel} icon={p.menuIcon}>
                        {children.map(c => (
                            <MenuItem key={c.menuId} onClick={() => history.replace(`${c.menuLink}/view`)} text={c.menuLabel} icon={c.menuIcon} />
                        ))}
                    </MenuItem>                
                ))}
            </Menu>
        </Card>
    )
})

export default Sidebar
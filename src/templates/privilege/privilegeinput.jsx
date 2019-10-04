import React, { PureComponent } from 'react';
import { Colors, Button, Label, Card, Checkbox, Icon, H5, Tooltip } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { privilege } from './privilegeview';
import history from '../../components/history';
import global from '../../stores/globalstore';


const styleCardPriv = {
    overflowY: 'auto',
    height: 215,
}

const styleLabelPriv = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    color: Colors.GRAY2,
}

class AksesUserInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        document.title = `Ubah ${privilege.title} | ${global.appname}`
        privilege._getMenu().then(res => {
            if (res.error === null) {
                privilege.store.menu = res.response
                privilege._getById(path[3]).then(() => {
                    let raw = {}
                    res.response.map(o => raw[o.menuId] = privilege.input.privilegeArrayMenuId.indexOf(o.menuId) !== -1)
                    privilege.store.raw = raw                    
                })
            }
        })
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'privilege').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"        

        return (
            menu.indexOf(path[2]) !== -1 ?
            <div className="clover-paper">
                <div className="clover-container">
                    <HeaderView 
                        title={`${isAdd ? "Tambah" : "Ubah"} ${privilege.title}`} 
                        btnTooltip={`Kembali ke ${privilege.title}`} 
                        btnIcon="delete" 
                        color={Colors.RED3}
                        intent="danger"
                        btnShow={true}
                        btnLink={isAdd ? `view` : `../view`} 
                    />

                    <form className="form">
                        <div className="grid">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <Label>Email : </Label>
                                <Label className="bold">{privilege.input.userEmail}</Label>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                <Label>Nama Lengkap : </Label>
                                <Label className="bold">{privilege.input.userFullname}</Label>
                            </div>
                        </div>                         
                        <Observer>{() =>
                            privilege.store.menu.filter(p => p.menuParentId === 0).map(parent => (
                                <div key={parent.menuId} className="grid paddingVertical">
                                    <div className="col-12 wrapHeader">
                                        <H5 className="bold" style={styleLabelPriv}>
                                            <Icon icon={parent.menuIcon} /> &nbsp; {parent.menuLabel}
                                        </H5>
                                    </div>
                                    {privilege.store.menu.filter(c => c.menuParentId === parent.menuId && c.menuAction === 'view').map(child => (                                            
                                        <div key={child.menuId} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">                                
                                            <CardGroupMenu privilege={privilege} child={child} />
                                        </div>
                                    ))}
                                    </div>
                                )
                            )
                        }</Observer>
                        <div className="grid">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <Observer>{() =>
                                    <Button 
                                        loading={privilege.loading}
                                        icon="floppy-disk" 
                                        intent={isAdd ? "success" : "warning"} 
                                        text={isAdd ? "Tambah" : "Perbarui"} 
                                        onClick={() => isAdd ? privilege._create() : privilege._update()}
                                    />
                                }</Observer>
                            </div>
                        </div>
                    </form>
                </div> 
            </div> 
            :
            <PageUnauthorized />
        )
    }
}

export default observer(AksesUserInput)

const CardGroupMenu = observer(({privilege, child}) => (
    <Card className="border" style={styleCardPriv}>
        <div className="text-right">
            <Tooltip content={`${!privilege.store.raw[child.menuId] ? 'C' : 'Unc'}heck semua akses ${child.menuLabel}`} className="text-right" usePortal={false}>
                <Label onClick={() => privilege._toggleCheckMenuByGroup(child.menuKey)} className="bold text-right pointer" style={styleLabelPriv}>
                    <Icon icon={child.menuIcon} intent="primary" /> &nbsp; {child.menuLabel}
                </Label>
            </Tooltip>
        </div>
        {privilege.store.raw &&
            privilege.store.menu.filter(x => x.menuKey === child.menuKey).length > 0 && privilege.store.menu.filter(x => x.menuKey === child.menuKey).map(part => (
                <Observer key={part.menuId}>{() =>
                    <Checkbox checked={privilege.store.raw[part.menuId] || false} onChange={() => privilege.store.raw[part.menuId] = !privilege.store.raw[part.menuId]} label={part.menuAction} />
                }</Observer>
            ))}
    </Card>
))
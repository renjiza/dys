import React, { PureComponent } from 'react';
import { Colors, Button, H5, Label, Card, Icon, Tooltip } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';
import { observable } from 'mobx';

import global from '../../stores/globalstore';
import { get, put } from '../../components/xhr';
import { toastSuccess, toastError, toastCatch } from '../../components/myparts';
import { login } from '../login';

const styleCardPriv = {
    overflowY: 'auto',
    height: 190,
}

const styleLabelPriv = {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    color: Colors.GRAY2,
}

export const preference = observable({
    title: "Preferensi",
    loading: false,
    input: {},
    async _getUser() {
        return get(`user/${global.cookie.user}`, {})
            .then(res => {
                res.response.userNotificationPrivilege = JSON.parse(res.response.userNotificationPrivilege)
                preference.input = res.response
            })
    },
    store: {
        raw: {},
        menu: [],
    },
    async _update() {
        preference.loading = true
        preference.input.userNotificationPrivilege = JSON.stringify(Object.entries(preference.store.raw).map(([key, value]) => value && parseFloat(key)).filter(x => x !== false))
        return put(`preference`, preference.input)
            .then(res => {
                preference.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    login._getNotificationPrivilegeById()
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                preference.loading = false
            })
    },
    async _getMenu() {
        return get('getMenu', {}).then(res => {
            preference.store.menu = res.response
            preference._getUser().then(() => {
                let raw = {}
                res.response.map(o => raw[o.menuId] = preference.input.userNotificationPrivilege.indexOf(o.menuId) !== -1)
                preference.store.raw = raw
            })
        })
    },
    async _toggleCheckMenuByGroup(menuKey) {
        const menu = preference.store.menu.filter(o => o.menuKey === menuKey && o.menuAction !== 'view')
        const menuFirst = preference.store.raw[menu[0].menuId]
        menu.map(o => preference.store.raw[o.menuId] = !menuFirst)
    }
})

class Preference extends PureComponent {

    componentDidMount() {
        document.title = `Preferensi | ${global.appname}`             
        preference._getMenu()
    }

    render() {        

        return (
            <div className="clover-paper">
                <div className="clover-container">
                    <div className="wrapHeader">
                        <H5 className="primary3" style={{ fontWeight: 600 }}>{preference.title}</H5>
                    </div>

                    <div className="field" style={{ overflowY: 'auto', maxHeight: 'calc(100% - 34px)' }}>
                        <Label className="bold text-center primray3">Pengaturan Notifikasi</Label>
                        <form>      
                            
                            <Observer>{() =>
                                preference.store.menu && preference.store.menu.filter(p => p.menuParentId === 0 && p.menuId !== 1).map(parent => (
                                    <div key={parent.menuId} className="grid paddingVertical">
                                        <div className="col-12 wrapHeader">
                                            <H5 className="bold" style={styleLabelPriv}>
                                                <Icon icon={parent.menuIcon} /> &nbsp; {parent.menuLabel}
                                            </H5>
                                        </div>
                                        {preference.store.menu.filter(c => c.menuParentId === parent.menuId && c.menuAction === 'view').map(child => (
                                            <div key={child.menuId} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                <CardGroupMenu preference={preference} child={child} />
                                            </div>
                                        ))}
                                    </div>
                                )
                                )
                            }</Observer>

                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                    <Observer>{() =>
                                        <Button
                                            loading={preference.loading}
                                            icon="floppy-disk"
                                            intent="warning"
                                            text="Perbarui preferensi"
                                            onClick={() => preference._update()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

export default observer(Preference)


const CardGroupMenu = observer(({ preference, child }) => (
    <Card className="border" style={styleCardPriv}>
        <div className="text-right">            
            <Tooltip content={`${!preference.store.raw[child.menuId] ? 'C' : 'Unc'}heck semua notifikasi ${child.menuLabel}`} className="text-right" usePortal={false}>                
                <Label onClick={() => preference._toggleCheckMenuByGroup(child.menuKey)} className="bold text-right pointer" style={styleLabelPriv}>
                    <Icon icon={child.menuIcon} intent="primary" /> &nbsp; {child.menuLabel}
                </Label>
            </Tooltip>
        </div>
        {preference.store.raw &&
            preference.store.menu.filter(x => x.menuKey === child.menuKey && x.menuAction !== 'view').length > 0 && preference.store.menu.filter(x => x.menuKey === child.menuKey && x.menuAction !== 'view').map(part => (
                <Observer key={part.menuId}>{() =>
                    <Label onClick={() => preference.store.raw[part.menuId] = !preference.store.raw[part.menuId]} className="pointer" style={{ color: (preference.store.raw[part.menuId] ? Colors.FOREST3 : Colors.RED3)}}>
                        <Icon 
                            icon={preference.store.raw[part.menuId] ? 'notifications-updated' : 'notifications'} 
                            color={preference.store.raw[part.menuId] ? Colors.FOREST3 : Colors.RED3} 
                        /> &nbsp;{
                            part.menuAction === 'add' ? 'dibuat' :
                                part.menuAction === 'edit' ? 'diubah' :
                                    part.menuAction === 'delete' ? 'dihapus' : 'belum didefinisikan'
                        }
                    </Label>
                }</Observer>
            ))}
    </Card>
))
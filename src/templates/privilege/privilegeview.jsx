import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastCatch, toastSuccess, toastError } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';
import { login } from '../login';


export const privilege = observable({
    title: "Akses User",
    head: [
        {
            label: 'Email', column: 'userEmail', action: () => {
                if (privilege.query.order !== "userEmail") {
                    privilege.query.order = "userEmail"
                    privilege.query.orderLabel = "Email"
                    privilege._getAll()
                }
            }
        },
        {
            label: 'Nama Lengkap', column: 'userFullname', action: () => {
                if (privilege.query.order !== "userFullname") {
                    privilege.query.order = "userFullname"
                    privilege.query.orderLabel = "Nama Lengkap"
                    privilege._getAll()
                }
            }
        },
    ],
    privilege: [
        {
            label: 'Ubah',
            key: 'privilege',
            act: 'edit',
            icon: 'edit',
            action: o => history.replace(`edit/${o[privilege.id]}`)
        },
    ],
    query: {
        column: `privilegeUserId, 
            userEmail, 
            userFullname, 
            privilegeArrayMenuId`,
        filter: '',
        order: 'userFullname',
        orderLabel: 'Nama Lengkap',
        sort: 'asc',
    },
    body: [],
    id: 'privilegeUserId',
    label: 'userFullname',
    loading: false,
    inputOld: {},
    input: {},
    store: {
        raw: {},
        menu: [],
    },
    async _getAll() {
        return get('privilege', privilege.query)
            .then(res => {
                if (res.error === null) {
                    privilege.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`privilege/${id}`, {})
            .then(res => {
                res.response.privilegeArrayMenuId = JSON.parse(res.response.privilegeArrayMenuId)
                privilege.input = res.response
                privilege.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _update() {
        privilege.input.logDetail = JSON.stringify(global.getDifference(privilege.input, privilege.inputOld))
        privilege.input.privilegeArrayMenuId = JSON.stringify(Object.entries(privilege.store.raw).map(([key, value]) => value && parseFloat(key)).filter(x => x !== false))
        privilege.loading = true
        return put('privilege', privilege.input)
            .then(res => {
                privilege.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    if (global.cookie.user === privilege.input.userId) {
                        login._getMenuByToken()
                    }
                    privilege.input = {}
                    privilege.store.raw = {}
                    history.replace('/privilege/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                privilege.loading = false
            })
    },
    async _getMenu() {
        return get('getMenu', {})
    },
    async _toggleCheckMenuByGroup(menuKey) {
        const menu = privilege.store.menu.filter(o => o.menuKey === menuKey)
        const menuFirst = privilege.store.raw[menu[0].menuId]
        menu.map(o => privilege.store.raw[o.menuId] = !menuFirst)
    }
})


class AksesUserView extends PureComponent {

    componentDidMount() {
        document.title = `${privilege.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'privilege')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={privilege.title}
                            btnTooltip={`Tambah ${privilege.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={privilege} />
                        <TableView params={privilege} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(AksesUserView)
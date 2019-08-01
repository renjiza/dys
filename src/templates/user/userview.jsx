import React, { PureComponent } from 'react';
import { Colors } from '@blueprintjs/core';
import { observable } from 'mobx';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, toast, ToolView } from '../../components/mainview';
import history from '../../components/history';
import global from '../../stores/globalstore';
import { PageUnauthorized } from '../../components/async';
import { Observer } from 'mobx-react';


export const user = observable({
    head: [
        { label: 'Email', column: 'userEmail' },
        { label: 'Nama Lengkap', column: 'userFullname' },
        { label: 'Status Aktif', column: 'userActive', render: o => o === 1 ? 'Aktif' : 'Non-aktif' },
    ],
    order: [
        { label: 'Email', column: 'userEmail', action: () => { 
            if (user.query.order !== "userEmail") {
                user.query.order = "userEmail" 
                user.query.orderLabel = "Email"
                user._getAll()
            }
        }},
        { label: 'Nama Lengkap', column: 'userFullname', action: () => { 
            if (user.query.order !== "userEmail") {
                user.query.order = "userFullname"
                user.query.orderLabel = "Nama Lengkap"
                user._getAll()
            }
        }},
    ],
    access: [],
    privilege: [
        { label: 'Ubah', key: 'edit', icon: 'edit', action: o => history.replace(`/user/edit/${o.userId}`) },
        { label: 'Hapus', key: 'delete', icon: 'trash', action: o => o.isShowConfirm = true },
    ],
    query: {
        filter: '',
        order: 'userFullname',
        orderLabel: 'Nama Lengkap',
        sort: 'asc',
    },
    menu: global.getMenuInfo('/user'),
    body: [],
    id: 'userId',
    label: 'userEmail',
    input: {
        userFullname: '',
        userEmail: '',
        userPassword: '',
        userActive: 0,
    },
    async _callPrivilege() {
        get('getPrivilege', { link: '/user' })
        .then(res => {
            user.access = res.response.map(o => o.menuAction)
        })
    },
    async _getAll() {
        get('user', user.query)
        .then(res => {
            if (res.error === null && res.response !== null) {
                user.body = res.response
            }
        })
    },
    async _getById(id) {
        get(`user/${id}`, { q: JSON.stringify({ column: 'userId AS id, userEmail, userFullname, userActive' }) })
        .then(res => {
            user.input = res.response
        })
    },
    async _create() {
        user.input.logDetail = JSON.stringify(user.input)
        post('user', user.input)
        .then(res => {
            if (res.error === null && res.response !== null) {
                user.input = {
                    userFullname: '',
                    userEmail: '',
                    userPassword: '',
                    userActive: 0,
                }
                toast.show({ message: res.response, intent: 'success', icon: 'tick-circle' })
            } else {
                toast.show({ message: 'Terdapat kesalahan, silakan hubungi pihak developer.', intent: 'warning', icon: 'warning-sign' })
            }
        })
    },
    async _update() {
        put('user', user.input)
        .then(res => {
            if (res.error === null && res.response !== null) {
                user.input = {
                    userFullname: '',
                    userEmail: '',
                    userPassword: '',
                    userActive: 0,
                }
                toast.show({ message: res.response, intent: 'success', icon: 'tick-circle' })
                history.replace('/user/view')
            } else {
                toast.show({ message: 'Terdapat kesalahan, silakan hubungi pihak developer.', intent: 'warning', icon: 'warning-sign' })
            }
        })
    },
    async _delete(id, info) {
        del(`user/${id}`, { info: info })
        .then(res => {
            if (res.error === null && res.response !== null) {
                user._getAll()
                toast.show({ message: res.response, intent: 'success', icon: 'tick-circle' })
            } else {
                toast.show({ message: 'Terdapat kesalahan, silakan hubungi pihak developer.', intent: 'warning', icon: 'warning-sign' })
            }
        })
    }
})


export default class UserView extends PureComponent {

    componentDidMount() {
        document.title = user.menu.menuLabel                
        user._callPrivilege()
    }
    
    
    render() {
        return (
            <Observer>{() =>
                user.access.indexOf('view') !== -1 ?
                <div className = "ds-container" >
                    <HeaderView
                        title={`List ${user.menu.menuLabel}`}
                        btnTooltip={`Tambah ${user.menu.menuLabel}`}
                        btnIcon="add"
                        color={Colors.FOREST3}
                        intent="success"
                        btnShow={user.access.indexOf('add') !== -1}                        
                        btnLink={`${user.menu.menuLink}/add`}
                    />
                    <ToolView params={user} />
                    <TableView params={user} />            
                </div>
                :
                <PageUnauthorized />
            }</Observer>
        )
    }
}
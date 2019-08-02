import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, toast, ToolView } from '../../components/mainview';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const user = observable({
    title: "User",
    head: [
        { label: 'Email', column: 'userEmail' },
        { label: 'Nama Lengkap', column: 'userFullname' },
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
            if (user.query.order !== "userFullname") {
                user.query.order = "userFullname"
                user.query.orderLabel = "Nama Lengkap"
                user._getAll()
            }
        }},
    ],
    privilege: [
        { label: 'Ubah', key: 'edit', icon: 'edit', action: o => history.replace(`edit/${o.userId}`) },
        { label: 'Hapus', key: 'delete', icon: 'trash', action: o => o.isShowConfirm = true },
    ],
    query: {
        filter: '',
        order: 'userFullname',
        orderLabel: 'Nama Lengkap',
        sort: 'asc',
    },
    body: [],
    id: 'userId',
    label: 'userFullname',
    inputOld: {},
    input: {
        userFullname: '',
        userEmail: '',
        userPassword: '',
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
        get(`user/${id}`, { q: JSON.stringify({ column: 'userId AS id, userEmail, userFullname, userPassword' }) })
        .then(res => {
            user.input = res.response
            user.inputOld = res.response
        })
    },
    async _create() {
        const logDetail = JSON.stringify(user.input)
        user.input.logDetail = logDetail
        post('user', user.input)
        .then(res => {
            if (res.error === null && res.response !== null) {
                user.input = {
                    userFullname: '',
                    userEmail: '',
                    userPassword: '',
                }
                toast.show({ message: res.response, intent: 'success', icon: 'tick-circle' })
            } else {
                toast.show({ message: 'Terdapat kesalahan, silakan hubungi pihak developer.', intent: 'warning', icon: 'warning-sign' })
            }
        })
    },
    async _update() {
        const logDetail = global.takeDiff(user.input, user.inputOld)
        user.input.logDetail = logDetail
        put('user', user.input)
        .then(res => {
            if (res.error === null && res.response !== null) {
                user.input = {
                    userFullname: '',
                    userEmail: '',
                    userPassword: '',
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


class UserView extends PureComponent {

    componentDidMount() {
        document.title = `${user.title} | ${global.appname}`        
    }    
    
    render() {
        const menu = global.menu.filter(o => o.menuLink === '/user').map(o => o.menuAction)

        return (
            menu.indexOf('view') !== -1 ?
            <div className="ds-container">
                <HeaderView
                    title={user.title}
                    btnTooltip={`Tambah ${user.title}`}
                    btnIcon="add"
                    intent="success"
                    btnShow={menu.indexOf('add') !== -1}
                    btnLink="add"
                />
                <ToolView params={user} />
                <TableView params={user} access={menu} />            
            </div>
            :
            <PageUnauthorized />
        )
    }
}

export default observer(UserView)
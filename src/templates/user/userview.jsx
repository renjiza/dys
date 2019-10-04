import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastSuccess, toastError, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const user = observable({
    title: "User",
    head: [
        {
            label: 'Email', column: 'userEmail', action: () => {
                if (user.query.order !== "userEmail") {
                    user.query.order = "userEmail"
                    user.query.orderLabel = "Email"
                    user._getAll()
                }
            }
        },
        {
            label: 'Nama Lengkap', column: 'userFullname', action: () => {
                if (user.query.order !== "userFullname") {
                    user.query.order = "userFullname"
                    user.query.orderLabel = "Nama Lengkap"
                    user._getAll()
                }
            }
        },
    ],
    privilege: [
        {
            label: 'Ubah',
            key: 'user',
            act: 'edit',
            icon: 'edit',
            action: o => history.replace(`edit/${o[[user.id]]}`)
        },
        {
            label: 'Hapus',
            key: 'user',
            act: 'delete',
            icon: 'trash',
            action: o => o.isShowConfirm = true
        },
        {
            label: 'Atur akses user',
            key: 'privilege',
            act: 'edit',
            icon: 'confirm',
            action: o => history.replace(`/privilege/edit/${o.userId}`)
        },
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
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('user', user.query)
            .then(res => {
                if (res.error === null) {
                    user.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`user/${id}`, {})
            .then(res => {
                user.input = res.response
                user.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        user.input.logDetail = JSON.stringify(user.input)
        user.loading = true
        return post('user', user.input)
            .then(res => {
                user.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    user.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                user.loading = false
            })
    },
    async _update() {
        user.input.logDetail = JSON.stringify(global.getDifference(user.input, user.inputOld))
        user.loading = true
        return put('user', user.input)
            .then(res => {
                user.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    user.input = {}
                    history.replace('/user/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                user.loading = false
            })
    },
    async _delete(id, info) {
        return del(`user/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    user._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class UserView extends PureComponent {

    componentDidMount() {
        document.title = `${user.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'user' || o.menuKey === 'privilege')
        const currentAcc = acc.filter(o => o.menuKey === 'user').map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={user.title}
                            btnTooltip={`Tambah ${user.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={user} />
                        <TableView params={user} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(UserView)
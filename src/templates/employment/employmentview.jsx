import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastSuccess, toastError, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const employment = observable({
    title: "Jabatan",
    head: [
        {
            label: 'Kode', column: 'employmentCode', action: () => {
                if (employment.query.order !== 'employmentCode') {
                    employment.query.order = 'employmentCode'
                    employment.query.orderLabel = 'Kode'
                    employment._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'employmentName', action: () => {
                if (employment.query.order !== 'employmentName') {
                    employment.query.order = 'employmentName'
                    employment.query.orderLabel = 'Nama'
                    employment._getAll()
                }
            }
        },
    ],
    privilege: [
        {
            label: 'Ubah',
            key: 'employment',
            act: 'edit',
            icon: 'edit',
            action: o => history.replace(`edit/${o[[employment.id]]}`)
        },
        {
            label: 'Hapus',
            key: 'employment',
            act: 'delete',
            icon: 'trash',
            action: o => o.isShowConfirm = true
        },
    ],
    query: {
        column: `employmentId, 
            employmentCode, 
            employmentName`,
        filter: '',
        order: 'employmentName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'employmentId',
    label: 'employmentName',
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('employment', employment.query)
            .then(res => {
                if (res.error === null) {
                    employment.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`employment/${id}`, {})
            .then(res => {
                employment.input = res.response
                employment.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(employment.input)
        employment.input.logDetail = logDetail
        employment.loading = true
        return post('employment', employment.input)
            .then(res => {
                employment.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    employment.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                employment.loading = false
            })
    },
    async _update() {
        const logDetail = global.takeDiff(employment.input, employment.inputOld)
        employment.input.logDetail = logDetail
        employment.loading = true
        return put('employment', employment.input)
            .then(res => {
                employment.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    employment.input = {}
                    history.replace('/employment/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                employment.loading = false
            })
    },
    async _delete(id, info) {
        return del(`employment/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    employment._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class EmploymentView extends PureComponent {

    componentDidMount() {
        document.title = `${employment.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'employment')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={employment.title}
                            btnTooltip={`Tambah ${employment.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={employment} />
                        <TableView params={employment} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(EmploymentView)
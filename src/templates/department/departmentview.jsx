import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const department = observable({
    title: "Departemen",
    head: [
        {
            label: 'Kode', column: 'departmentCode', action: () => {
                if (department.query.order !== 'departmentCode') {
                    department.query.order = 'departmentCode'
                    department.query.orderLabel = 'Kode'
                    department._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'departmentName', action: () => {
                if (department.query.order !== 'departmentName') {
                    department.query.order = 'departmentName'
                    department.query.orderLabel = 'Nama'
                    department._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'department', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[department.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'department', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `departmentId, 
            departmentCode, 
            departmentName`,
        filter: '',
        order: 'departmentName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'departmentId',
    label: 'departmentName',
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('department', department.query)
            .then(res => {
                if (res.error === null) {
                    department.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`department/${id}`, {})
            .then(res => {
                department.input = res.response
                department.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(department.input)
        department.input.logDetail = logDetail
        department.loading = true
        return post('department', department.input)
            .then(res => {
                department.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    department.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                department.loading = false
            })
    },
    async _update() {
        const logDetail = global.takeDiff(department.input, department.inputOld)
        department.input.logDetail = logDetail
        department.loading = true
        return put('department', department.input)
            .then(res => {
                department.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    department.input = {}
                    history.replace('/department/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                department.loading = false
            })
    },
    async _delete(id, info) {
        return del(`department/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    department._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class DepartmentView extends PureComponent {

    componentDidMount() {
        document.title = `${department.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'department')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={department.title}
                            btnTooltip={`Tambah ${department.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={department} />
                        <TableView params={department} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(DepartmentView)
import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastSuccess, toastError, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const employee = observable({
    title: "Pegawai",
    head: [
        {
            label: 'Kode', column: 'employeeCode', action: () => {
                if (employee.query.order !== 'employeeCode') {
                    employee.query.order = 'employeeCode'
                    employee.query.orderLabel = 'Kode'
                    employee._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'employeeName', action: () => {
                if (employee.query.order !== 'employeeName') {
                    employee.query.order = 'employeeName'
                    employee.query.orderLabel = 'Nama'
                    employee._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'employee', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[employee.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'employee', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `employeeId, 
            employeeCode, 
            employeeName`,
        filter: '',
        order: 'employeeName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'employeeId',
    label: 'employeeName',
    loading: false,
    inputOld: {},
    input: {},
    store: {
        gender: [
            {
                id: 'L',
                label: 'Laki-laki',
            },
            {
                id: 'P',
                label: 'Perempuan',
            },
        ],
        identype: [
            {
                id: 'KTP',
                label: 'KTP',
            },
            {
                id: 'SIM',
                label: 'SIM',
            },
            {
                id: 'Passport',
                label: 'Passport',
            },
        ],
        department: [],
        employment: [],
    },
    async _getAll() {
        return get('employee', employee.query)
            .then(res => {
                if (res.error === null) {
                    employee.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`employee/${id}`, {})
            .then(res => {
                res.response.employeeBirthDate = new Date(res.response.employeeBirthDate)
                res.response.employeeInDate = res.response.employeeInDate ? new Date(res.response.employeeInDate) : null
                employee.input = res.response
                employee.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        employee.input.logDetail = JSON.stringify(employee.input)
        employee.loading = true
        return post('employee', employee.input)
            .then(res => {
                employee.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    employee.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                employee.loading = false
            })
    },
    async _update() {
        employee.input.logDetail = JSON.stringify(global.getDifference(employee.input, employee.inputOld))
        employee.loading = true
        return put('employee', employee.input)
            .then(res => {
                employee.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    employee.input = {}
                    history.replace('/employee/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                employee.loading = false
            })
    },
    async _delete(id, info) {
        return del(`employee/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    employee._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
    async _getDepartment() {
        return get('department', { 
                column: `departmentId, departmentCode, departmentName` 
            })
            .then(res => {
                if (res.error === null) {
                    employee.store.department = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getEmployment() {
        return get('employment', { 
                column: `employmentId, employmentCode, employmentName` 
            })
            .then(res => {
                if (res.error === null) {
                    employee.store.employment = res.response
                }
            })
            .catch(toastCatch)
    },
})


class EmployeeView extends PureComponent {

    componentDidMount() {
        document.title = `${employee.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'employee')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={employee.title}
                            btnTooltip={`Tambah ${employee.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={employee} />
                        <TableView params={employee} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(EmployeeView)
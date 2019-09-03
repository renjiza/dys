import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastSuccess, toastError, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const customer = observable({
    title: "Pelanggan",
    id: 'customerId',
    label: 'customerName',
    loading: false,
    head: [
        {
            label: 'Kode', column: 'customerCode', action: () => {
                if (customer.query.order !== 'customerCode') {
                    customer.query.order = 'customerCode'
                    customer.query.orderLabel = 'Kode'
                    customer._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'customerName', action: () => {
                if (customer.query.order !== 'customerName') {
                    customer.query.order = 'customerName'
                    customer.query.orderLabel = 'Nama'
                    customer._getAll()
                }
            }
        },
        {
            label: 'Email', column: 'customerEmail', action: () => {
                if (customer.query.order !== 'customerEmail') {
                    customer.query.order = 'customerEmail'
                    customer.query.orderLabel = 'Email'
                    customer._getAll()
                }
            }
        },
        {
            label: 'Telp', column: 'customerPhone', action: () => {
                if (customer.query.order !== 'customerPhone') {
                    customer.query.order = 'customerPhone'
                    customer.query.orderLabel = 'Telp'
                    customer._getAll()
                }
            }
        },
        {
            label: 'Alamat', column: 'customerAddress', action: () => {
                if (customer.query.order !== 'customerAddress') {
                    customer.query.order = 'customerAddress'
                    customer.query.orderLabel = 'Alamat'
                    customer._getAll()
                }
            }
        },
    ],
    privilege: [
        {
            label: 'Ubah',
            key: 'customer',
            act: 'edit',
            icon: 'edit',
            action: o => history.replace(`edit/${o[[customer.id]]}`)
        },
        {
            label: 'Hapus',
            key: 'customer',
            act: 'delete',
            icon: 'trash',
            action: o => o.isShowConfirm = true
        },
    ],
    query: {
        column: `customerId, 
            customerCode, 
            customerName, 
            customerEmail,
            customerPhone,
            customerPic,
            customerAddress`,
        filter: '',
        order: 'customerName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    inputOld: {},
    input: {},
    async _getAll() {
        return get('customer', customer.query)
            .then(res => {
                if (res.error === null) {
                    customer.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`customer/${id}`, {})
            .then(res => {
                customer.input = res.response
                customer.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(customer.input)
        customer.input.logDetail = logDetail
        customer.loading = true
        return post('customer', customer.input)
            .then(res => {
                customer.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    customer.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                customer.loading = false
            })
    },
    async _update() {
        const logDetail = global.takeDiff(customer.input, customer.inputOld)
        customer.input.logDetail = logDetail
        customer.loading = true
        return put('customer', customer.input)
            .then(res => {
                customer.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    customer.input = {}
                    history.replace('/customer/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                customer.loading = false
            })
    },
    async _delete(id, info) {
        return del(`customer/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    customer._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class CustomerView extends PureComponent {

    componentDidMount() {
        document.title = `${customer.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'customer')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={customer.title}
                            btnTooltip={`Tambah ${customer.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={customer} />
                        <TableView params={customer} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(CustomerView)
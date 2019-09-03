import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const vendor = observable({
    title: "Suplier",
    head: [
        {
            label: 'Kode', column: 'vendorCode', action: () => {
                if (vendor.query.order !== 'vendorCode') {
                    vendor.query.order = 'vendorCode'
                    vendor.query.orderLabel = 'Kode'
                    vendor._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'vendorName', action: () => {
                if (vendor.query.order !== 'vendorName') {
                    vendor.query.order = 'vendorName'
                    vendor.query.orderLabel = 'Nama'
                    vendor._getAll()
                }
            }
        },
        {
            label: 'Email', column: 'vendorEmail', action: () => {
                if (vendor.query.order !== 'vendorEmail') {
                    vendor.query.order = 'vendorEmail'
                    vendor.query.orderLabel = 'Email'
                    vendor._getAll()
                }
            }
        },
        {
            label: 'Telp', column: 'vendorPhone', action: () => {
                if (vendor.query.order !== 'vendorPhone') {
                    vendor.query.order = 'vendorPhone'
                    vendor.query.orderLabel = 'Telp'
                    vendor._getAll()
                }
            }
        },
        {
            label: 'Alamat', column: 'vendorAddress', action: () => {
                if (vendor.query.order !== 'vendorAddress') {
                    vendor.query.order = 'vendorAddress'
                    vendor.query.orderLabel = 'Alamat'
                    vendor._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'vendor', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[vendor.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'vendor', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `vendorId, 
            vendorCode, 
            vendorName,
            vendorEmail,
            vendorPhone,
            vendorAddress`,
        filter: '',
        order: 'vendorName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'vendorId',
    label: 'vendorName',
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('vendor', vendor.query)
            .then(res => {
                if (res.error === null) {
                    vendor.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`vendor/${id}`, {})
            .then(res => {
                vendor.input = res.response
                vendor.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(vendor.input)
        vendor.input.logDetail = logDetail
        vendor.loading = true
        return post('vendor', vendor.input)
            .then(res => {
                vendor.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    vendor.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                vendor.loading = false
            })
    },
    async _update() {
        const logDetail = global.takeDiff(vendor.input, vendor.inputOld)
        vendor.input.logDetail = logDetail
        vendor.loading = true
        return put('vendor', vendor.input)
            .then(res => {
                vendor.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    vendor.input = {}
                    history.replace('/vendor/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                vendor.loading = false
            })
    },
    async _delete(id, info) {
        return del(`vendor/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    vendor._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class VendorView extends PureComponent {

    componentDidMount() {
        document.title = `${vendor.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'vendor')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={vendor.title}
                            btnTooltip={`Tambah ${vendor.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={vendor} />
                        <TableView params={vendor} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(VendorView)
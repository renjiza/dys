import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const warehouse = observable({
    title: "Gudang",
    head: [
        {
            label: 'Kode', column: 'warehouseCode', action: () => {
                if (warehouse.query.order !== 'warehouseCode') {
                    warehouse.query.order = 'warehouseCode'
                    warehouse.query.orderLabel = 'Kode'
                    warehouse._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'warehouseName', action: () => {
                if (warehouse.query.order !== 'warehouseName') {
                    warehouse.query.order = 'warehouseName'
                    warehouse.query.orderLabel = 'Nama'
                    warehouse._getAll()
                }
            }
        },
        {
            label: 'Alamat', column: 'warehouseAddress', action: () => {
                if (warehouse.query.order !== 'warehouseAddress') {
                    warehouse.query.order = 'warehouseAddress'
                    warehouse.query.orderLabel = 'Alamat'
                    warehouse._getAll()
                }
            }
        },
        {
            label: 'Jenis Gudang', column: 'warehouseIsVirtual', action: () => {
                if (warehouse.query.order !== 'warehouseIsVirtual') {
                    warehouse.query.order = 'warehouseIsVirtual'
                    warehouse.query.orderLabel = 'Jenis Gudang'
                    warehouse._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'warehouse', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[warehouse.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'warehouse', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `warehouseId, 
            warehouseCode,
            warehouseName,
            warehouseAddress,
            IF(warehouseIsVirtual = 1, 'Virtual', 'Real') AS warehouseIsVirtual`,
        filter: '',
        order: 'warehouseCode',
        orderLabel: 'Kode',
        sort: 'asc',
    },
    body: [],
    id: 'warehouseId',
    label: 'warehouseName',
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('warehouse', warehouse.query)
            .then(res => {
                if (res.error === null) {
                    warehouse.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`warehouse/${id}`, {})
            .then(res => {
                warehouse.input = res.response
                warehouse.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        warehouse.input.logDetail = JSON.stringify(warehouse.input)
        warehouse.loading = true
        return post('warehouse', warehouse.input)
            .then(res => {
                warehouse.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    warehouse.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                warehouse.loading = false
            })
    },
    async _update() {
        warehouse.input.logDetail = JSON.stringify(global.getDifference(warehouse.input, warehouse.inputOld))
        warehouse.loading = true
        return put('warehouse', warehouse.input)
            .then(res => {
                warehouse.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    warehouse.input = {}
                    history.replace('/warehouse/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                warehouse.loading = false
            })
    },
    async _delete(id, info) {
        return del(`warehouse/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    warehouse._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class WarehouseView extends PureComponent {

    componentDidMount() {
        document.title = `${warehouse.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'warehouse')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={warehouse.title}
                            btnTooltip={`Tambah ${warehouse.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={warehouse} />
                        <TableView params={warehouse} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(WarehouseView)
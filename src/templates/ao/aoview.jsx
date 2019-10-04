import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import { get, del, post, put, socket } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const ao = observable({
    title: "Penerimaan Pembelian",
    head: [
        {
            label: 'Status', column: 'aoState', action: () => {
                if (ao.query.order !== 'aoState') {
                    ao.query.order = 'aoState'
                    ao.query.orderLabel = 'Status'
                    ao._getAll()
                }
            }, render: o => {
                let a
                switch (o.aoState) {
                    case 2:
                        a = "Sebagian"
                        break;
                    case 3:
                        a = "Selesai"
                        break;
                    case 4:
                        a = "Ditutup"
                        break;
                    default:
                        a = "Belum"
                }
                return a
            }
        },
        {
            label: 'Tanggal', column: 'aoDate', action: () => {
                if (ao.query.order !== 'aoDate') {
                    ao.query.order = 'aoDate'
                    ao.query.orderLabel = 'Tanggal'
                    ao._getAll()
                }
            }, render: o => moment(o.aoDate).format('DD MMM YYYY')
        },
        {
            label: 'No. Transaksi', column: 'aoCodeTrans', action: () => {
                if (ao.query.order !== 'aoCodeTrans') {
                    ao.query.order = 'aoCodeTrans'
                    ao.query.orderLabel = 'No. Transaksi'
                    ao._getAll()
                }
            }
        },
        {
            label: 'Referensi', column: 'aoRef', action: () => {
                if (ao.query.order !== 'aoRef') {
                    ao.query.order = 'aoRef'
                    ao.query.orderLabel = 'Referensi'
                    ao._getAll()
                }
            }
        },
        {
            label: 'Departemen', column: 'departmentName', action: () => {
                if (ao.query.order !== 'departmentName') {
                    ao.query.order = 'departmentName'
                    ao.query.orderLabel = 'Departemen'
                    ao._getAll()
                }
            }
        },
        {
            label: 'Keterangan', column: 'aoDescription', action: () => {
                if (ao.query.order !== 'aoDescription') {
                    ao.query.order = 'aoDescription'
                    ao.query.orderLabel = 'Keterangan'
                    ao._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'ao', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[ao.id]]}`),
            disabled: o => o.aoState !== 1,
        },
        { 
            label: 'Hapus', 
            key: 'ao', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true,
            disabled: o => o.aoState !== 1,
        },
    ],
    query: {
        column: `aoId, 
            aoState,
            aoDate,
            aoCodeTrans, 
            aoRef,
            departmentName,
            aoDescription`,
        filter: '',
        order: 'aoDate',
        orderLabel: 'Tanggal',
        sort: 'desc',
    },
    _trColor (data) {
        let a = {}
        switch (data.aoState) {            
            case 2:
                a = { className: "tr-partial" }
                break;
            case 3:
                a = { className: "tr-done" }
                break;
            case 4:
                a = { className: "tr-closed" }
                break;
            default:
                a = {}
        }
        return a
    },
    body: [],
    id: 'aoId',
    label: 'aoCodeTrans',
    loading: false,
    inputOld: {},
    input: {
        aoDate: new Date(),
        detail: [],
    },
    inputdet: {},
    store: {        
        department: [],
        vendor: [],
        product: [],
        unit: [],
    },
    detail: {
        head: [
            { 
                label: "Produk", 
                column: "productName", 
                render: item => `${item.productCode} - ${item.productName}` 
            },
            { 
                label: "Qty", 
                column: "aodetQty", 
                render: item => `${thousand(item.aodetQty)} ${item.aodetUnit}`, 
                editable: true,
                editType: 'number',
                onChange: (val, item) => {
                    item.aodetQty = val > item.aodetQtyLeft ? item.aodetQtyLeft : val
                    item.aodetTotalNet = item.aodetQty * item.aodetNet
                },
            },
            { 
                label: "Harga / satuan", 
                column: "aodetPrice", 
                render: item => thousand(item.aodetPrice),
                editable: true, 
                editType: 'number',
                onChange: (val, item) => {
                    item.aodetPrice = val
                    const net = item.aodetPrice - item.aodetDisc
                    item.aodetNet = net
                    item.aodetTotalNet = item.aodetQty * net
                } 
            },
            { 
                label: "Diskon / satuan", 
                column: "aodetDisc", 
                render: item => thousand(item.aodetDisc),
                editable: true, 
                editType: 'number',
                onChange: (val, item) => {
                    item.aodetDisc = val
                    const net = item.aodetPrice - item.aodetDisc
                    item.aodetNet = net
                    item.aodetTotalNet = item.aodetQty * net
                }  
            },
            { 
                label: "Net", 
                column: "aodetNet",
                render: item => thousand(item.aodetNet),
            },
            { 
                label: "Total net", 
                column: "aodetTotalNet",
                render: item => thousand(item.aodetTotalNet),
            },
            { 
                label: "Keterangan", 
                column: "aodetDescription", 
                editable: true , 
                editType: 'textarea' 
            },
        ],
        action: [
            {
                icon: o => o.isEdit ? "floppy-disk" : "edit",
                action: o => o.isEdit = !o.isEdit,
            },
            {
                icon: "delete",
                action: (o, i) => ao.detail._handleDelete(o, i),
                disabled: o => o.isEdit
            },
        ],
        deleteId: [],        
        async _handleAdd() {
            const path = history.location.pathname.split('/')
            if (path[2] === "edit") {
                ao.inputdet.aodetAoId = parseInt(path[3])
            }
            const disc = (ao.inputdet.aodetDisc || 0) 
            const net = ao.inputdet.aodetPrice - disc
            ao.inputdet.aodetAopdetId = 0
            ao.inputdet.aodetDisc = disc
            ao.inputdet.aodetNet = net
            ao.inputdet.aodetTotalNet = ao.inputdet.aodetQty * net
            ao.inputdet.aodetDescription = (ao.inputdet.aodetDescription || '')
            ao.input.detail.push(ao.inputdet)
            ao.inputdet = {}
            ao.store.unit = []
        },
        async _handleUpdate() {
            
        },
        async _handleDelete(item, index) {
            const path = history.location.pathname.split('/')
            const detailId = item.aodetId
            if (path[2] === "edit" && ao.detail.deleteId.indexOf(detailId) === -1) {
                ao.detail.deleteId.push(detailId)
            }
            ao.input.detail.splice(index, 1)
        }
    },   
    other: {
        var: {},
        async _copyDetail(aopId) {
            get(`aop/${aopId}`, {}).then(res => {
                const { aopCodeTrans, aopRef, aopDepartmentId, aopDateRequired } = res.resaonse
                ao.other.var.aopCodeTrans = aopCodeTrans
                ao.input.aoAopId = aopId 
                ao.input.aoRef = aopRef
                ao.input.aoDepartmentId = aopDepartmentId
                ao.input.aoDateRequired = new Date(aopDateRequired)
                res.resaonse.detail.map(o => {
                    if (o.aopdetQtyLeft > 0) {
                        const a = {
                            aodetAopdetId: o.aopdetId,
                            aodetProductId: o.aopdetProductId,
                            aodetQty: o.aopdetQtyLeft,
                            aodetQtyLeft: o.aopdetQtyLeft,
                            aodetUnit: o.aopdetUnit,
                            aodetRatio: o.aopdetRatio,
                            aodetPrice: 0,
                            aodetDisc: 0,
                            aodetNet: 0,
                            aodetTotalNet: 0,
                            aodetDescription: o.aopdetDescription,
                            aodetHandler: global.cookie.user,
                            productCode: o.productCode,
                            productBarcode: o.productBarcode,
                            productName: o.productName,
                        }
                        return ao.input.detail.push(a)
                    }
                    return true
                })
            })
        },
    },
    async _getAll() {
        return get('ao', ao.query)
            .then(res => {
                if (res.error === null) {
                    ao.body = res.resaonse
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`ao/${id}`, {})
        .then(res => {
                res.resaonse.aoDate = new Date(res.resaonse.aoDate)
                res.resaonse.aoDateRequired = new Date(res.resaonse.aoDateRequired)
                ao.input = res.resaonse
                ao.inputOld = res.resaonse
            })
            .catch(toastCatch)
    },
    async _create() {
        ao.input.logDetail = JSON.stringify(ao.input)
        ao.loading = true
        return post('ao', ao.input)
            .then(res => {
                ao.loading = false
                if (res.error === null) {
                    toastSuccess(res.resaonse)
                    ao.input = {
                        aoDate: new Date(),
                        detail: [],
                    }
                    if (history.location.pathname.split('/')[3]) history.replace('/aop/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                ao.loading = false
            })
    },
    async _update() {
        ao.input.logDetail = JSON.stringify(global.getDifference(ao.input, ao.inputOld))
        ao.input.aoDetailDeleteId = `${ao.detail.deleteId.join(',')}`
        ao.loading = true        
        return put('ao', ao.input)
            .then(res => {
                ao.loading = false
                if (res.error === null) {
                    toastSuccess(res.resaonse)
                    ao.input = {
                        aoDate: new Date()
                    }
                    history.replace('/ao/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                ao.loading = false
            })
    },
    async _delete(id, info) {
        return del(`ao/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.resaonse)
                    ao._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },    
    async _getDepartment() {
        return get(`department`, { column: 'departmentId, departmentCode, departmentName' })
            .then(res => {
                if (res.error === null) {
                    ao.store.department = res.resaonse
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
    async _getVendor() {
        return get(`vendor`, { column: 'vendorId, vendorCode, vendorName' })
            .then(res => {
                if (res.error === null) {
                    ao.store.vendor = res.resaonse
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
})


class AoView extends PureComponent {

    componentDidMount() {
        document.title = `${ao.title} | ${global.appname}`
        socket.on('ao add', () => ao._getAll())
        socket.on('ao edit', () => ao._getAll())
        socket.on('ao delete', () => ao._getAll())
    }

    componentWillUnmount() {
        socket.off('ao add')
        socket.off('ao edit')
        socket.off('ao delete')
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'ao')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={ao.title}
                            btnTooltip={`Tambah ${ao.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={ao} />
                        <TableView params={ao} access={acc} trProps={o => ao._trColor(o)} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(AoView)
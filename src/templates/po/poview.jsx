import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import { get, del, post, put, socket } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const po = observable({
    title: "Order Pembelian",
    head: [
        {
            label: 'Status', column: 'poState', action: () => {
                if (po.query.order !== 'poState') {
                    po.query.order = 'poState'
                    po.query.orderLabel = 'Status'
                    po._getAll()
                }
            }, render: o => {
                let a
                switch (o.poState) {
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
            label: 'Tanggal', column: 'poDate', action: () => {
                if (po.query.order !== 'poDate') {
                    po.query.order = 'poDate'
                    po.query.orderLabel = 'Tanggal'
                    po._getAll()
                }
            }, render: o => moment(o.poDate).format('DD MMM YYYY')
        },
        {
            label: 'No. Transaksi', column: 'poCodeTrans', action: () => {
                if (po.query.order !== 'poCodeTrans') {
                    po.query.order = 'poCodeTrans'
                    po.query.orderLabel = 'No. Transaksi'
                    po._getAll()
                }
            }
        },
        {
            label: 'Referensi', column: 'poRef', action: () => {
                if (po.query.order !== 'poRef') {
                    po.query.order = 'poRef'
                    po.query.orderLabel = 'Referensi'
                    po._getAll()
                }
            }
        },
        {
            label: 'Departemen', column: 'departmentName', action: () => {
                if (po.query.order !== 'departmentName') {
                    po.query.order = 'departmentName'
                    po.query.orderLabel = 'Departemen'
                    po._getAll()
                }
            }
        },
        {
            label: 'Keterangan', column: 'poDescription', action: () => {
                if (po.query.order !== 'poDescription') {
                    po.query.order = 'poDescription'
                    po.query.orderLabel = 'Keterangan'
                    po._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'po', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[po.id]]}`),
            disabled: o => o.poState !== 1,
        },
        {
            label: 'Detail',
            key: 'po',
            act: 'detail',
            icon: 'document',
            action: o => history.replace(`detail/${o[[po.id]]}`),
        },
        { 
            label: 'Hapus', 
            key: 'po', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true,
            disabled: o => o.poState !== 1,
        },
    ],
    query: {
        column: `poId, 
            poState,
            poDate,
            poCodeTrans, 
            poRef,
            departmentName,
            poDescription`,
        filter: '',
        order: 'poDate',
        orderLabel: 'Tanggal',
        sort: 'desc',
    },
    _trColor (data) {
        let a = {}
        switch (data.poState) {            
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
    id: 'poId',
    label: 'poCodeTrans',
    loading: false,
    inputOld: {},
    input: {
        poDate: new Date(),
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
                column: "podetQty", 
                render: item => `${thousand(item.podetQty)} ${item.podetUnit}`, 
                editable: true,
                editType: 'number',
                onChange: (val, item) => {
                    item.podetQty = val > item.podetQtyLeft ? item.podetQtyLeft : val
                    item.podetTotalNet = item.podetQty * item.podetNet
                },
            },
            { 
                label: "Harga / satuan", 
                column: "podetPrice", 
                render: item => thousand(item.podetPrice),
                editable: true, 
                editType: 'number',
                onChange: (val, item) => {
                    item.podetPrice = val
                    const net = item.podetPrice - item.podetDisc
                    item.podetNet = net
                    item.podetTotalNet = item.podetQty * net
                } 
            },
            { 
                label: "Diskon / satuan", 
                column: "podetDisc", 
                render: item => thousand(item.podetDisc),
                editable: true, 
                editType: 'number',
                onChange: (val, item) => {
                    item.podetDisc = val
                    const net = item.podetPrice - item.podetDisc
                    item.podetNet = net
                    item.podetTotalNet = item.podetQty * net
                }  
            },
            { 
                label: "Net", 
                column: "podetNet",
                render: item => thousand(item.podetNet),
            },
            { 
                label: "Total net", 
                column: "podetTotalNet",
                render: item => thousand(item.podetTotalNet),
            },
            { 
                label: "Keterangan", 
                column: "podetDescription", 
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
                action: (o, i) => po.detail._handleDelete(o, i),
                disabled: o => o.isEdit
            },
        ],
        deleteId: [],        
        async _handleAdd() {
            const path = history.location.pathname.split('/')
            if (path[2] === "edit") {
                po.inputdet.podetPoId = parseInt(path[3])
            }
            const disc = (po.inputdet.podetDisc || 0) 
            const net = po.inputdet.podetPrice - disc
            po.inputdet.podetPopdetId = 0
            po.inputdet.podetDisc = disc
            po.inputdet.podetNet = net
            po.inputdet.podetTotalNet = po.inputdet.podetQty * net
            po.inputdet.podetDescription = (po.inputdet.podetDescription || '')
            po.input.detail.push(po.inputdet)
            po.inputdet = {}
            po.store.unit = []
        },
        async _handleUpdate() {
            
        },
        async _handleDelete(item, index) {
            const path = history.location.pathname.split('/')
            const detailId = item.podetId
            if (path[2] === "edit" && po.detail.deleteId.indexOf(detailId) === -1) {
                po.detail.deleteId.push(detailId)
            }
            po.input.detail.splice(index, 1)
        }
    },   
    other: {
        var: {},
        async _copyDetail(popId) {
            get(`pop/${popId}`, {}).then(res => {
                const { popCodeTrans, popRef, popDepartmentId, popDateRequired } = res.response
                po.other.var.popCodeTrans = popCodeTrans
                po.input.poPopId = popId 
                po.input.poRef = popRef
                po.input.poDepartmentId = popDepartmentId
                po.input.poDateRequired = new Date(popDateRequired)
                res.response.detail.map(o => {
                    if (o.popdetQtyLeft > 0) {
                        const a = {
                            podetPopdetId: o.popdetId,
                            podetProductId: o.popdetProductId,
                            podetQty: o.popdetQtyLeft,
                            podetQtyLeft: o.popdetQtyLeft,
                            podetUnit: o.popdetUnit,
                            podetRatio: o.popdetRatio,
                            podetPrice: 0,
                            podetDisc: 0,
                            podetNet: 0,
                            podetTotalNet: 0,
                            podetDescription: o.popdetDescription,
                            podetHandler: global.cookie.user,
                            productCode: o.productCode,
                            productBarcode: o.productBarcode,
                            productName: o.productName,
                        }
                        return po.input.detail.push(a)
                    }
                    return true
                })
            })
        },
    },
    async _getAll() {
        return get('po', po.query)
            .then(res => {
                if (res.error === null) {
                    po.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`po/${id}`, {})
        .then(res => {
                res.response.poDate = new Date(res.response.poDate)
                res.response.poDateRequired = new Date(res.response.poDateRequired)
                po.input = res.response
                po.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _getDetail(id) {
        return get(`po/detail/${id}`, {})
            .then(res => {
                res.response.poDate = new Date(res.response.poDate)
                res.response.poDateRequired = new Date(res.response.poDateRequired)
                po.input = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        po.input.logDetail = JSON.stringify(po.input)
        po.loading = true
        return post('po', po.input)
            .then(res => {
                po.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    po.input = {
                        poDate: new Date(),
                        detail: [],
                    }
                    if (history.location.pathname.split('/')[3]) history.replace('/pop/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                po.loading = false
            })
    },
    async _update() {
        po.input.logDetail = JSON.stringify(global.getDifference(po.input, po.inputOld))
        po.input.poDetailDeleteId = `${po.detail.deleteId.join(',')}`
        po.loading = true        
        return put('po', po.input)
            .then(res => {
                po.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    po.input = {
                        poDate: new Date()
                    }
                    history.replace('/po/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                po.loading = false
            })
    },
    async _delete(id, info) {
        return del(`po/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    po._getAll()
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
                    po.store.department = res.response
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
                    po.store.vendor = res.response
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
})


class PopView extends PureComponent {

    componentDidMount() {
        document.title = `${po.title} | ${global.appname}`
        socket.on('po add', () => po._getAll())
        socket.on('po edit', () => po._getAll())
        socket.on('po delete', () => po._getAll())
    }

    componentWillUnmount() {
        socket.off('po add')
        socket.off('po edit')
        socket.off('po delete')
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'po')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={po.title}
                            btnTooltip={`Tambah ${po.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={po} />
                        <TableView params={po} access={acc} trProps={o => po._trColor(o)} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(PopView)
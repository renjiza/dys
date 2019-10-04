import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';

import { get, del, post, put, socket } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const pop = observable({
    title: "Pre Order Pembelian",
    head: [
        {
            label: 'Status', column: 'popState', action: () => {
                if (pop.query.order !== 'popState') {
                    pop.query.order = 'popState'
                    pop.query.orderLabel = 'Status'
                    pop._getAll()
                }
            }, render: o => {
                let a                
                switch (o.popState) {
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
            label: 'Tanggal', column: 'popDate', action: () => {
                if (pop.query.order !== 'popDate') {
                    pop.query.order = 'popDate'
                    pop.query.orderLabel = 'Tanggal'
                    pop._getAll()
                }
            }, render: o => moment(o.popDate).format('DD MMM YYYY')
        },
        {
            label: 'No. Transaksi', column: 'popCodeTrans', action: () => {
                if (pop.query.order !== 'popCodeTrans') {
                    pop.query.order = 'popCodeTrans'
                    pop.query.orderLabel = 'No. Transaksi'
                    pop._getAll()
                }
            }
        },
        {
            label: 'Referensi', column: 'popRef', action: () => {
                if (pop.query.order !== 'popRef') {
                    pop.query.order = 'popRef'
                    pop.query.orderLabel = 'Referensi'
                    pop._getAll()
                }
            }
        },
        {
            label: 'Departemen', column: 'departmentName', action: () => {
                if (pop.query.order !== 'departmentName') {
                    pop.query.order = 'departmentName'
                    pop.query.orderLabel = 'Departemen'
                    pop._getAll()
                }
            }
        },
        {
            label: 'Keterangan', column: 'popDescription', action: () => {
                if (pop.query.order !== 'popDescription') {
                    pop.query.order = 'popDescription'
                    pop.query.orderLabel = 'Keterangan'
                    pop._getAll()
                }
            }
        },
    ],
    privilege: [        
        { 
            label: 'Ubah', 
            key: 'pop', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[pop.id]]}`),
            disabled: o => o.popState !== 1,
        },
        {
            label: 'Detail',
            key: 'pop',
            act: 'detail',
            icon: 'document',
            action: o => history.replace(`detail/${o[[pop.id]]}`),
        },
        {
            label: 'Hapus',
            key: 'pop',
            act: 'delete',
            icon: 'trash',
            action: o => o.isShowConfirm = true,
            disabled: o => o.popState !== 1,
        },
        {
            label: 'Buat Order Pembelian',
            key: 'po',
            act: 'add',
            icon: 'flow-end',
            action: o => history.replace(`/po/add/${o.popId}`),
            disabled: o => (o.popState === 3 || o.popState === 4),
        },
    ],
    query: {
        column: `popId, 
            popState,
            popDate,
            popCodeTrans, 
            popRef,
            departmentName,
            popDescription`,
        filter: '',
        order: 'popDate',
        orderLabel: 'Tanggal',
        sort: 'desc',
    },
    _trColor(data) {
        let a = {}
        switch (data.popState) {
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
                a = { className: "tr-undone" }
        }
        return a
    },
    body: [],
    id: 'popId',
    label: 'popCodeTrans',
    loading: false,
    inputOld: {},
    input: {
        popDate: new Date(),
        detail: [],
    },
    inputdet: {},
    store: {
        department: [],
        product: [],
        unit: [],
    },
    detail: {
        head: [
            { label: "Produk", column: "productName", render: item => `${item.productCode} - ${item.productName}` },
            { label: "Qty", column: "popdetQty", render: item => `${thousand(item.popdetQty)} ${item.popdetUnit}` },
            { label: "Keterangan", column: "popdetDescription" },
        ], 
        action: [    
            {
                icon: "delete",
                action: (o, i) => pop.detail._handleDelete(o, i),
            },
        ],
        deleteId: [],
        async _handleAdd() {
            const path = history.location.pathname.split('/')
            if (path[2] === "edit") {
                pop.inputdet.popdetPopId = parseInt(path[3])
            }
            pop.inputdet.popdetDescription = (pop.inputdet.popdetDescription || '')
            pop.input.detail.push(pop.inputdet)
            pop.inputdet = {}
            pop.store.unit = []
        },
        async _handleUpdate() {
            
        },
        async _handleDelete(item, index) {
            const path = history.location.pathname.split('/')
            const detailId = item.popdetId
            if (path[2] === "edit" && pop.detail.deleteId.indexOf(detailId) === -1) {
                pop.detail.deleteId.push(detailId)
            }
            pop.input.detail.splice(index, 1)
        }
    },
    async _getAll() {
        return get('pop', pop.query)
            .then(res => {
                if (res.error === null) {
                    pop.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`pop/${id}`, {})
        .then(res => {
                res.response.popDate = new Date(res.response.popDate)
                res.response.popDateRequired = new Date(res.response.popDateRequired)
                pop.input = res.response
                pop.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _getDetail(id) {
        return get(`pop/detail/${id}`, {})
            .then(res => {
                res.response.popDate = new Date(res.response.popDate)
                res.response.popDateRequired = new Date(res.response.popDateRequired)
                pop.input = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        pop.input.logDetail = JSON.stringify(pop.input)
        pop.loading = true        
        return post('pop', pop.input)
            .then(res => {
                pop.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    pop.input = {
                        popDate: new Date(),
                        detail: [],
                    }
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                pop.loading = false
            })
    },
    async _update() {
        pop.input.logDetail = JSON.stringify(global.getDifference(pop.input, pop.inputOld))
        pop.input.popDetailDeleteId = `${pop.detail.deleteId.join(',')}`
        pop.loading = true        
        return put('pop', pop.input)
            .then(res => {
                pop.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    pop.input = {
                        popDate: new Date()
                    }
                    history.replace('/pop/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                pop.loading = false
            })
    },
    async _delete(id, info) {
        return del(`pop/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    pop._getAll()
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
                    pop.store.department = res.response
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
})


class PopView extends PureComponent {

    componentDidMount() {
        document.title = `${pop.title} | ${global.appname}`
        socket.on('pop add', () => pop._getAll())
        socket.on('pop edit', () => pop._getAll())
        socket.on('pop delete', () => pop._getAll())
    }

    componentWillUnmount() {
        socket.off('pop add')
        socket.off('pop edit')
        socket.off('pop delete')
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'pop' || o.menuKey === 'po')
        const currentAcc = acc.filter(o => o.menuKey === 'pop').map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={pop.title}
                            btnTooltip={`Tambah ${pop.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={pop} />
                        <TableView params={pop} access={acc} trProps={o => pop._trColor(o)} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(PopView)
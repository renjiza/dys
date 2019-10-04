import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const producttype = observable({
    title: "Jenis Produk",
    head: [
        {
            label: 'Kode', column: 'producttypeCode', action: () => {
                if (producttype.query.order !== 'producttypeCode') {
                    producttype.query.order = 'producttypeCode'
                    producttype.query.orderLabel = 'Kode'
                    producttype._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'producttypeName', action: () => {
                if (producttype.query.order !== 'producttypeName') {
                    producttype.query.order = 'producttypeName'
                    producttype.query.orderLabel = 'Nama'
                    producttype._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'producttype', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[producttype.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'producttype', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `producttypeId, 
            producttypeCode, 
            producttypeName`,
        filter: '',
        order: 'producttypeName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'producttypeId',
    label: 'producttypeName',
    loading: false,
    inputOld: {},
    input: {},
    async _getAll() {
        return get('producttype', producttype.query)
            .then(res => {
                if (res.error === null) {
                    producttype.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`producttype/${id}`, {})
            .then(res => {
                producttype.input = res.response
                producttype.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        producttype.input.logDetail = JSON.stringify(producttype.input)
        producttype.loading = true
        return post('producttype', producttype.input)
            .then(res => {
                producttype.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    producttype.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                producttype.loading = false
            })
    },
    async _update() {
        producttype.input.logDetail = JSON.stringify(global.getDifference(producttype.input, producttype.inputOld))
        producttype.loading = true
        return put('producttype', producttype.input)
            .then(res => {
                producttype.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    producttype.input = {}
                    history.replace('/producttype/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                producttype.loading = false
            })
    },
    async _delete(id, info) {
        return del(`producttype/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    producttype._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    }
})


class ProductTypeView extends PureComponent {

    componentDidMount() {
        document.title = `${producttype.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'producttype')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={producttype.title}
                            btnTooltip={`Tambah ${producttype.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={producttype} />
                        <TableView params={producttype} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(ProductTypeView)
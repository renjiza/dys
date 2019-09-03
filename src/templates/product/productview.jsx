import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const product = observable({
    title: "Produk",
    head: [
        {
            label: 'Kode', column: 'productCode', action: () => {
                if (product.query.order !== 'productCode') {
                    product.query.order = 'productCode'
                    product.query.orderLabel = 'Kode'
                    product._getAll()
                }
            }
        },
        {
            label: 'Barcode', column: 'productBarcode', action: () => {
                if (product.query.order !== 'productBarcode') {
                    product.query.order = 'productBarcode'
                    product.query.orderLabel = 'Barcode'
                    product._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'productName', action: () => {
                if (product.query.order !== 'productName') {
                    product.query.order = 'productName'
                    product.query.orderLabel = 'Nama'
                    product._getAll()
                }
            }
        },
        {
            label: 'Deskripsi', column: 'productDescription', action: () => {
                if (product.query.order !== 'productDescription') {
                    product.query.order = 'productDescription'
                    product.query.orderLabel = 'Deskripsi'
                    product._getAll()
                }
            }
        },
    ],
    privilege: [
        { 
            label: 'Ubah', 
            key: 'product', 
            act: 'edit', 
            icon: 'edit', 
            action: o => history.replace(`edit/${o[[product.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'product', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `productId, 
            productCode, 
            productBarcode, 
            productName,
            productDescription`,
        filter: '',
        order: 'productName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'productId',
    label: 'productName',
    loading: false,
    inputOld: {},
    input: {},
    store: {
        producttype: [],
    },
    async _getAll() {
        return get('product', product.query)
            .then(res => {
                if (res.error === null) {
                    product.body = res.response
                }
            })
            .catch(toastCatch)
    },
    async _getById(id) {
        return get(`product/${id}`, {})
            .then(res => {
                product.input = res.response
                product.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(product.input)
        product.input.logDetail = logDetail
        product.loading = true
        return post('product', product.input)
            .then(res => {
                product.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    product.input = {}
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                product.loading = false
            })
    },
    async _update() {
        const logDetail = global.takeDiff(product.input, product.inputOld)
        product.input.logDetail = logDetail
        product.loading = true
        return put('product', product.input)
            .then(res => {
                product.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    product.input = {}
                    history.replace('/product/view')
                } else {
                    toastError(res.error)
                }
            })
            .catch(() => {
                toastCatch()
                product.loading = false
            })
    },
    async _delete(id, info) {
        return del(`product/${id}`, { info: info })
            .then(res => {
                if (res.error === null) {
                    toastSuccess(res.response)
                    product._getAll()
                } else {
                    toastError(res.error)
                }
            })
            .catch(toastCatch)
    },
    async _getProducttype() {
        return get('producttype', {
            column: `producttypeId, producttypeCode, producttypeName`
        })
            .then(res => {
                if (res.error === null) {
                    product.store.producttype = res.response
                }
            })
            .catch(toastCatch)
    },
})


class ProductView extends PureComponent {

    componentDidMount() {
        document.title = `${product.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'product')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={product.title}
                            btnTooltip={`Tambah ${product.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={product} />
                        <TableView params={product} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(ProductView)
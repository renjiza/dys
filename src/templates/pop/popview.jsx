import React, { PureComponent } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { get, del, post, put } from '../../components/xhr';
import { HeaderView, TableView, ToolView, toastError, toastSuccess, toastCatch } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';


export const pop = observable({
    title: "Pre Order Pembelian",
    head: [
        {
            label: 'Kode', column: 'popCode', action: () => {
                if (pop.query.order !== 'popCode') {
                    pop.query.order = 'popCode'
                    pop.query.orderLabel = 'Kode'
                    pop._getAll()
                }
            }
        },
        {
            label: 'Nama', column: 'popName', action: () => {
                if (pop.query.order !== 'popName') {
                    pop.query.order = 'popName'
                    pop.query.orderLabel = 'Nama'
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
            action: o => history.replace(`edit/${o[[pop.id]]}`) 
        },
        { 
            label: 'Hapus', 
            key: 'pop', 
            act: 'delete', 
            icon: 'trash', 
            action: o => o.isShowConfirm = true 
        },
    ],
    query: {
        column: `popId, 
            popCode, 
            popName`,
        filter: '',
        order: 'popName',
        orderLabel: 'Nama',
        sort: 'asc',
    },
    body: [],
    id: 'popId',
    label: 'popName',
    loading: false,
    inputOld: {},
    input: {},
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
                pop.input = res.response
                pop.inputOld = res.response
            })
            .catch(toastCatch)
    },
    async _create() {
        const logDetail = JSON.stringify(pop.input)
        pop.input.logDetail = logDetail
        pop.loading = true
        return post('pop', pop.input)
            .then(res => {
                pop.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    pop.input = {}
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
        const logDetail = global.takeDiff(pop.input, pop.inputOld)
        pop.input.logDetail = logDetail
        pop.loading = true
        return put('pop', pop.input)
            .then(res => {
                pop.loading = false
                if (res.error === null) {
                    toastSuccess(res.response)
                    pop.input = {}
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
    }
})


class PopView extends PureComponent {

    componentDidMount() {
        document.title = `${pop.title} | ${global.appname}`
    }

    render() {
        const acc = global.menu.filter(o => o.menuKey === 'pop')
        const currentAcc = acc.map(o => o.menuAction)
        return (
            currentAcc.indexOf('view') !== -1 ?
                <div className="dys-paper">
                    <div className="dys-container">
                        <HeaderView
                            title={pop.title}
                            btnTooltip={`Tambah ${pop.title}`}
                            btnIcon="add"
                            intent="success"
                            btnShow={currentAcc.indexOf('add') !== -1}
                            btnLink="add"
                        />
                        <ToolView params={pop} />
                        <TableView params={pop} access={acc} />
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(PopView)
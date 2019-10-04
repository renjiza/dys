import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea, Label, Divider } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';

import { HeaderView, Select, DateGroup, TableDetail, NumberGroup, Autocomplete } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { pop } from './popview';
import history from '../../components/history';
import global from '../../stores/globalstore';


class PopInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        pop._getDepartment()
        if (path[2] === "add") {
            document.title = `Tambah ${pop.title} | ${global.appname}`
            pop.input = { 
                popDate: new Date(),
                detail: [],
            }
            pop.inputdet = {}
        } else {
            document.title = `Ubah ${pop.title} | ${global.appname}`
            pop._getById(path[3])
        }        
        pop.detail.deleteId = []
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'pop').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"

        return (
            menu.indexOf(path[2]) !== -1 && !(path[2] === "edit" && pop.input.popState !== 1) ?
                <div className="clover-paper">
                    <div className="clover-container">
                        <HeaderView
                            title={`${isAdd ? "Tambah" : "Ubah"} ${pop.title} ${pop.input.popCodeTrans || ''}`}
                            btnTooltip={`Kembali ke ${pop.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form">
                            <div className="grid">
                                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Tanggal transaksi"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <DateGroup
                                                value={pop.input.popDate}
                                                onChange={date => pop.input.popDate = date}
                                                disabled
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-5 col-md-6 col-sm-7 col-xs-12">
                                    <FormGroup
                                        label="Referensi"
                                        helperText="Dapat digunakan sebagai penanda transaksi"
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={pop.input.popRef || ''}
                                                onChange={e => pop.input.popRef = e.target.value}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>                                
                            </div>                        
                            <div className="grid">
                                <div className="col-lg-3 col-md-4 col-sm-5 col-xs-12">
                                    <FormGroup
                                        label="Departemen"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >                                        
                                        <Select
                                            value={pop.input.popDepartmentId}
                                            onChange={val => pop.input.popDepartmentId = val}
                                            items={pop.store.department}
                                            id="departmentId"
                                            label="departmentName"
                                            text={item => `${item.departmentName}`}
                                            textRight={item => `(${item.departmentCode})`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Tanggal diminta"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <DateGroup
                                                value={pop.input.popDateRequired}
                                                onChange={date => pop.input.popDateRequired = date}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>                                
                            </div>                            
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Divider />
                                </div>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Label className="bold">Detail</Label>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="Produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Autocomplete
                                            value={pop.inputdet.popdetProductId}
                                            onChange={(val, item) => {
                                                pop.inputdet.popdetProductId = val
                                                let result = [1,2,3].map(i => {
                                                    const a = {}
                                                    a["unit"] = item[`productUnit${i}`]
                                                    a["ratio"] = item[`productRatio${i}`]
                                                    return a
                                                }).filter(o => o.unit !== '')
                                                pop.store.unit = result
                                                pop.inputdet.productCode = item.productCode
                                                pop.inputdet.productName = item.productName
                                                pop.inputdet.popdetRatio = 1
                                                pop.inputdet.popdetUnit = result[0].unit
                                            }}
                                            id="productId"
                                            label="productName"
                                            text={item => `${item.productCode} - ${item.productName}`}
                                            remoteUrl="product"
                                            column={[
                                                'productCode', 
                                                'productBarcode', 
                                                'productName',
                                                'productUnit1',
                                                'productRatio1',
                                                'productUnit2',
                                                'productRatio2',
                                                'productUnit3',
                                                'productRatio3',
                                            ]}
                                            search={['productCode', 'productBarcode', 'productName']}                                            
                                            blacklist={pop.input.detail.map(o => o.popdetProductId)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label={`Qty ${pop.inputdet.popdetUnit !== undefined ? ' (per ' + pop.inputdet.popdetUnit + ')' : ''}`}
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={pop.inputdet.popdetQty || ''}
                                                onChange={val => pop.inputdet.popdetQty = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Satuan"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={pop.inputdet.popdetRatio}
                                            onChange={(val, item) => {                                                
                                                pop.inputdet.popdetRatio = val
                                                pop.inputdet.popdetUnit = item.unit
                                            }}
                                            items={pop.store.unit}
                                            id="ratio"
                                            label="unit"
                                            text={item => `${item.unit}`}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-6 col-md-7 col-sm-9 col-xs-12">
                                    <FormGroup
                                        label="Keterangan"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={pop.inputdet.popdetDescription || ''}
                                                onChange={e => pop.inputdet.popdetDescription = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12 text-right">
                                    <Observer>{() =>
                                        <Button
                                            disabled={
                                                !pop.inputdet.popdetProductId ||
                                                !pop.inputdet.popdetQty ||
                                                !pop.inputdet.popdetRatio ||
                                                !pop.inputdet.popdetUnit
                                            }
                                            icon="plus"
                                            text="Tambah"
                                            intent="warning"
                                            className="button-input"
                                            onClick={() => pop.detail._handleAdd()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                            <div className="grid">                            
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <TableDetail {...pop.detail} data={pop.input.detail} />
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Divider />
                                </div>
                                <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12">
                                    <FormGroup
                                        label="Keterangan"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={pop.input.popDescription || ''}
                                                onChange={e => pop.input.popDescription = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4 col-md-2 col-sm-12 col-xs-12 text-right">
                                    <Observer>{() =>
                                        <Button
                                            loading={pop.loading}
                                            disabled={!pop.input.popDepartmentId || pop.input.detail.length === 0}
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? pop._create() : pop._update()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                :
                <PageUnauthorized />
        )
    }
}

export default observer(PopInput)
import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea, Label, Switch, HTMLTable, Divider } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';
import moment from 'moment';

import { HeaderView, Select, DateGroup, TableDetail, NumberGroup, Autocomplete, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';
import { po } from './poview';


class PoInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        po._getDepartment()
        if (path[2] === "add") {
            document.title = `Tambah ${po.title} | ${global.appname}`            
            po.input = { 
                poDate: new Date(),
                detail: [],
            }
            po.inputdet = {}
            po.other.var = {}
            
            if (path[3]) {
                po.other._copyDetail(path[3])                
            }
        } else {
            document.title = `Ubah ${po.title} | ${global.appname}`
            po._getById(path[3])
        }        
        po.detail.deleteId = []
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'po').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"
        const isDirect = isAdd && path[3] ? false : !(po.input.poPopId)         
        return (
            menu.indexOf(path[2]) !== -1 && !(path[2] === "edit" && po.input.poState !== 1) ?
                <div className="clover-paper">
                    <div className="clover-container">                        
                        <HeaderView
                            title={`
                                ${isAdd ? "Tambah" : "Ubah"} ${po.title} ${po.input.poCodeTrans || ''} 
                                ${po.other.var.popCodeTrans ? ' ( referensi Pre Order Pembelian ' + po.other.var.popCodeTrans +' )' : ''}`
                            }
                            btnTooltip={isAdd && path[3] ? `Kembali ke Pre Order Pembelian` : `Kembali ke ${po.title}`}
                            btnIcon={path[2] === 'add' && path[3] ? "arrow-left" : "delete"}
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? (path[3] ? `/pop/view` : `view`) : `../view`}
                        />

                        <form className="form">
                            {!(path[2] === 'add' && path[3]) && isAdd && <div className="grid">
                                <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <Observer>{() =>
                                        <Switch 
                                            label="Referensi dari nomor Pre Order Pembelian"
                                            checked={po.other.var.refPop || false}
                                            onChange={() => po.other.var.refPop = !po.other.var.refPop} 
                                            className="checkbox"
                                            disabled={path[3]}                                            
                                        />
                                    }</Observer>
                                </div>
                                {po.other.var.refPop && <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="No. transaksi Pre Order Pembelian"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Autocomplete
                                            value={po.other.var.popId}
                                            onChange={(val, item) => {
                                                po.other.var.popId = val                                                
                                                po.other._copyDetail(val)
                                            }}
                                            id="popId"
                                            label="popCodeTrans"
                                            text={item => `${moment(item.popDate).format('DD MMM YYYY')} - ${item.popCodeTrans} - ${item.departmentName}`}
                                            remoteUrl="pop"
                                            column={[
                                                'popDate',
                                                'popCodeTrans',                                                
                                                'departmentName',
                                            ]}
                                            search={['popDate', 'popCodeTrans','departmentName']}
                                        />
                                    </FormGroup>
                                </div>}
                            </div>}
                            <div className="grid">
                                <div className="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                    <FormGroup
                                        label="Tanggal transaksi"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <DateGroup
                                                value={po.input.poDate}
                                                onChange={date => po.input.poDate = date}
                                                disabled
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-6 col-md-7 col-sm-7 col-xs-12">
                                    <FormGroup
                                        label="Referensi"
                                        helperText="Dapat digunakan sebagai penanda transaksi"
                                    >
                                        <Observer>{() =>
                                            <InputGroup
                                                value={po.input.poRef || ''}
                                                onChange={e => po.input.poRef = e.target.value}
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
                                            value={po.input.poDepartmentId}
                                            onChange={val => po.input.poDepartmentId = val}
                                            items={po.store.department}
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
                                                value={po.input.poDateRequired}
                                                onChange={date => po.input.poDateRequired = date}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div> 
                            </div>
                            <div className="grid">                                
                                <div className="col-lg-5 col-md-6 col-sm-7 col-xs-12">
                                    <FormGroup
                                        label="Suplier"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Autocomplete
                                            value={po.input.poVendorId}
                                            onChange={(val, item) => {
                                                po.input.poVendorId = val                                                
                                            }}
                                            id="vendorId"
                                            label="vendorName"
                                            placer={po.input.vendorPlacer}
                                            text={item => `${item.vendorCode} - ${item.vendorName}`}
                                            remoteUrl="vendor"
                                            column={[
                                                'vendorCode',
                                                'vendorName',
                                            ]}
                                            search={['vendorCode', 'vendorName']}
                                        />
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
                            {isDirect && <>
                            <div className="grid">
                                <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="Produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Autocomplete
                                            value={po.inputdet.podetProductId}
                                            onChange={(val, item) => {
                                                po.inputdet.podetProductId = val
                                                let result = [1,2,3].map(i => {
                                                    const a = {}
                                                    a["unit"] = item[`productUnit${i}`]
                                                    a["ratio"] = item[`productRatio${i}`]
                                                    return a
                                                }).filter(o => o.unit !== '')                                                
                                                po.store.unit = result
                                                po.inputdet.productCode = item.productCode
                                                po.inputdet.productName = item.productName
                                                po.inputdet.podetRatio = 1
                                                po.inputdet.podetUnit = result[0].unit
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
                                            blacklist={po.input.detail.map(o => o.podetProductId)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label={`Qty ${po.inputdet.podetUnit !== undefined ? ' (per ' + po.inputdet.podetUnit + ')' : ''}`}
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={po.inputdet.podetQty || ''}
                                                onChange={val => po.inputdet.podetQty = val}
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
                                            value={po.inputdet.podetRatio}
                                            onChange={(val, item) => {                                                
                                                po.inputdet.podetRatio = val
                                                po.inputdet.podetUnit = item.unit
                                            }}
                                            items={po.store.unit}
                                            id="ratio"
                                            label="unit"
                                            text={item => `${item.unit}`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label={`Harga ${po.inputdet.podetUnit !== undefined ? ' (per ' + po.inputdet.podetUnit + ')' : ''}`}
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={po.inputdet.podetPrice || ''}
                                                onChange={val => po.inputdet.podetPrice = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label={`Diskon ${po.inputdet.podetUnit !== undefined ? ' (per ' + po.inputdet.podetUnit + ')' : ''}`}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={po.inputdet.podetDisc || ''}
                                                onChange={val => po.inputdet.podetDisc = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-10 col-md-9 col-sm-12 col-xs-12">
                                    <FormGroup
                                        label="Keterangan"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={po.inputdet.podetDescription || ''}
                                                onChange={e => po.inputdet.podetDescription = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12 text-right">
                                    <Observer>{() =>
                                        <Button
                                            disabled={
                                                !po.inputdet.podetProductId ||
                                                !po.inputdet.podetQty ||
                                                !po.inputdet.podetRatio ||
                                                !po.inputdet.podetUnit ||
                                                !po.inputdet.podetPrice
                                        }
                                        icon="plus"
                                        text="Tambah"
                                        intent="warning"
                                        className="button-input"
                                            onClick={() => po.detail._handleAdd()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                            </>}
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <TableDetail {...po.detail} data={po.input.detail} />
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <Divider />
                                </div>
                                <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12">
                                    <FormGroup
                                        label="Keterangan"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={po.input.poDescription || ''}
                                                onChange={e => po.input.poDescription = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">                                    
                                    <HTMLTable striped style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <td>Total harga</td>
                                                <td className="text-right">
                                                    <Observer>{() =>
                                                        thousand(po.input.detail.reduce((total, o) => total + (o.podetQty * o.podetPrice), 0))
                                                    }</Observer>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total diskon</td>
                                                <td className="text-right">
                                                    <Observer>{() =>
                                                        thousand(po.input.detail.reduce((total, o) => total + (o.podetQty * o.podetDisc), 0))
                                                    }</Observer>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total harus bayar</td>
                                                <td className="text-right">
                                                    <Observer>{() =>
                                                        thousand(po.input.detail.reduce((total, o) => total + o.podetTotalNet, 0))
                                                    }</Observer>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </HTMLTable>
                                    <br />
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-right">
                                    <Observer>{() =>
                                        <Button
                                            loading={po.loading}
                                            disabled={
                                                !po.input.poDepartmentId || 
                                                (!po.input.poVendorId || po.input.poVendorId === 0) ||
                                                po.input.detail.length === 0
                                            }
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? po._create() : po._update()}
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

export default observer(PoInput)
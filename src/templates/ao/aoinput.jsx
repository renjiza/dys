import React, { PureComponent } from 'react';
import { Colors, Button, FormGroup, InputGroup, TextArea, Label, Switch, HTMLTable, Divider } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';
import moment from 'moment';

import { HeaderView, Select, DateGroup, TableDetail, NumberGroup, Autocomplete, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import history from '../../components/history';
import global from '../../stores/globalstore';
import { ao } from './aoview';


class AoInput extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        ao._getDepartment()
        if (path[2] === "add") {
            document.title = `Tambah ${ao.title} | ${global.appname}`            
            ao.input = { 
                aoDate: new Date(),
                detail: [],
            }
            ao.inputdet = {}
            ao.other.var = {}
            
            if (path[3]) {
                ao.other._copyDetail(path[3])                
            }
        } else {
            document.title = `Ubah ${ao.title} | ${global.appname}`
            ao._getById(path[3])
        }        
        ao.detail.deleteId = []
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'ao').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"
        const isDirect = isAdd && path[3] ? false : !(ao.input.aoAoId)         
        return (
            menu.indexOf(path[2]) !== -1 && !(path[2] === "edit" && ao.input.aoState !== 1) ?
                <div className="clover-paper">
                    <div className="clover-container">                        
                        <HeaderView
                            title={`
                                ${isAdd ? "Tambah" : "Ubah"} ${ao.title} ${ao.input.aoCodeTrans || ''} 
                                ${ao.other.var.aopCodeTrans ? ' ( referensi Pre Penerimaan Pembelian ' + ao.other.var.aopCodeTrans +' )' : ''}`
                            }
                            btnTooltip={isAdd && path[3] ? `Kembali ke Pre Penerimaan Pembelian` : `Kembali ke ${ao.title}`}
                            btnIcon={path[2] === 'add' && path[3] ? "arrow-left" : "delete"}
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? (path[3] ? `/aop/view` : `view`) : `../view`}
                        />

                        <form className="form">
                            {!(path[2] === 'add' && path[3]) && isAdd && <div className="grid">
                                <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <Observer>{() =>
                                        <Switch 
                                            label="Referensi dari nomor Pre Penerimaan Pembelian"
                                            checked={ao.other.var.refAo || false}
                                            onChange={() => ao.other.var.refAo = !ao.other.var.refAo} 
                                            className="checkbox"
                                            disabled={path[3]}                                            
                                        />
                                    }</Observer>
                                </div>
                                {ao.other.var.refAo && <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
                                    <FormGroup
                                        label="No. transaksi Pre Penerimaan Pembelian"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Autocomplete
                                            value={ao.other.var.aopId}
                                            onChange={(val, item) => {
                                                ao.other.var.aopId = val                                                
                                                ao.other._copyDetail(val)
                                            }}
                                            id="aopId"
                                            label="aopCodeTrans"
                                            text={item => `${moment(item.aopDate).format('DD MMM YYYY')} - ${item.aopCodeTrans} - ${item.departmentName}`}
                                            remoteUrl="aop"
                                            column={[
                                                'aopDate',
                                                'aopCodeTrans',                                                
                                                'departmentName',
                                            ]}
                                            search={['aopDate', 'aopCodeTrans','departmentName']}
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
                                                value={ao.input.aoDate}
                                                onChange={date => ao.input.aoDate = date}
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
                                                value={ao.input.aoRef || ''}
                                                onChange={e => ao.input.aoRef = e.target.value}
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
                                            value={ao.input.aoDepartmentId}
                                            onChange={val => ao.input.aoDepartmentId = val}
                                            items={ao.store.department}
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
                                                value={ao.input.aoDateRequired}
                                                onChange={date => ao.input.aoDateRequired = date}
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
                                            value={ao.input.aoVendorId}
                                            onChange={(val, item) => {
                                                ao.input.aoVendorId = val                                                
                                            }}
                                            id="vendorId"
                                            label="vendorName"
                                            placer={ao.input.vendorPlacer}
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
                                            value={ao.inputdet.aodetProductId}
                                            onChange={(val, item) => {
                                                ao.inputdet.aodetProductId = val
                                                let result = [1,2,3].map(i => {
                                                    const a = {}
                                                    a["unit"] = item[`productUnit${i}`]
                                                    a["ratio"] = item[`productRatio${i}`]
                                                    return a
                                                }).filter(o => o.unit !== '')                                                
                                                ao.store.unit = result
                                                ao.inputdet.productCode = item.productCode
                                                ao.inputdet.productName = item.productName
                                                ao.inputdet.aodetRatio = 1
                                                ao.inputdet.aodetUnit = result[0].unit
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
                                            blacklist={ao.input.detail.map(o => o.aodetProductId)}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Qty produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={ao.inputdet.aodetQty || ''}
                                                onChange={val => ao.inputdet.aodetQty = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Satuan produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Select
                                            value={ao.inputdet.aodetRatio}
                                            onChange={(val, item) => {                                                
                                                ao.inputdet.aodetRatio = val
                                                ao.inputdet.aodetUnit = item.unit
                                            }}
                                            items={ao.store.unit}
                                            id="ratio"
                                            label="unit"
                                            text={item => `${item.unit}`}
                                        />
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Harga satuan produk"
                                        labelInfo={<i style={{ color: Colors.RED3 }}>*</i>}
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={ao.inputdet.aodetPrice || ''}
                                                onChange={val => ao.inputdet.aodetPrice = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12">
                                    <FormGroup
                                        label="Diskon produk"
                                    >
                                        <Observer>{() =>
                                            <NumberGroup
                                                value={ao.inputdet.aodetDisc || ''}
                                                onChange={val => ao.inputdet.aodetDisc = val}
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-10 col-md-9 col-sm-12 col-xs-12">
                                    <FormGroup
                                        label="Keterangan produk"
                                    >
                                        <Observer>{() =>
                                            <TextArea
                                                value={ao.inputdet.aodetDescription || ''}
                                                onChange={e => ao.inputdet.aodetDescription = e.target.value}
                                                fill
                                            />
                                        }</Observer>
                                    </FormGroup>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-3 col-xs-12 text-right">
                                    <Observer>{() =>
                                        <Button
                                            disabled={
                                                !ao.inputdet.aodetProductId ||
                                                !ao.inputdet.aodetQty ||
                                                !ao.inputdet.aodetRatio ||
                                                !ao.inputdet.aodetUnit ||
                                                !ao.inputdet.aodetPrice
                                        }
                                        icon="plus"
                                        text="Tambah"
                                        intent="warning"
                                        className="button-input"
                                            onClick={() => ao.detail._handleAdd()}
                                        />
                                    }</Observer>
                                </div>
                            </div>
                            </>}
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <TableDetail {...ao.detail} data={ao.input.detail} />
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
                                                value={ao.input.aoDescription || ''}
                                                onChange={e => ao.input.aoDescription = e.target.value}
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
                                                        thousand(ao.input.detail.reduce((total, o) => total + (o.aodetQty * o.aodetPrice), 0))
                                                    }</Observer>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total diskon</td>
                                                <td className="text-right">
                                                    <Observer>{() =>
                                                        thousand(ao.input.detail.reduce((total, o) => total + (o.aodetQty * o.aodetDisc), 0))
                                                    }</Observer>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total harus bayar</td>
                                                <td className="text-right">
                                                    <Observer>{() =>
                                                        thousand(ao.input.detail.reduce((total, o) => total + o.aodetTotalNet, 0))
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
                                            loading={ao.loading}
                                            disabled={
                                                !ao.input.aoDepartmentId || 
                                                (!ao.input.aoVendorId || ao.input.aoVendorId === 0) ||
                                                ao.input.detail.length === 0
                                            }
                                            icon="floppy-disk"
                                            intent={isAdd ? "success" : "warning"}
                                            text={isAdd ? "Tambah" : "Perbarui"}
                                            onClick={() => isAdd ? ao._create() : ao._update()}
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

export default observer(AoInput)
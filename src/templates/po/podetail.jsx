import React, { PureComponent } from 'react';
import { Colors, Button, Label, Divider, HTMLTable } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';


import { HeaderView, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { po } from './poview';
import history from '../../components/history';
import global from '../../stores/globalstore';
import moment from 'moment';


class PoDetail extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "detail") {
            document.title = `Detail ${po.title} | ${global.appname}`
            po._getDetail(path[3])
        }      
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'po').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"

        return (
            menu.indexOf(path[2]) !== -1 && !(path[2] === "edit" && po.input.poState !== 1) ?
                <div className="clover-paper-transparent">
                    <div className="clover-container">
                        <HeaderView
                            title={`Detail ${po.title} ${po.input.poCodeTrans}`}
                            btnTooltip={`Kembali ke ${po.title}`}
                            btnIcon="delete"
                            color={Colors.RED3}
                            intent="danger"
                            btnShow={true}
                            btnLink={isAdd ? `view` : `../view`}
                        />

                        <form className="form print">
                            <div className="watermark print-off">
                                <span>
                                    {
                                        po.input.poState === 1 ? 'BELUM' :
                                            po.input.poState === 2 ? 'SEBAGIAN' :
                                                po.input.poState === 3 ? 'SELESAI' : 'TUTUP'                                
                                    }
                                </span>
                            </div>
                            <div className="grid">
                                <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                    <Label className="bold" style={{ fontSize: 15 }}>{global.control.clientName}</Label>
                                    <Label>{global.control.clientAddress}</Label>
                                    <Label>{`${global.control.clientPhone} ${global.control.clientEmail && ' (' + global.control.clientEmail + ')'}`}</Label>
                                </div>
                                <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                                    
                                </div>
                            </div>                                                        
                            <Divider />
                            <Label className="bold text-center" style={{ fontSize: 15 }}>{po.title}</Label>
                            <Divider />
                            <HTMLTable small className="print-heading">
                                <tbody>
                                    <tr>
                                        <td style={{ width: '50%' }}>
                                            <Label>
                                                No. Transaksi :
                                                <span>{po.input.poCodeTrans}</span>
                                            </Label>
                                        </td>
                                        <td>
                                            <Label>
                                                Tanggal :
                                                <span>{moment(po.input.poDate).format('DD/MM/YYYY')}</span>
                                            </Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Label>
                                                No. Referensi :
                                                <span>{po.input.poRef}</span>
                                            </Label>
                                        </td>
                                        <td>
                                            <Label>
                                                Tanggal Diminta :
                                                <span>{moment(po.input.poDateRequired).format('DD/MM/YYYY')}</span>
                                            </Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Label>
                                                Departemen :
                                                <span>{`${po.input.departmentName} (${po.input.departmentCode})`}</span>
                                            </Label>
                                        </td>
                                        <td>
                                            <Label>
                                                Suplier :
                                                <span>{`${po.input.vendorName} (${po.input.vendorCode})`}</span>
                                            </Label>
                                        </td>
                                    </tr>
                                </tbody>
                            </HTMLTable>
                            <div className="grid">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <HTMLTable small className="print-detail">
                                        <tbody>
                                            <tr>
                                                <td style={{width: "1%"}}>#</td>
                                                <td width="30%">Barang</td>
                                                <td width="15%">Qty</td>
                                                <td width="10%">Harga</td>
                                                <td width="10%">Diskon</td>
                                                <td width="15%">Net</td>
                                                <td width="15%">Total net</td>
                                                <td>Keterangan</td>
                                            </tr>
                                            {po.input.detail.map((o, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{`${o.productBarcode && `( ${o.productBarcode} ) `}${o.productCode} - ${o.productName}`}</td>
                                                    <td className="inline">
                                                        {`${thousand(o.podetQty)} ${o.podetUnit}`}
                                                        &nbsp;<span className="print-off">( sisa {`${thousand(o.podetQtyLeft)} ${o.podetUnit}`} )</span>
                                                    </td> 
                                                    <td className="inline">
                                                        {thousand(o.podetPrice)}
                                                    </td> 
                                                    <td className="inline">
                                                        {thousand(o.podetDisc)}
                                                    </td>   
                                                    <td className="inline">
                                                        {thousand(o.podetNet)}
                                                    </td> 
                                                    <td className="inline">
                                                        {thousand(o.podetTotalNet)}
                                                    </td>                                                  
                                                    <td>{o.podetDescription ? o.podetDescription : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </HTMLTable> 
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-lg-8 col-md-6 col-sm-6 col-xs-6">
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6"> 
                                    <HTMLTable small className="print-total">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <Label>
                                                        Total harga :
                                                        <span className="float-right">{thousand(po.input.detail.reduce((total, o) => total + (o.podetQty * o.podetPrice), 0))}</span>
                                                    </Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Label>
                                                        Total diskon :
                                                        <span className="float-right">{thousand(po.input.detail.reduce((total, o) => total + (o.podetQty * o.podetDisc), 0))}</span>
                                                    </Label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Label>
                                                        Total harus bayar :
                                                        <span className="float-right">{thousand(po.input.detail.reduce((total, o) => total + o.podetTotalNet, 0))}</span>
                                                    </Label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </HTMLTable>
                                </div>     
                            </div>
                            <div className="grid print-off">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                    <br />
                                    <br />
                                    <Observer>{() =>
                                        <Button
                                            icon="print"
                                            text="Cetak"
                                            onClick={() => window.print()}
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

export default observer(PoDetail)
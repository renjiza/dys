import React, { PureComponent } from 'react';
import { Colors, Button, Label, Divider, HTMLTable } from '@blueprintjs/core';
import { Observer, observer } from 'mobx-react';


import { HeaderView, thousand } from '../../components/myparts';
import { PageUnauthorized } from '../../components/async';
import { pop } from './popview';
import history from '../../components/history';
import global from '../../stores/globalstore';
import moment from 'moment';


class PopDetail extends PureComponent {

    componentDidMount() {
        const path = history.location.pathname.split('/')
        if (path[2] === "detail") {
            document.title = `Detail ${pop.title} | ${global.appname}`
            pop._getDetail(path[3])
        }      
    }

    render() {
        const menu = global.menu.filter(o => o.menuKey === 'pop').map(o => o.menuAction)
        const path = history.location.pathname.split('/')
        const isAdd = path[2] === "add"

        return (
            menu.indexOf(path[2]) !== -1 && !(path[2] === "edit" && pop.input.popState !== 1) ?
                <div className="clover-paper-transparent">
                    <div className="clover-container">
                        <HeaderView
                            title={`Detail ${pop.title} ${pop.input.popCodeTrans}`}
                            btnTooltip={`Kembali ke ${pop.title}`}
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
                                        pop.input.popState === 1 ? 'BELUM' :
                                            pop.input.popState === 2 ? 'SEBAGIAN' :
                                                pop.input.popState === 3 ? 'SELESAI' : 'TUTUP'                                
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
                            <Label className="bold text-center" style={{ fontSize: 15 }}>{pop.title}</Label>
                            <Divider />
                            <HTMLTable small className="print-heading">
                                <tbody>
                                    <tr>
                                        <td style={{ width: '50%' }}>
                                            <Label>
                                                No. Transaksi :
                                                <span>{pop.input.popCodeTrans}</span>
                                            </Label>
                                        </td>
                                        <td>
                                            <Label>
                                                Tanggal :
                                                <span>{moment(pop.input.popDate).format('DD/MM/YYYY')}</span>
                                            </Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Label>
                                                No. Referensi :
                                                <span>{pop.input.popRef}</span>
                                            </Label>
                                        </td>
                                        <td>
                                            <Label>
                                                Tanggal Diminta :
                                                <span>{moment(pop.input.popDateRequired).format('DD/MM/YYYY')}</span>
                                            </Label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <Label>
                                                Departemen :
                                                <span>{`${pop.input.departmentName} (${pop.input.departmentCode})`}</span>
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
                                                <td>Keterangan</td>
                                            </tr>
                                            {pop.input.detail.map((o, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{`${o.productBarcode && `( ${o.productBarcode} ) `}${o.productCode} - ${o.productName}`}</td>
                                                    <td className="inline">
                                                        {`${thousand(o.popdetQty)} ${o.popdetUnit}`}
                                                        &nbsp;<span className="print-off">( sisa {`${thousand(o.popdetQtyLeft)} ${o.popdetUnit}`} )</span>
                                                    </td>                                                    
                                                    <td>{o.popdetDescription ? o.popdetDescription : '-'}</td>
                                                </tr>
                                            ))}
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

export default observer(PopDetail)
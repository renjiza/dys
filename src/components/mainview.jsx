import React, { PureComponent } from 'react';
import { Tooltip, Button, Icon, Colors, H5, HTMLTable, Popover, Menu, MenuItem, Toaster, FormGroup, InputGroup, Alert } from '@blueprintjs/core';
import { Observer } from 'mobx-react-lite';

import history from './history';


export const toast = Toaster.create({
    position: 'top',
});

export function thousand(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const centering = { alignSelf: 'center' }

export class HeaderView extends PureComponent {
    render() {
        const { title, btnTooltip, btnIcon, btnShow, btnLink, intent } = this.props
        return (
            <div className="wrapHeader">
                <H5 style={{ color: Colors.INDIGO3, fontWeight: 600 }}>{title}</H5>
                {btnShow && <Tooltip content={btnTooltip} position="left" usePortal={false}>
                    <Button onClick={() => history.replace(btnLink)} minimal intent={intent} icon={btnIcon} />
                </Tooltip>}
            </div>
        )
    }
}

// ===================================================================================================================

export class TableView extends PureComponent {    

    componentDidMount() {
        this.props.params._getAll()
    }

    render() {
        const { head, order, query, id, label, privilege, _delete, access } = this.props.params
        const display = order.map(o => o.column)
        return (
            <div className="wrapTableview">                
                <HTMLTable interactive>
                    <thead>
                        <tr>
                            <th style={{ width: "1%" }}>#</th>
                            {head.map(o => (
                                <th key={o.column}>{o.label}</th>
                            ))}
                            <th style={{ width: "1%" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                            <Observer>{() =>                            
                                <>                                    
                                    {this.props.params.body
                                    .filter(data => {
                                        return display.some(key => {
                                            return data[key].toLowerCase().includes(query.filter.toLowerCase())
                                        })
                                    })
                                    .map((data, index) => (
                                        <tr key={data[id]}>
                                            <td>{index + 1}</td>
                                            {head.map(x => (
                                                <td key={x.column}>{x.render ? x.render(data[x.column]) : data[x.column]}</td>
                                            ))}
                                            <td>
                                                <ButtonAction 
                                                    icon="layout-linear" 
                                                    intent="primary" 
                                                    position="bottom-right"
                                                    useArrow={false}
                                                    content={<DataContext context={privilege} data={data} usePrivilege={true} access={access} />} 
                                                />
                                                <Confirm 
                                                    isOpen={data.isShowConfirm}
                                                    text={<>Yakin tetap menghapus <b>{data[label]}</b> ?</>}
                                                    icon="trash" 
                                                    intent="danger" 
                                                    confirmText="Hapus" 
                                                    cancelText="Batal" 
                                                    onConfirm={() => _delete(data[id], data[label])}
                                                    onCancel={() => data.isShowConfirm = false} />
                                            </td>
                                        </tr>
                                    ))}
                                    {this.props.params.body
                                    .filter(data => {
                                        return display.some(key => {
                                            return data[key].toLowerCase().includes(query.filter.toLowerCase())
                                        })
                                    }).length === 0 
                                    &&  <tr style={{ backgroundColor: '#f4f8f9' }}>
                                            <td colSpan={head.length + 2} style={{ textAlign: 'center', color: Colors.RED3 }}>
                                                <Icon icon="database" /> No Data
                                            </td>
                                        </tr>
                                    }
                                </>
                            }</Observer>
                    </tbody>
                </HTMLTable>
            </div>
        )
    }
}

const Confirm = ({ isOpen, text, icon, intent, confirmText, cancelText, onConfirm, onCancel }) => (
    <Alert
        canEscapeKeyCancel
        canOutsideClickCancel
        cancelButtonText={cancelText}
        confirmButtonText={confirmText}
        icon={icon}
        intent={intent}
        isOpen={isOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
    >
        <p>{text}</p>
    </Alert>
)

const Context = ({ context }) => (
    <Menu>
        {context.map((o, i) => (
            <MenuItem key={i} onClick={() => o.action()} icon={o.icon} text={o.label} />
        ))}
    </Menu>
)

const DataContext = ({ context, data, usePrivilege, access = [] }) => (
    <Menu>
        {context.length > 0 && context.map((o, i) => (
            usePrivilege ? 
            (access.indexOf(o.key) !== -1 && <MenuItem key={i} onClick={() => o.action(data)} icon={o.icon} text={o.label} />)
            :
            <MenuItem key={i} onClick={() => o.action(data)} icon={o.icon} text={o.label} />
        ))}
    </Menu>
)

const ButtonAction = ({ position, content, icon, color, intent, useArrow }) => (
    <Popover content={content} position={position || "bottom"} usePortal={false} modifiers={{ arrow: { enabled: useArrow} }}>
        <Button minimal small intent={intent}>
            <Icon icon={icon} color={color} iconSize={13} />
        </Button>
    </Popover>
)


export class ToolView extends PureComponent {
    render() {
        const { order, query, _getAll } = this.props.params
        const display = order.map(o => o.column)
        const sort = [
            { label: "asc", column: "asc", action: () => { query.sort = "asc"; _getAll()} },
            { label: "desc", column: "desc", action: () => { query.sort = "desc"; _getAll()} },
        ]        
        return (
            <div className="grid" style={{color: Colors.GRAY3}}>
                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12" style={centering}>
                    <Observer>{() =>
                        thousand(this.props.params.body
                            .filter(data => {
                                return display.some(key => {
                                    return data[key].toLowerCase().includes(query.filter.toLowerCase())
                                })
                            }).length)
                    }</Observer> Total
                </div>
                <div className="col-lg-7 col-md-7 col-sm-5 col-xs-12" style={centering}>
                    Diurutkan dari: &nbsp;
                    <Observer>{() =>
                        <Popover content={<Context context={order} />} position="bottom" usePortal={false}>
                            <Button minimal>
                                {query.orderLabel} &nbsp; <Icon icon="caret-down" />
                            </Button>
                        </Popover>
                    }</Observer>
                    <Observer>{() =>
                        <Popover content={<Context context={sort} />} position="bottom" usePortal={false}>
                            <Button minimal>
                                {query.sort} &nbsp; <Icon icon="caret-down" />
                            </Button>
                        </Popover>
                    }</Observer>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-4 col-xs-12" style={{ ...centering, ...{ float: "right" }}}>
                    <FormGroup>
                        <Observer>{() =>
                            <InputGroup
                                rightElement={<Button minimal icon="search-text" onClick={() => _getAll()} />}
                                placeholder="Cari"
                                value={query.filter || ""}
                                onChange={e => query.filter = e.target.value}
                            />
                        }</Observer>
                    </FormGroup>
                </div>
            </div>
        )
    }
}
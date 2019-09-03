import React, { PureComponent } from 'react';
import { Tooltip, Button, Icon, Colors, H5, HTMLTable, Popover, Menu, MenuItem, Toaster, FormGroup, InputGroup, Alert } from '@blueprintjs/core';
import { Select as BpSelect } from "@blueprintjs/select";
import { Observer } from 'mobx-react-lite';
import moment from 'moment';
import MomentLocaleUtils from 'react-day-picker/moment';

import history from './history';
import { DateInput } from '@blueprintjs/datetime';


export const toast = Toaster.create({
    position: 'top',
})

export const toastSuccess = (msg, icon = 'tick-circle') => toast.show({
    message: msg,
    intent: 'success',
    icon: icon,
})

export const toastError = (msg, icon = 'warning-sign') => toast.show({
    message: msg,
    intent: 'danger',
    icon: icon,
})

export const toastCatch = () => toast.show({
    message: 'Kesalahan saat memproses data, silakan hubungi developer',
    intent: 'danger',
    icon: 'warning-sign',
})

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
        const { head, query, id, label, privilege, _delete } = this.props.params
        const display = head.map(o => o.column)
        return (
            <div className="wrapTableview">                
                <HTMLTable interactive bordered>
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
                                                content={<ActionContext data={data} privilege={privilege} access={this.props.access} />} 
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

const ActionContext = ({ data, privilege, access = [] }) => (
    <Menu>
        {privilege.length > 0 && privilege.map((o, i) => (
            <MenuItem key={i} onClick={() => o.action(data)} icon={o.icon} text={o.label} disabled={access.findIndex(x => x.menuKey === o.key && x.menuAction === o.act) === -1} />
        ))}
    </Menu>
)

const ButtonAction = ({ position, content, icon, color, intent }) => (
    <Popover minimal content={content} position={position || "bottom"} usePortal={false}>
        <Button minimal small intent={intent}>
            <Icon icon={icon} color={color} iconSize={13} />
        </Button>
    </Popover>
)


export class ToolView extends PureComponent {
    render() {
        const { head, query, _getAll } = this.props.params
        const display = head.map(o => o.column)
        const sort = [
            { label: "asc", column: "asc", action: () => { query.sort = "asc"; _getAll()} },
            { label: "desc", column: "desc", action: () => { query.sort = "desc"; _getAll()} },
        ]        
        return (
            <div className="grid" style={{color: Colors.GRAY3}}>
                <div className="col-lg-2 col-md-2 col-sm-3 col-xs-12" style={centering}>
                    <Observer>{() =>
                        thousand(this.props.params.body.filter(data => {
                                return display.some(key => {
                                    return data[key].toLowerCase().includes(query.filter.toLowerCase())
                                })
                            }).length)
                    }</Observer> Total
                </div>
                <div className="col-lg-7 col-md-7 col-sm-5 col-xs-12" style={centering}>
                    Diurutkan dari: &nbsp;
                    <Observer>{() =>
                        <Popover content={<Context context={head} />} position="bottom" usePortal={false}>
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

export class Select extends PureComponent {

    state = {
        item : null,
    }

    componentDidUpdate() {
        const { id, items, value } = this.props
        const index = items.findIndex(o => o[id] === value)
        const item = items[index]
        if (this.state.item !== item) {
            this.setState({ item: item })
        }
    }

    render() {
        const { items, label, disabled, placeholder } = this.props
        const { item } = this.state
        return (
            <BpSelect
                items={items}
                itemPredicate={(query, item, index, exactMatch) => this.filterItem(query, item, index, exactMatch)}
                itemRenderer={(item, handler) => this.itemRendererHandler(item, handler, this.props)}
                noResults={<MenuItem disabled={true} text="Tidak ada data." />}
                onItemSelect={item => this.itemSelectHandler(item)}
                popoverProps={{ minimal: true }}
                className="myselect"
            >
                <Button
                    fill
                    rightIcon="double-caret-vertical"
                    text={item ? item[label] : <div style={{ color: Colors.GRAY2 }}>{(placeholder ? placeholder : ' - ')}</div>}
                    disabled={disabled}
                />
            </BpSelect>
        )
    }    

    filterItem = (query, item, _index, exactMatch) => {
        const { text, rightText } = this.props
        const label = `${text(item)} ${rightText && rightText(item)}`.toLowerCase()
        const normalizedLabel = label.toLowerCase()
        const normalizedQuery = query.toLowerCase()

        if (exactMatch) {
            return normalizedLabel === normalizedQuery
        } else {
            return label.indexOf(normalizedQuery) !== -1
        }
    }

    itemSelectHandler = item => {
        const { id, onChange } = this.props
        onChange(item[id])
        this.setState({ item })
    }

    itemRendererHandler = (item, { handleClick, modifiers, query }) => {
        const { id, text, rightText } = this.props
        const label = text(item)
        const rightLabel = rightText && <i>{rightText(item)}</i>
        return (
            <MenuItem
                disabled={modifiers.disabled}
                label={rightLabel}
                key={item[id]}
                onClick={handleClick}
                text={highlightText(label, query)}
            />
        )
    }
}

function highlightText(text, query) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars(text) {
    return text.replace(/([.*+?^=!:${}()|\\[\\])/g, "\\$1");
}

export class InputDate extends PureComponent {
    render() {
        const { value, onChange, placeholder } = this.props
        const today = new Date()
        const maxdate = new Date((today.getFullYear() + 5), 5, 5);
        const mindate = new Date(1945, 7, 17);
        return (
            <DateInput
                formatDate={date => this.formatDateHandler(date)}
                parseDate={string => this.parseDateHandler(string)}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                popoverProps={{ position: "bottom" }}
                locale="en"
                showActionsBar={true}
                localeUtils={MomentLocaleUtils}                
                className="datefill"
                dayPickerProps={{
                    months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
                    weekdaysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
                }}
                minDate={mindate}
                maxDate={maxdate}
            />
        )
    }
 
    formatDateHandler(date) {
        return moment(date).format('DD-MM-YYYY')
    }

    parseDateHandler(string) {
        return moment(string, 'DD-MM-YYYY').toDate()
    }
}
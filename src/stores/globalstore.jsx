import { observable } from 'mobx';


const global = observable({
    appname: 'DYS Resources',    
    menu: [],    
    control: {
        userid: null,
        email: null,
        fullname: null,
        clientId: null,
        clientname: null,
        branchId: null,
        branchname: null,
    },
    cookie: {
        client: null,
        branch: null,
        user: null,
    },
    takeDiff(obj1, obj2) {
        let objNew = {}
        const obj1Key = Object.keys(obj1)
        obj1Key.map(key => {
            if (obj1[key] !== obj2[key]) objNew[key] = obj1[key]
            return true
        })
        return objNew
    }
})

export default global
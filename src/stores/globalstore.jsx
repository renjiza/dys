import { observable } from 'mobx';
import _ from 'lodash';

import { socket } from '../components/xhr';
import { login } from '../templates/login';
import { toastWarning } from '../components/myparts';


const global = observable({
    appname: 'Clover',    
    menu: [],  
    menuNotificationOld: [],
    notification: [],  
    notificationPopoverOpen: false, 
    control: {
        userId: null,
        userEmail: null,
        userPassword: null,
        userFullname: null,
        userSuper: null,
        userToken: null,
        token: null,
        clientId: null,
        clientName: null,
        clientEmail: null,
        clientPhone: null,
        clientAddress: null,
        clientLogo: null,
        branchId: null,
        branchName: null,
    },
    cookie: {
        client: null,
        branch: null,
        user: null,
        fullname: null,
    },

    _listener () {
        socket.off('notify user already login')
        socket.on('notify user already login', msg => {
            console.log('[notify user already login]', msg)
            toastWarning(msg.content)
        })

        socket.off('connected')
        socket.on('connected', msg => {
            console.log('[connected]', msg)
        })

        //ketika diskonek dari socket
        socket.off('disconnected')
        socket.on('disconnected', msg => {
            console.log('[disconnected]', msg)
        })
        
        //ketika hak akses diupdate
        socket.off('privilege updated')
        socket.on('privilege updated', msg => {
            console.log('[privilege updated]', msg)
            global.notification.unshift(msg)
            login._getMenuByToken()
        })

        //ketika data user diupdate
        socket.off('user updated')        
        socket.on('user updated', msg => {
            console.log('[user updated]', msg)
            global.notification.unshift(msg)
            login._checkSession().then(() => login._getMenuByToken())
        })

        //ketika data klien diupdate
        socket.off('client updated')        
        socket.on('client updated', msg => {
            if (global.cookie.user !== msg.senderId) {
                global.notification.unshift(msg)
            }
            login._checkSession()
        })
    },

    getDifference(object, base) {
        function changes(object, base) {
            return _.transform(object, function (result, value, key) {
                if (!_.isEqual(value, base[key])) {
                    result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
                }
            });
        }
        const a = changes(object, base);
        return a
    },    
})

export default global
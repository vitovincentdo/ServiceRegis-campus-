import Controller from '@ember/controller';
import { later } from '@ember/runloop';


export default Controller.extend({
    tempName: '',
    // fullName: '',
    // result:null,
    // actions:{
    //     handleData(name, email, password, username, phone){
    //         const newUser = this.store.createRecord('user',{
    //                 name,
    //                 email,
    //                 password,
    //                 username,
    //                 phone
    //         });

    //         newUser.save().then((results) =>{
    //             this.set('result', results);
    //         })
    //         // console.log(name);
    //         // console.log(email);
    //         // console.log(password);
    //         // console.log(username);
    //         // console.log(phone);
    //     }
    // }
    actions: {
        handleData(name){
            const _this = this;
            const duration = 2000;
            this.set('tempName', name);
            const newName = this.store.createRecord('data', {name:name});
            newName.save();
            // later(function(){
            //     _this.transitionToRoute('user');
            // }, duration);
        },
        willTransition() {
            // rollbackAttributes() removes the record from the store
            // if the model 'isNew'
            this.controller.get('model').rollbackAttributes();
        }
    }
});

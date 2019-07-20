import Component from '@ember/component';
import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { computed } from '@ember/object';
import { match, not, equal, and } from '@ember/object/computed';
import { isEqual } from '@ember/utils';
// import fs from 'npm:fs';
import buffer from 'npm:buffer';
// import { Buffer } from 'buffer';
// import { fs } from 'fs';
// import Buffer from 'npm:Buffer';
import requireModule from 'ember-require-module';
// import base64ToImage from 'npm:base64-to-image';
// import Base64Decode from 'npm:base64-stream';
import { set } from '@ember/object';

export default Component.extend({
    newName: '',
    emailAddress: '',
    newPassword: '',
    passwordConfirm: '',
    newUsername: '',
    newPhoneNumber: '',
    dataUri: null,
    isDisabled: true,
    gender:'',
    age:'',
    sound:'',


    isValid: match('newName', /\w{1,}/),
    isValid1: match('emailAddress', /^.+@.+\..+$/),
    isValid2: match('newPhoneNumber', /\d{10,11}/),
    isValid3: match('newPassword', /.{1,}/),
    isValid4: false,
    isValid5: match('newUsername', /.{1,}/),

    isDisabled6: and('isValid', 'isValid1', 'isValid2', 'isValid3', 'isValid4', 'isValid5'),
    isDisabled7: not('isDisabled6'),
    // isDisabled2: function(){
    //     if(not(isValid) && not(isValid2)){
    //         return true;
    //     }
    // },

    actions: {
        updateFirstName(){
            let password = this.get('newPassword');
            let passwordConfirm = this.get('passwordConfirm');
            if(password == passwordConfirm){
                this.set('isValid4', true);
                // console.log(this.get('isValid4'))
            }
            if(password != passwordConfirm){
                this.set('isValid4', false);
                // console.log(this.get('isValid4'))
            }
        },
        didSnap(dataUri) {
            const _this = this;
            const delay = 1000;
            const url = "https://api2.online-convert.com/jobs";
            const apikey = "2fef8626edb26816af115343ddf1dc1e";
            const headers = {
                "x-oc-api-key"      : apikey
            };
            const payload = {
                "conversion": [{
                    "target": "jpg"
                }]
            };
            $.ajax({url: url,
                headers: headers,
                type: "POST",
                async: true,
                contentType: "application/json",
                data: JSON.stringify(payload),
                dataType: "json",
                error: function(xhr,status,error){
                    // console.log('masuk error');
                    console.log(xhr + " | " + status + " | " +error);
                    $("#div1").text(xhr + " | " + status + " | " +error);
                },
                success: function(returnData){
                    // console.log('masuk success');
                    // const parseData = JSON.parse(returnData);
                    const checkData = get(returnData,'server');
                    const id = get(returnData,'id');
                    const buildLink = checkData+'/upload-base64/'+id;
                    const payload2 = {
                        "content": String(dataUri),
                        "filename": "image"
                    }
                    $.ajax({url: buildLink,
                        headers: headers,
                        type: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(payload2),
                        dataType: "json",
                        error: function(xhr,status,error){
                            // console.log('masuk error');
                            console.log(xhr + " | " + status + " | " +error);
                            $("#div1").text(xhr + " | " + status + " | " +error);
                        },
                        success: function(returnData2){
                            setTimeout(function(){
                                const url2 = "https://api2.online-convert.com/jobs/"+id
                                $.ajax({url: url2,
                                    headers: headers,
                                    type: "GET",
                                    contentType: "application/json",
                                    dataType: "json",
                                    error: function(xhr,status,error){
                                        // console.log('masuk error');
                                        console.log(xhr + " | " + status + " | " +error);
                                        $("#div1").text(xhr + " | " + status + " | " +error);
                                    },
                                    success: function(returnData3){
                                        const data = get(returnData3.output[0], 'uri');
                                        const url3 = "https://gateway.watsonplatform.net/visual-recognition/api/v3/detect_faces?version=2018-03-19";
                                        const key = "Basic YXBpa2V5OmRHdmNpUDlHaVFLT1pwdlRlQXZBNlRHTHViYVkxSkFZTzdHeTJwajNMOFA5";
                                        const headers2 = {
                                            "Authorization"         : key
                                        };
                                        const fd = new FormData();
                                        fd.append("url", data);
                                        // const payload3 = {
                                        //     "url": String(data)
                                        // }
                                        $.ajax({url:url3,
                                            "async": true,
                                            "crossDomain": true,
                                            "method": "POST",
                                            "processData": false,
                                            "contentType": false,
                                            "mimeType": "multipart/form-data",
                                            headers: headers2,
                                            data: fd,
                                            error: function(xhr,status,error){
                                                // console.log('masuk error');
                                                console.log(xhr + " | " + status + " | " +error);
                                                $("#div1").text(xhr + " | " + status + " | " +error);
                                            },
                                            success: function(returnData4){
                                                const parsedJson = JSON.parse(returnData4);
                                                const shortcutFace = parsedJson.images[0].faces[0];
                                                // console.log('masuk success');
                                                if(!isEmpty(shortcutFace)){
                                                    const gender = get(shortcutFace.gender, 'gender');
                                                    const age = get(shortcutFace.age, 'max');
                                                    set(_this, 'isDisabled', false);
                                                    set(_this, 'gender', gender);
                                                    set(_this, 'age', age);
                                                }
                                                else{
                                                    set(_this, 'isDisabled', true);
                                                    set(_this, 'gender', '');
                                                    set(_this, 'age', '');
                                                }
                                            }
                                        })
                                        // console.log("masuk success");
                                    }
                                })
                            }, delay);
                            // console.log('masuk success');
                        }
                    })
                }
            })
            // const canvas = document.getElementById("tools_sketch");
            // const ctx = canvas.getContext("2d");

            // const image = new Image();
            // image.onload = function() {
            //     ctx.drawImage(image, 0, 0);
            // };
            // image.src = dataUri;

            // const img = canvas.toDataURL("image/png");
            // console.log(img);
            // const USER_ID = "fd78c0b1a412a5145234";
            // const USER_KEY = "e7e3bc486dc15a93e7c8";
            // const notFormated =  dataUri;
            // const formatted = notFormated.split(',');
            // const IMAGE_URL = String(formatted[1]);
            // const payload  = { "image_attr" : IMAGE_URL};
            // const url = "http://facexapi.com/get_image_attr?face_det=1"; //face attribute url
            // const headers = {
            //         "user_id"          : USER_ID,
            //         "user_key"         : USER_KEY
            // };
            // $.ajax({url: url,
            //     headers  : headers,
            //     type: "POST",
            //     async : true,
            //     mimeType : "multipart/form-data",
            //     data: payload,
            //     dataType: "text",
            // error: function(xhr,status,error){
            //     console.log(xhr + " | " + status + " | " +error);
            //     $("#div1").text(xhr + " | " + status + " | " +error);
            // },
            // success: function(returnData){
            //     const parseData = JSON.parse(returnData);
            //     const checkData = get(parseData,'face_id_0');
            //     console.log(isEmpty(checkData));
            //     if(!isEmpty(checkData)){
            //         const genderData = get(checkData,'gender').toUpperCase();
            //         const ageData = get(checkData,'age');
            //         this.set('isDisabled', false);
            //         this.set('gender', genderData);
            //         this.set('age', ageData);
            //     }
            //     else{
            //         this.set('isDisabled', true);
            //         this.set('gender', '');
            //         this.set('age', '');
            //     }
            //     console.log(checkData);
            // }.bind(this)
            // })
            // // Delivers a data URI when snapshot is taken.
            // this.set('dataUri', dataUri);
        },
        didError(error) {
        // Fires when a WebcamError occurs.
        console.error(error);
        },
        saveNewUser(){
            // const _this = this;
            const fullName = this.get('newName');
            
            this.get('controllerActionThatWasPassedIn')(fullName);
            // const newName = this.get('store').createRecord('passData', {fullName: fullName});
            // newName.save();

            // const name = this.get('newName');
            // const email = this.get('emailAddress');
            // const password = this.get('newPassword');
            // const username = this.get('newUsername');
            // const phone = this.get('newPhoneNumber');
            // this.get('controllerActionThatWasPassedIn')(name, email, password, username, phone);
            // this.set('newName', '');
            // this.set('emailAddress', '');
            // this.set('newPassword', '');
            // this.set('newUsername', '');
            // this.set('newPhoneNumber', '');
            // this.set('passwordConfirm', '');

            // const key = "Basic YXBpa2V5OmlPbTQxUWNSUzlWMC15ZlAyMldwWkEzMnlyTTBfSFFHOE0xSmxEYTUxRm5f";
            // const url = "https://gateway-tok.watsonplatform.net/text-to-speech/api/v1/synthesize";
            // const payload = {
            //     "text": "hello world"
            // };
            // const headers = {
            //     "Accept": "audio/wav",
            //     "Authorization": key
            // };

            // $.ajax({url: url,
            //     headers: headers,
            //     type: "POST",
            //     contentType: "application/json",
            //     data: JSON.stringify(payload),
            //     async: true,
            //     responseType: "arraybuffer",
            //     error: function(xhr,status,error){
            //         // console.log('masuk error');
            //         console.log(xhr + " | " + status + " | " +error);
            //         $("#div1").text(xhr + " | " + status + " | " +error);
            //     },
            //     success: function(returnData){
                    // console.log(returnData.length);
                    // const length = new ArrayBuffer(returnData.length);
                    // const view = new Uint8Array(ab);
                    // for (let i = 0; i < returnData.length; ++i) {
                    //     view[i] = returnData[i];
                    // }

                    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
                    // const context = new AudioContext();

                    // context.decodeAudioData(returnData).then(function(decodedData){
                    //     const source = context.createBufferSource();
                    //     source.buffer = decodedData;
                    //     source.connect(context.destination);
                    //     source.start(0);
                    // })
                    // console.log(returnData);
                    // const encoded = 
                    // const encoded = window.btoa(unescape(encodeURIComponent(returnData)));
                    // const encoded2 = "data:audio/wav;base64,"+ encoded;
                    // console.log(encoded);
                    // this.$('audio #source').attr('src', encoded2);
                    // console.log(this.$('audio #source'));
                    // this.$('audio').get(0).load();
                    // this.$('audio').get(0).play();
                    // set(_this, 'sound', result.wav);
                    // console.log('masuk success');
                    // set(_this, 'sound', returnData);
                    // console.log(returnData);
                    // console.log("masuk success");
            //     }.bind(this)
            // })

            // const newUser = this.get('store').createRecord('user',{
            //     name: name,
            //     email: email,
            //     password: password,
            //     username: username,
            //     phone: phone
            // });
            // newUser.save().then(response => {
            //     this.set('newName', '');
            //     this.set('emailAddress', '');
            //     this.set('newPassword', '');
            //     this.set('newUsername', '');
            //     this.set('newPhoneNumver', '');
            // });
        }
    }
});

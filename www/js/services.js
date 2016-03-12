/// <reference path="../lib/ionic/js/angular/angular.js" />

angular.module('starter.services', [])

.factory('Chats', function () {
    var lsKey = "allEmployees";
    var apiBaseUrl = 'http://lazyrest287227634.sinaapp.com/api/';
    // Some fake testing data
    var chats = [
        //{
        //    id: 0,
        //    name: 'Ben Sparrow',
        //    lastText: 'You on your way?',
        //    face: 'img/no-pic.png'
        //}
    ];


    var divisionList = [];


    function getToken() {
        var dtd = $.Deferred();

        $.post(apiBaseUrl + 'user/get_token/', { 'account': '', 'password': '' },
        function (data) {
            //console.log(data);
            //alert( data );
            var data_obj = jQuery.parseJSON(data);

            if (data_obj.err_code != 0) {
                alert('error when login.');
            }
            else {
                if ((parseInt(data_obj.data.uid) < 1) || (data_obj.data.token.length < 4))
                    alert('The server is busy.' + data_obj.data.uid + '~' + data_obj.data.token);
                else
                    dtd.resolve(data_obj.data.token);
            }
        });

        return dtd.promise();
    }

    function loadDivisionData(token) {
        var dtd = $.Deferred();

        $.get(apiBaseUrl + 'Division/list/token=' + token + '&count=200&since_id=0', {}, function (data) {

            var ret = jQuery.parseJSON(data);

            var divisions = $.map(ret.data.items, function (m) {
                return {
                    "id": parseInt(m.id),
                    "Name": m.Name,
                    "Addr": m.Addr,
                    "Tel": m.Tel,
                    "Fax": m.Fax,
                    "ZipCode": m.ZipCode
                };
            });

            //console.log(staffs);

            divisionList = divisions;

            dtd.resolve(token);

        }, 'html');

        return dtd.promise();
    }

    function loadStaffData(token) {
        var dtd = $.Deferred();

        $.get(apiBaseUrl + 'Staff/list/token=' + token + '&count=200&since_id=0', {}, function (data) {

            var ret = jQuery.parseJSON(data);

            /*
            //return obj:
            [{
                "id": "2",
                "Name": "\u6f58\u7ecd\u5e7f",
                "Gender": "0",
                "Tel": "63819908",
                "Ext": "3748",
                "Mobile01": "13801685049",
                "Mobile02": "",
                "Email": "pansg@it.dch.com.cn",
                "DivisionId": "0"
            }
            
            */

            var staffs = $.map(ret.data.items, function (m) {
                if (m.IsActive === '1') {
                    return {
                        "id": parseInt(m.id),
                        "name": m.Name,
                        "title": "Staff",
                        "division": findDivisionName(m.DivisionId),
                        "cellPhone": formatCellphone(m.Mobile01),
                        "cellPhone02": formatCellphone(m.Mobile02),
                        "officePhone": m.Tel,
                        "ext": m.Ext,
                        "email": m.Email,
                        "city": "",
                        "face": m.hasPic == "1" ? "img/" + m.id + ".png" : "img/no-pic.png",
                        "pinyinFull": m.pinyinFull,
                        "pinyinInitial": m.pinyinInitial,
                        "showMobile02": m.Mobile02.length > 0
                    };
                }
            });

            //console.log(staffs);

            chats = staffs;
            localStorage.setItem(lsKey, JSON.stringify(staffs));

            dtd.resolve();

        }, 'html');

        return dtd.promise();
    }


    function findDivisionName(id) {
        var name = "";

        for (var i = 0; i < divisionList.length; i++)
            if (divisionList[i].id == id)
                return divisionList[i].Name.substring(0, 2);

        return "";
    }

    function formatCellphone(cellphone) {
        var reg = /^([1-9]{3})([0-9]{4})([0-9]{4})$/;

        if (cellphone && reg.test(cellphone))
            return cellphone.replace(reg, "$1-$2-$3");

        return cellphone;
    }


    function loadDataFromLocal() {
        var str = localStorage.getItem(lsKey);
        if (str)
        {
            chats = JSON.parse(localStorage.getItem(lsKey));
            return true;
        }
        else
            return false;
    }


    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
            if (chats.length == 0)
                loadDataFromLocal();

            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        },
        search: function (s) {
            var arr = [];
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].name.indexOf(s) > -1 ||
                    chats[i].pinyinFull.indexOf(s.toLowerCase()) > -1 ||
                    chats[i].pinyinInitial.indexOf(s.toLowerCase()) > -1) {
                    arr.push(chats[i]);
                }
            }
            return arr;
        },
        load: function (callback,fromRemote) {
            //$.when(getToken()).then(loadDivisionData).then(loadStaffData).then(callback);

            if (loadDataFromLocal() == false || fromRemote) {
                $.when(loadDivisionData('fake_token')).then(loadStaffData).then(callback);
            }
            else {
                callback();
            }
        },
        refresh: function (callback) {
            $.when(loadDivisionData('fake_token')).then(loadStaffData).then(callback);
        }
    };
})
;
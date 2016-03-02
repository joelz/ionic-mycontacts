angular.module('starter.services', [])

.factory('Chats', function () {

    var apiBaseUrl = 'http://lazyrest287227634.sinaapp.com/api/';
    // Some fake testing data
    var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'img/no-pic.png'
    }

    ];


    var divisionList = [];

    
    function getToken() {
        var dtd = $.Deferred();

        $.post(apiBaseUrl + 'user/get_token/', { 'account': 'joel', 'password': 'joel' },
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
                        "division": m.DivisionId,
                        "cellPhone": m.Mobile01,
                        "officePhone": m.Tel,
                        "ext": m.Ext,
                        "email": m.Email,
                        "city": "",
                        "face": "img/no-pic.png",
                        "pinyinFull": $.pinyin.getFullChars(m.Name),
                        "pinyinInitial": $.pinyin.getCamelChars(m.Name)
                    };
                }
            });

            //console.log(staffs);

            chats = staffs;

            dtd.resolve();

        }, 'html');

        return dtd.promise();
    }

    

    return {
        all: function () {
            return chats;
        },
        remove: function (chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function (chatId) {
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
                    chats[i].pinyinFull.indexOf(s)>-1||
                    chats[i].pinyinInitial.indexOf(s) > -1) {
                    arr.push(chats[i]);
                }
            }
            return arr;
        },
        load: function (callback) {
            $.when(getToken()).then(loadDivisionData).then(loadStaffData).then(callback);
        }
    };
});

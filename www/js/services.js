/// <reference path="../lib/ionic/js/angular/angular.js" />

angular.module('starter.services', [])

.factory('Chats', function ($q,$http) {
    var lsKey = "allEmployees";
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

    var Staff = AV.Object.extend('Staff');
    var Division = AV.Object.extend('Division');

    function loadDivisionData(token) {

        var dtd = $q.defer();

        var query = new AV.Query(Division);
        query.find({
            success: function (results) {

                var ret = JSON.parse(JSON.stringify(results));

                var divisions = [];

                angular.forEach(ret, function (m) {
                    divisions.push({
                        "id": parseInt(m.DivisionId),
                        "Name": m.Name,
                        "Addr": m.Addr,
                        "Tel": m.Tel,
                        "Fax": m.Fax,
                        "ZipCode": m.ZipCode
                    });
                });

                //console.log(divisions);

                divisionList = divisions;


                dtd.resolve(token);
            },
            error: function (aError) {
                dtd.reject(aError);
            }
        });

        return dtd.promise;
    }

    function loadStaffData(token) {

        var dtd = $q.defer();

        var query = new AV.Query(Staff);
        query.find({
            success: function (results) {

                var ret = JSON.parse(JSON.stringify(results));

                var staffs = [];
                angular.forEach(ret, function (m) {
                    if (m.IsActive === '1') {
                        staffs.push({
                            "id": parseInt(m.UserId),
                            "name": m.Name,
                            "title": "Staff",
                            "division": findDivisionName(m.DivisionId),
                            "cellPhone": formatCellphone(m.Mobile01),
                            "cellPhone02": formatCellphone(m.Mobile02),
                            "officePhone": m.Tel,
                            "ext": m.Ext,
                            "email": m.Email,
                            "city": "",
                            "face": m.hasPic == "1" ? "img/" + m.UserId + ".png" : "img/no-pic.png",
                            "pinyinFull": m.pinyinFull,
                            "pinyinInitial": m.pinyinInitial,
                            "showMobile02": m.Mobile02.length > 0
                        });
                    }
                });

                //console.log(staffs);

                chats = staffs;
                localStorage.setItem(lsKey, JSON.stringify(staffs));

                dtd.resolve(token);
            },
            error: function (aError) {
                dtd.reject(aError);
            }
        });

        return dtd.promise;

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
            //$q.when(getToken()).then(loadDivisionData).then(loadStaffData).then(callback);

            if (loadDataFromLocal() == false || fromRemote) {
                $q.when(loadDivisionData('fake_token')).then(loadStaffData).then(callback);
            }
            else {
                callback();
            }
        },
        refresh: function (callback) {
            $q.when(loadDivisionData('fake_token')).then(loadStaffData).then(callback);
        }
    };
})
;
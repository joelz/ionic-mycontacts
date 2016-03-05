angular.module('crmApp', [
    'mobiscroll-calendar',
    'mobiscroll-datetime',
    'mobiscroll-listview',
    'mobiscroll-select',
    'mobiscroll-menustrip'])
.controller('crmController', ['$scope', '$compile', '$timeout', function ($scope, $compile, $timeout) {
    var hasStorage = typeof (Storage) !== 'undefined',
        message = $('#message'),
        messageTimer,
        listviewInst,
        contacts;

    contacts = [
        {
            id: 1,
            name: 'Angelica Geary',
            image: 'images/f3.png',
            phone: '(202) 555-0190',
            company: 'Mobiscroll',
            address: '4650 Sunset Boulevard, Los Angeles, CA 90027',
            email: 'angelica.geary@gmail.com',
            categories: { 'Contacts': true, 'Leads': false, 'Accounts': false },
            phones: [
                { name: 'Home', number: '(202) 555-0107' },
                { name: 'Work', number: '(202) 555-0108' }
            ],
            emails: [
                { name: 'Home', email: 'angelica.geary@gmail.com' },
                { name: 'Work', email: 'angelica.geary@mobiscroll.com' }
            ]
        },
        {
            id: 2,
            name: 'Arlene Sharman',
            categories: { 'Accounts': false, 'Contacts': true, 'Leads': true },
            image: 'images/f2.png',
            phone: '(202) 555-0190',
            company: 'Mobiscroll',
            address: '200 Hospital Drive, Galax, VA 24333',
            email: 'arlene.sharman@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0190' },
                { name: 'Work', number: '(202) 555-0192' }
            ],
            emails: [
                { name: 'Home', email: 'arlene.sharman@gmail.com' },
                { name: 'Work', email: 'arlene.sharman@mobiscroll.com' }
            ]
        },
        {
            id: 3,
            name: 'Barry Lyon',
            categories: { 'Accounts': true, 'Contacts': false, 'Leads': true },
            image: 'images/m1.png',
            phone: '(202) 555-0193',
            company: 'Mobiscroll',
            address: '950 East Bogard Road, Wasilla, AK 99654',
            email: 'barry.lyon@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0193' },
                { name: 'Work', number: '(202) 555-0194' }
            ],
            emails: [
                { name: 'Home', email: 'barry.lyon@gmail.com' },
                { name: 'Work', email: 'barry.lyon@mobiscroll.com' }
            ]
        },
        {
            id: 4,
            name: 'Carl Hambledon',
            categories: { 'Accounts': true, 'Contacts': true, 'Leads': true },
            image: 'images/m2.png',
            phone: '(202) 555-0147',
            company: 'Mobiscroll',
            address: '2160 South 1st Avenue, Maywood, IL 60153',
            email: 'carl.hambledon@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0147' },
                { name: 'Work', number: '(202) 555-0148' }
            ],
            emails: [
                { name: 'Home', email: 'carl.hambledon@gmail.com' },
                { name: 'Work', email: 'carl.hambledon@mobiscroll.com' }
            ]
        },
        {
            id: 5,
            name: 'Hortense Tinker',
            categories: { 'Accounts': false, 'Contacts': false, 'Leads': true },
            image: 'images/f1.png',
            phone: '(202) 555-0127',
            email: 'hortense.tinker@gmail.com',
            company: 'Mobiscroll',
            address: '630 Medical Drive, Bountiful, UT 84010',
            phones: [
                { name: 'Home', number: '(202) 555-0127' },
                { name: 'Work', number: '(202) 555-0128' }
            ],
            emails: [
                { name: 'Home', email: 'hortense.tinker@gmail.com' },
                { name: 'Work', email: 'hortense.tinker@mobiscroll.com' }
            ]
        },
        {
            id: 6,
            name: 'Leilah Gregory',
            categories: { 'Accounts': false, 'Contacts': true, 'Leads': false },
            image: 'images/f4.png',
            phone: '(202) 555-0189',
            company: 'Mobiscroll',
            address: '2105 Forest Avenue, San Jose, CA 95128',
            email: 'leilah.gregory@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0189' },
                { name: 'Work', number: '(202) 555-0190' }
            ],
            emails: [
                { name: 'Home', email: 'leilah.gregory@gmail.com' },
                { name: 'Work', email: 'leilah.gregory@mobiscroll.com' }
            ]
        },
        {
            id: 7,
            name: 'Lowell Christophers',
            categories: { 'Accounts': false, 'Contacts': true, 'Leads': false },
            image: 'images/m4.png',
            phone: '(202) 555-0120',
            company: 'Mobiscroll',
            address: '6616 Washington Avenue, Ocean Springs, MS 39564',
            email: 'lowell.christophers@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0120' },
                { name: 'Work', number: '(202) 555-0121' }
            ],
            emails: [
                { name: 'Home', email: 'lowell.christophers@gmail.com' },
                { name: 'Work', email: 'lowell.christophers@mobiscroll.com' }
            ]
        },
        {
            id: 8,
            name: 'Noble Blythe',
            categories: { 'Accounts': false, 'Contacts': false, 'Leads': true },
            image: 'images/m3.png',
            phone: '(202) 555-0176',
            company: 'Mobiscroll',
            address: '1221 North Washington Street, Livingston, AL 35470',
            email: 'noble.blythe@gmail.com',
            phones: [
                { name: 'Home', number: '(202) 555-0176' },
                { name: 'Work', number: '(202) 555-0177' }
            ],
            emails: [
                { name: 'Home', email: 'noble.blythe@gmail.com' },
                { name: 'Work', email: 'noble.blythe@mobiscroll.com' }
            ]
        }
    ];

    contacts = localStorage.contacts ? JSON.parse(localStorage.contacts) : contacts;

    $scope.contacts = contacts;

    $scope.currentItems = [];

    $scope.invalidDates = [];

    $scope.categories = ['Accounts', 'Contacts', 'Leads'];

    $scope.selectedCategories = ['Accounts', 'Contacts', 'Leads'];

    $scope.appointments = hasStorage ? JSON.parse(localStorage.getItem('appointments') || '[]', function (key, value) {
        if (typeof value === 'string') {
            var parts = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

            if (parts) {
                return new Date(Date.UTC(+parts[1], +parts[2] - 1, +parts[3], +parts[4], +parts[5], +parts[6]));
            }
        }
        return value;
    }) : [];

    $scope.theme = $.mobiscroll.defaults.theme = MS.theme;

    $scope.context1 = MS.context1;

    $scope.context2 = MS.context2;

    $scope.calendarVisible = false;

    $scope.now = new Date(new Date().setMinutes(0, 0, 0));

    // Methods

    $scope.call = function (item) {
        $scope.$apply(function () {
            $scope.notify('Calling...');
            window.location.href = 'tel:' + item.data('phone');
        });
    };

    $scope.mail = function () {
        $scope.$apply(function () {
            $scope.notify('Opening mail client...');
            //window.location.href = 'mailto:' + item.data('email');
            window.location.href = 'mailto:hello@mobiscroll.com?subject=Awesome Mobiscroll Demo';
        });
    };

    $scope.navigate = function (item) {
        if (MS.mobile) {
            if ($scope.position) {
                window.location.href = 'http://maps.google.com/maps?saddr=' + $scope.position.latitude + ',' + $scope.position.longitude + '&daddr=' + item.text();
            } else {
                window.location.href = 'http://maps.google.com/maps?daddr=' + item.text();
            }
        } else {
            $('#phoneiframe').addClass('crm-phone-iframe-v');
            if ($scope.position) {
                $('#phoneiframe').attr('src', 'http://maps.google.com/maps?output=embed&saddr=' + $scope.position.latitude + ',' + $scope.position.longitude + '&daddr=' + item.text());
            } else {
                $('#phoneiframe').attr('src', 'http://maps.google.com/maps?output=embed&daddr=' + item.text());
            }
        }
    };

    $scope.changeTheme = function (theme) {
        $scope.theme = $.mobiscroll.defaults.theme = theme;

        $(document).trigger('mbsc-enhance');

        $timeout(function () {
            $scope.menuSettings.theme = theme;
            $scope.menuSettings.itemWidth = theme == 'wp' || theme == 'wp-light' || theme == 'ios' ? undefined : 80;
            $scope.menuSettings.display = theme == 'android-holo-light' || theme == 'android-holo' ? 'top' : 'bottom';
            $scope.contactSettings.theme = theme;
            $scope.categorySettings.theme = theme;
            $scope.appointmentSettings.theme = theme;
            $scope.calendarSettings.theme = theme;
            $('#tabs').mobiscroll().menustrip($scope.menuSettings);
            $('#contacts').mobiscroll().listview($scope.contactSettings);
            $('#categories').mobiscroll().select($scope.categorySettings);
            $('#calendar').mobiscroll().calendar($scope.calendarSettings);
            $('#appointments').mobiscroll().calendar($scope.appointmentSettings);
        });
    };

    $scope.selectedCategoriesText = function () {
        if ($scope.selectedCategories && $scope.selectedCategories.length === $scope.categories.length) {
            return 'All';
        }
        if (!$scope.selectedCategories || !$scope.selectedCategories.length) {
            return 'None';
        }
        return $scope.selectedCategories.join(', ');
    };

    $scope.isInCategory = function (cat) {
        var i1,
            i2;

        if (cat && $scope.selectedCategories && $scope.selectedCategories.length) {
            for (i1 in cat) {
                for (i2 = 0; i2 < $scope.selectedCategories.length; i2++) {
                    if (i1 === $scope.selectedCategories[i2] && cat[i1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    $scope.selectAllCategories = function (event, inst) {
        if (inst.getValues().length === $scope.categories.length) {
            inst.setValue([], false, 0.2, true);
            $('.dwb1', inst._markup).text('Select All');
        } else {
            var newValues = $scope.categories.slice(0);
            newValues.unshift(inst.getValue(true));
            inst.setValue(newValues, false, 0, true);
            $('.dwb1', inst._markup).text('Select None');
        }
    };

    $scope.onValueTap = function (item, inst) {
        if (inst.getValues().length === $scope.categories.length) {
            $('.dwb1', inst._markup).text('Select None');
        } else {
            $('.dwb1', inst._markup).text('Select All');
        }
        return false;
    };

    $scope.selectAppointmentDate = function (name) {
        $('#calendar').mobiscroll('show');
        $scope.appointmentContactName = name;
    };

    $scope.addAppointment = function () {
        $scope.$apply(function () {
            var d = new Date($scope.appointmentDate),
                t = $.mobiscroll.formatDate('HH:ii', d);

            $scope.invalidDates.push({
                d: d,
                start: t,
                end: t
            });

            $scope.appointments.push({
                d: d,
                text: $scope.appointmentContactName
            });

            $scope.appointments.sort(function (a, b) {
                return a.d - b.d;
            });

            $('#calendar').mobiscroll('option', 'invalid', $scope.invalidDates);

            if (hasStorage) {
                localStorage.setItem('appointments', JSON.stringify($scope.appointments));
            }

            $scope.notify('Appointment added.');
        });
    };

    $scope.editContacts = function (contactID) {
        listviewInst.navigate('ec' + contactID);
        if (!angular.equals($scope.currentItems, $scope.contacts)) {
            $.each($scope.currentItems, function (ind, val) {
                $.each(val, function (i) {
                    if (!angular.equals($scope.currentItems[ind][i], $scope.contacts[ind][i])) {
                        $scope.currentItems[ind][i] = angular.copy($scope.contacts[ind][i]);
                    }
                });
            });

            $timeout(function () {
                $(document).trigger('mbsc-refresh');
            });
        }
        $timeout(function () {
            $(window).trigger('resize');
        });
    };

    $scope.updateContacts = function (contact, index) {
        var changed = false;

        $.each(contact, function (i) {
            if (!angular.equals(contact[i], $scope.contacts[index][i])) {
                changed = true;
                $scope.contacts[index][i] = angular.copy(contact[i]);
            }
        });

        if (changed) {
            localStorage.contacts = JSON.stringify($scope.contacts);
        }

        listviewInst.navigate('c' + contact.id);
    };


    $scope.showCategoryFilter = function () {
        $('#categories').mobiscroll('show');
    };

    $scope.showCalendar = function () {
        $('#phoneiframe').removeClass('crm-phone-iframe-v');
        $('#appointments').mobiscroll('show');
        $scope.calendarVisible = true;
    };

    $scope.hideCalendar = function () {
        $('#phoneiframe').removeClass('crm-phone-iframe-v');
        $('#appointments').mobiscroll('hide');
        $scope.calendarVisible = false;
    };

    $scope.filterAdded = false;

    $scope.addFilter = function () {
        if (!$scope.filterAdded) {
            $scope.filterAdded = true;
            $(this).prepend($compile('<li data-type="filter">Display contacts: <em>{{selectedCategoriesText()}}</em></li>')($scope));
        }
    };

    $scope.initTheme = function (markup, inst) {
        if (inst.getValues().length === $scope.categories.length) {
            $('.dwb1', markup).text('Select None');
        } else {
            $('.dwb1', markup).text('Select All');
        }
        if ($scope.theme === 'wp' || $scope.theme === 'wp-light') {
            $('.dwb1', markup).addClass('mbsc-ic mbsc-ic-plus');
        }
    };

    $scope.notify = function (text) {

        $scope.message = text;

        clearTimeout(messageTimer);

        message.show();

        if (message.hasClass('crm-message-v')) {
            message.removeClass('crm-message-v');
            messageTimer = setTimeout(function () {
                message.addClass('crm-message-v');
            }, 200);
        } else {
            message.addClass('crm-message-v');
        }

        messageTimer = setTimeout(function () {
            message.removeClass('crm-message-v');
            messageTimer = setTimeout(function () {
                message.hide();
            }, 200);
        }, 2000);
    };

    $scope.categorySettings = {
        theme: $scope.theme,
        context: $scope.context1,
        animate: 'pop',
        inputClass: 'ng-hide',
        showLabel: false,
        minWidth: 260,
        rows: 3,
        buttons: ['set', { text: 'Select All', handler: $scope.selectAllCategories }, 'cancel'],
        onValueTap: $scope.onValueTap,
        onMarkupReady: $scope.initTheme
    };

    $scope.appointmentSettings = {
        theme: $scope.theme,
        layout: 'liquid',
        display: 'modal',
        context: $scope.context1,
        events: $scope.appointments,
        animate: 'pop',
        markedText: true,
        eventText: 'appt.',
        eventsText: 'appt.',
        buttons: [],
        showDivergentDays: false
    };

    $scope.calendarSettings = {
        theme: $scope.theme,
        context: $scope.context1,
        animate: 'pop',
        controls: ['date', 'time'],
        invalid: $scope.invalidDates,
        stepMinute: 30,
        minDate: $scope.now,
        onSelect: $scope.addAppointment
    };

    $scope.contactSettings = {
        theme: $scope.theme,
        swipe: false,
        iconSlide: true,
        onThemeLoad: $scope.addFilter,
        context: $scope.context2,
        enhance: true,
        itemGroups: {
            contact: {
                swipe: true,
                stages: [
                    { percent: -30, color: '#e64d4f', icon: 'foundation-mail', text: 'EMAIL', action: $scope.mail },
                    { percent: 30, color: '#4ca94e', icon: 'phone', text: 'CALL', action: $scope.call }
                ]
            },
            phone: {
                tap: $scope.call
            },
            email: {
                tap: $scope.mail
            },
            address: {
                tap: $scope.navigate
            },
            filter: {
                tap: $scope.showCategoryFilter
            },
            newAppointment: {}
        },
        onInit: function () {
            $('.contact-hdr').removeClass('mbsc-lv-parent');
            listviewInst = $('#contacts').mobiscroll('getInst');
        }
    };

    $scope.menuSettings = {
        context: $scope.context1,
        type: 'tabs',
        theme: $scope.theme,
        itemWidth: $scope.theme == 'wp' || $scope.theme == 'wp-light' || $scope.theme == 'ios' ? undefined : 80,
        display: $scope.theme == 'android-holo-light' || $scope.theme == 'android-holo' ? 'top' : 'bottom'
    };

    // Init

    $.each($scope.contacts, function (i, v) {
        $scope.currentItems.push(angular.copy(v));
    });


    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (pos) {
            $scope.position = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
        });
    }

    if (!$scope.appointments.length) {
        var today = new Date(),
            tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        $scope.appointments = [
            { d: new Date(today.setHours(8, 30, 0, 0)), text: 'Barry Lyon @ 8:30 AM' },
            { d: new Date(today.setHours(16, 0, 0, 0)), text: 'Noble Blythe @ 4:00 PM' },
            { d: new Date(tomorrow.setHours(13, 0, 0, 0)), text: 'Arlene Sharman @ 1:00 PM' }
        ];
    }

    for (var i = 0; i < $scope.appointments.length; i++) {
        var d = $scope.appointments[i].d,
            t = $.mobiscroll.formatDate('HH:ii', d);

        $scope.invalidDates.push({
            d: d,
            start: t,
            end: t
        });
    }

}]);

$(function () {
    $('#theme').change(function () {
        var scope = angular.element('html').scope();
        scope.changeTheme($(this).val(), scope.theme);
    });
});

$(window).on('load', function () {
    $('.wrapper').removeClass('loading');
});
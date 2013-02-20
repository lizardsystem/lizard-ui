/**
* @version: 1.0
* @author: Dan Grossman http://www.dangrossman.info/
* @date: 2012-08-20
* @copyright: Copyright (c) 2012 Dan Grossman. All rights reserved.
* @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
* @website: http://www.improvely.com/
*/
!function ($) {

    function equals(date1, date2) {
        return (date1 < date2) ? false : (date1 > date2) ? false : true;
    }

    var DateRangePicker = function (element, options, cb) {
        var hasOptions = typeof options == 'object'
        var localeObject;

        //state
        this.rangeType = 'custom';
        this.startDate = moment.utc().startOf('day');
        this.endDate = moment.utc().startOf('day');
        this.minDate = false;
        this.maxDate = false;
        this.ranges = {};
        this.opens = 'right';
        this.cb = function () { };
        this.format = 'MM/DD/YYYY';
        this.locale = {
            applyLabel:"Apply",
            cancelLabel:"Cancel",
            customRangeLabel:"Custom Range",
            daysOfWeek:['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay:0
        };

        localeObject = this.locale;

        this.leftCalendar = {
            month: moment(this.startDate).startOf('month'),
            calendar: Array()
        };

        this.rightCalendar = {
            month: moment(this.endDate).startOf('month'),
            calendar: Array()
        };

        //element that triggered the date range picker
        this.element = $(element);

        if (this.element.is('input')) {
            this.element.on({
                click: $.proxy(this.show, this),
                focus: $.proxy(this.show, this),
                blur: $.proxy(this.hide, this)
            });
        } else {
            this.element.on('click', $.proxy(this.show, this));
        }

        if (hasOptions) {
            if(typeof options.locale == 'object') {
                $.each(localeObject, function (property, value) {
                    localeObject[property] = options.locale[property] || value;
                });
            }
        }

        var DRPTemplate = '<div class="daterangepicker dropdown-menu">' +
                '<div class="calendar left"></div>' +
                '<div class="calendar right"></div>' +
                '<div class="ranges">' +
                  '<div class="range_inputs">' +
                    '<button class="btn btn-small btn-success pull-left">' + this.locale.applyLabel + '</button>' +
                    '<button class="btn btn-small btn-danger pull-right">' + this.locale.cancelLabel + '</button>' +
                  '</div>' +
                '</div>' +
              '</div>';

        //the date range picker
        this.container = $(DRPTemplate).appendTo('body');

        if (hasOptions) {
            if (typeof options.format == 'string')
                this.format = options.format;

            if (typeof options.minDate == 'string')
                this.minDate = moment.utc(options.minDate, this.format);

            if (typeof options.maxDate == 'string')
                this.maxDate = moment.utc(options.maxDate, this.format);

            if (typeof options.minDate == 'object')
                this.minDate = moment.utc(options.minDate);

            if (typeof options.maxDate == 'object')
                this.maxDate = moment.utc(options.maxDate);

            if (typeof options.ranges == 'object') {
                for (var range in options.ranges) {

                    var start = options.ranges[range][0];
                    var end = options.ranges[range][1];
                    var rangeType = options.ranges[range][2];

                    if (typeof start == 'string')
                        start = moment.utc(start);

                    if (typeof end == 'string')
                        end = moment.utc(end);

                    // If we have a min/max date set, bound this range
                    // to it, but only if it would otherwise fall
                    // outside of the min/max.
                    if (this.minDate && start < this.minDate)
                        start = this.minDate;

                    if (this.maxDate && end > this.maxDate)
                        end = this.maxDate;

                    // If the end of the range is before the minimum (if min is set) OR
                    // the start of the range is after the max (also if set) don't display this
                    // range option.
                    if ((this.minDate && end < this.minDate) || (this.maxDate && start > this.maxDate))
                    {
                        continue;
                    }

                    this.ranges[rangeType] = [moment(start), moment(end), range];
                }

                var list = '<ul>';
                for (var range in this.ranges) {
                    list += '<li data-range-type="' + range + '">' + this.ranges[range][2] + '</li>';
                }
                list += '<li data-range-type="custom">' + this.locale.customRangeLabel + '</li>';
                this.ranges['custom'] = [null, null, this.locale.customRangeLabel];
                list += '</ul>';
                this.container.find('.ranges').prepend(list);
            }

            // update day names order to firstDay
            if (typeof options.locale == 'object') {
                if (typeof options.locale.firstDay == 'number') {
                    this.locale.firstDay = options.locale.firstDay;
                    var iterator = options.locale.firstDay;
                    while (iterator > 0) {
                        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                        iterator--;
                    }
                }
            }

            if (typeof options.opens == 'string')
                this.opens = options.opens;
        }

        if (this.opens == 'right') {
            //swap calendar positions
            var left = this.container.find('.calendar.left');
            var right = this.container.find('.calendar.right');
            left.removeClass('left').addClass('right');
            right.removeClass('right').addClass('left');
        }

        this.container.find('.calendar').show();

        if (typeof cb == 'function')
            this.cb = cb;

        this.container.addClass('opens' + this.opens);

        //event listeners
        this.container.on('mousedown', $.proxy(this.mousedown, this));

        this.container.find('.calendar').on('click', '.prev', $.proxy(this.clickPrev, this));
        this.container.find('.calendar').on('click', '.next', $.proxy(this.clickNext, this));

        this.container.find('.calendar').on('click', '.prev-year', $.proxy(this.clickPrevYear, this));
        this.container.find('.calendar').on('click', '.next-year', $.proxy(this.clickNextYear, this));

        this.container.find('.ranges').on('click', 'button.btn-success', $.proxy(this.clickApply, this));
        this.container.find('.ranges').on('click', 'button.btn-danger', $.proxy(this.clickCancel, this));

        this.container.find('.calendar').on('click', 'td.available', $.proxy(this.clickDate, this));
        this.container.find('.calendar').on('mouseenter', 'td.available', $.proxy(this.enterDate, this));
        this.container.find('.calendar').on('mouseleave', 'td.available', $.proxy(this.updateView, this));

        this.container.find('.ranges').on('click', 'li', $.proxy(this.clickRange, this));
        this.container.find('.ranges').on('mouseenter', 'li', $.proxy(this.enterRange, this));
        this.container.find('.ranges').on('mouseleave', 'li', $.proxy(this.updateView, this));

        if (this.element.is('input'))
            this.element.on('keyup', $.proxy(this.updateFromControl, this));

        if (hasOptions) {
            if (typeof options.rangeType == 'string')
                this.rangeType = options.rangeType;

            if (typeof options.startDate == 'string')
                this.startDate = moment.utc(options.startDate, this.format);

            if (typeof options.endDate == 'string')
                this.endDate = moment.utc(options.endDate, this.format);

            if (typeof options.startDate == 'object')
                this.startDate = moment.utc(options.startDate);

            if (typeof options.endDate == 'object')
                this.endDate = moment.utc(options.endDate);

            this.setRange(this.rangeType, this.startDate, this.endDate);
        }
        else {
            this.updateView();
            this.updateCalendars();
        }
    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        mousedown: function (e) {
            e.stopPropagation();
            e.preventDefault();
        },

        updateView: function () {
            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year());
        },

        updateFromControl: function () {
            if (!this.element.is('input')) return;

            var val = this.element.val();
            var dateString = val.split(" - ");
            var start = moment.utc(Date.parseExact(dateString[0], this.format));
            var end = moment.utc(Date.parseExact(dateString[1], this.format));

            if (start == null || end == null) return;
            if (end < start) return;

            this.setRange('custom', start, end);
        },

        notify: function () {
            this.updateView();

            if (this.element.is('input')) {
                var val = this.startDate.format(this.format) + ' - ' + this.endDate.format(this.format);
                this.element.val(val);
            }
            this.cb(this.rangeType, this.startDate, this.endDate);
        },

        move: function () {
            if (this.opens == 'left') {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight(),
                    right: $(window).width() - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
            } else {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight(),
                    left: this.element.offset().left,
                    right: 'auto'
                });
            }
        },

        show: function (e) {
            this.container.show();
            this.move();

            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            $(document).on('mousedown', $.proxy(this.hide, this, false));
        },

        hide: function (changed) {
            this.container.hide();
            $(document).off('mousedown', this.hide);
            if (changed)
                this.notify();
        },

        enterRange: function (e) {
            // TODO might want to give a preview of the range,
            // when the mouse is hovering over it
            var rangeType = $(e.target).attr('data-range-type');
            if (rangeType == 'custom') {
                this.updateView();
            }
        },

        clickRange: function (e) {
            var rangeType = $(e.target).attr('data-range-type');

            if (rangeType == 'custom') {
                this.setRange('custom');
                // don't hide
            }
            else {
                this.setRange(rangeType);
                this.hide(true);
            }
        },

        clickPrev: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract('months', 1);
            } else {
                this.rightCalendar.month.subtract('months', 1);
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add('months', 1);
            } else {
                this.rightCalendar.month.add('months', 1);
            }
            this.updateCalendars();
        },

        clickPrevYear: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract('years', 1);
            } else {
                this.rightCalendar.month.subtract('years', 1);
            }
            this.updateCalendars();
        },

        clickNextYear: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add('years', 1);
            } else {
                this.rightCalendar.month.add('years', 1);
            }
            this.updateCalendars();
        },

        enterDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');
        },

        clickDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            if (cal.hasClass('left')) {
                startDate = this.leftCalendar.calendar[row][col];
                endDate = this.endDate;
            } else {
                startDate = this.startDate;
                endDate = this.rightCalendar.calendar[row][col];
            }

            cal.find('td').removeClass('active');

            if (equals(startDate, endDate) || startDate < endDate) {
                // selected start and end are valid
                $(e.target).addClass('active');
                this.setRange('custom', startDate, endDate);
            }
            else {
                this.updateView();
                this.updateCalendars();
            }
        },

        clickApply: function (e) {
            this.hide(true);
        },

        clickCancel: function (e) {
            this.hide(false);
        },

        updateCalendars: function () {
            this.leftCalendar.calendar = this.buildCalendar(this.leftCalendar.month.month(), this.leftCalendar.month.year());
            this.rightCalendar.calendar = this.buildCalendar(this.rightCalendar.month.month(), this.rightCalendar.month.year());
            this.container.find('.calendar.left').html(this.renderCalendar(this.leftCalendar.calendar, this.startDate, this.minDate, this.endDate));
            this.container.find('.calendar.right').html(this.renderCalendar(this.rightCalendar.calendar, this.endDate, this.startDate, this.maxDate));
        },

        buildCalendar: function (month, year) {

            var firstDay = moment.utc([year, month]);
            var lastMonth = moment(firstDay).subtract('days', 1).month();
            var lastYear = moment(firstDay).subtract('days', 1).year();

            var daysInMonth = firstDay.daysInMonth();
            var daysInLastMonth = moment.utc([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = Array();
            for (var i = 0; i < 6; i++) {
                calendar[i] = Array();
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment.utc([lastYear, lastMonth, startDay]);
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('days', 1)) {
                if (i > 0 && col % 7 == 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate;
            }

            return calendar;
        },

        renderCalendar: function (calendar, selected, minDate, maxDate) {
            var html = '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';
            if (!minDate || minDate < calendar[1][1])
            {
                html += '<th class="prev-year available"><i class="icon-fast-backward"></i></th>';
                html += '<th class="prev available"><i class="icon-step-backward"></i></th>';
            }
            else
            {
                html += '<th></th>';
                html += '<th></th>';
            }
            var theDate = calendar[1][1];
            var theDateFormatted = this.locale.monthNames[theDate.month()] + ' ' + theDate.year();
            html += '<th colspan="3">' + theDateFormatted + '</th>';
            if (!maxDate || maxDate > calendar[1][1])
            {
                html += '<th class="next available"><i class="icon-step-forward"></i></th>';
                html += '<th class="next-year available"><i class="icon-fast-forward"></i></th>';
            }
            else
            {
                html += '<th></th>';
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            for (var row = 0; row < 6; row++) {
                html += '<tr>';
                for (var col = 0; col < 7; col++) {
                    var cname = 'available ';
                    var item = calendar[row][col];
                    cname += (item.month() == calendar[1][1].month()) ? '' : 'off';

                    if ((minDate && item < minDate) || (maxDate && item > maxDate))
                    {
                        cname = 'off disabled';
                    }
                    else if (equals(item, selected))
                    {
                        cname += 'active';
                    }
                    
                    var title = 'r' + row + 'c' + col;
                    html += '<td class="' + cname + '" data-title="' + title + '">' + item.date() + '</td>';
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';

            return html;
        },

        setRange: function (rangeType, startDate, endDate) {
            if (rangeType == 'custom') {
                if (!startDate || !endDate || !moment.isMoment(startDate) || !moment.isMoment(endDate)) {
                    startDate = this.startDate;
                    endDate = this.endDate;
                }
                else {
                    // ensure we don't modify the original objects
                    startDate = moment(startDate);
                    endDate = moment(endDate);
                }
            }
            else {
                if (rangeType in this.ranges) {
                    // ignore passed start and end date
                    var range = this.ranges[rangeType];
                    startDate = range[0];
                    endDate = range[1];
                }
            }

            if (rangeType != this.rangeType)
                this.container.find('.ranges').find('li[data-range-type=' + this.rangeType + ']').removeClass('active');
            this.container.find('.ranges').find('li[data-range-type=' + rangeType + ']').addClass('active');

            this.rangeType = rangeType;
            this.startDate = startDate;
            this.endDate = endDate;

            this.updateView();
            this.updateCalendars();
        },

        getRange: function (rangeType) {
            var range = this.ranges[rangeType];
            return range;
        }
    };

    $.fn.daterangepicker = function (options, cb) {
      this.each(function() {
        var el = $(this);
        if (!el.data('daterangepicker'))
          el.data('daterangepicker', new DateRangePicker(el, options, cb));
      });
      return this;
    };

} (window.jQuery);
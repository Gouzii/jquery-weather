(function($)
{
    $.fn.weather=function(options){
        var defaults={
            city: "Bordeaux",
            units: "C",
            apiKey: "8783518d2aa42cd54c06da77c7839f65",
            draggable: true,
            css: {
                '.header-top': {
                    'border-bottom': '3px solid #D4D4D4',
                    padding: '1.5em'
                },
                '.header-top .city': {
                    'font-size': '1.4em',
                    'border': 'none',
                    'border-bottom': '1px solid #8C8B8B',
                    'width': '110px',
                },
                '.header-top #temp-switch': {
                    'float': 'right',
                    'border': '1px solid #C1C1C1',
                    'border-radius': '5px',
                    'margin-top': '0.3em',
                },
                '.header-top #temp-switch li': {
                    'display': 'inline-block'
                },
                '.header-top #temp-switch li p': {
                    'color':'#8C8B8B',
                    'font-size': '1em',
                    'padding': '4px 6px',
                },
                '.header-top #temp-switch li p.cen': {
                    'background': '#E4E4E4'
                },
                '.header-top .clock': {
                    "width": "70px",
                    "margin-top": "0.7em"
                },
                '.header-top #refresh': {
                    'width': '30px',
                    float: 'right'
                },
                '.header-head': {
                    padding: '2em',
                    'text-align': 'center'
                },
                '.header-head h4': {
                    color:'#8C8B8B'
                },
                '.header-head h6': {
                    'font-size': '1.5em',
                    'font-weight': 'bold',
                    'margin-bottom': '1em'
                },
                '.header-head img': {
                    display: 'block',
                    margin: '1em auto'
                },
                '.bottom-head p': {
                    color:'#8C8B8B',
                    'line-height': '1.4em'
                }
            }
        };
        var options = $.extend(defaults, options);
        var savedData = {};

        var getData = function () {
            var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + options.city + "&appid=" + options.apiKey;
            var promise = new Promise(function (resolve, reject) {
                $.ajax({
                    url: apiUrl
                })
               .done(function (response) {
                    resolve(response);
               })
                .fail(function (error) {
                    reject(error);
                });
            });
            return promise;
        };

        var checkErrors = function (response) {
            if(response.cod == 404) {
                console.log(response.message);
                return false;
            } else {
                return true;
            }
        };

        var sortData = function (response) {
            var data = {
                name: response.name,
                weather: response.weather[0].main,
                temp: calcTemps(response.main.temp)
            };
            savedData = data;
            return data;
        };
        
        var calcTemps = function (temp) {
            if (options.units == "C") {
                tempC = Math.round((temp - 273.15) * 100) / 100;
                return tempC;
            } else if (options.units == "F") {
                tempF = Math.round((temp * (9/5) - 459.67) * 100) / 100;
                return tempF;
            }
        };

        var switchTemp = function (target) {
            $(target).find('#temp-switch li p').each(function () {$(this).toggleClass('cen').removeAttr('style')});
            $(target).find('#temp-switch li p').css(options.css['.header-top #temp-switch li p']);
            $(target).find('#temp-switch li p.cen').css(options.css['.header-top #temp-switch li p.cen']);
            (options.units == "C")? options.units = "F" : options.units = "C";
        };

        var startDate = function (type) {
            var time = new Date();
            if(type == "time") {
                var h = time.getHours();
                var m = time.getMinutes();
                var s = time.getSeconds();
                m = checkTime(m);
                s = checkTime(s);

                return(h + ":" + m + ":" + s) ;
            } else if (type == "date") {
                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                var month = time.getMonth();
                var date = time.getDate()
                var d = time.getDay();

                return({day: dayNames[d] + " " + date, month: monthNames[month]});
            }

        };
        var checkTime =function (i) {
            if (i < 10) {
                i = "0" + i
            }
            return i;
        };
        var displayTime =function (target) {
            var time;
            var insertTime = function () {
                time = startDate("time");
                $(target).find(".clock").html(time);
            };
            $(target).find('.header-top').not(":has(.clock)").append("<div class='clock'></div>");
            insertTime();
            setInterval(insertTime, 1000);
        };
        var displayDate = function (target) {
            var date = startDate("date");
            $(target).find('.day').html(date.day);
            $(target).find('.month').html(date.month);
        };

        function createHtml (target) {
            var html  = '   <div class="header-top">';
                html += '       <img src="images/refresh.png" id="refresh">';
                html += '       <input class="city"/>';
                html += '       <div class="clear"></div>';
                html += '       <ul id="temp-switch">';
                html += '           <li><p class="F">°F</p></li>';
                html += '           <li><p class="C">°C</p></li>';
                html += '       </ul>';
                html += '       <div class="clock">0:00:00</div>';
                html += '       <div class="clear"></div>';
                html += '   </div>';
                html += '   <div class="header-bottom">';
                html += '       <div class="header-head">';
                html += '           <h4></h4>';
                html += '           <img alt="" />';
                html += '           <h6></h6>';
                html += '           <div class="bottom-head">';
                html += '               <p class="day">August 16</p>';
                html += '               <p class="month">Monday</p>';
                html += '           </div>';
                html += '       </div>';
                html += '       <div class="clear"> </div>';
                html += '   </div>';
            $(target)
                .html(html)
                .addClass("weather")
                .css({width: '200px', margin: '10px auto',background: '#fff'});
            if (options.draggable) {
                $(target).draggable();
            }
            $(target).find("." + options.units).addClass("cen");
            $.each(options.css, function (id, prop) {
                $(target).find(id).css(prop);
            });
            displayTime(target);
            displayDate(target);

        };

        var insertData = function (target,data) {
            $(target).find('.header-top .city').val(data.name);
            $(target).find('.header-head h4').text(data.weather);
            $(target).find('.header-head img').attr({src:'images/' + data.weather.toLowerCase() + '.png', alt: data.weather + 'icon'});
            $(target).find('.header-head h6').text(data.temp + options.units + '°');
        };


        return this.each(function(){
            var target = this;


            getData().then(function (response) {
                if (checkErrors(response)) {
                    var data = sortData(response);
                    createHtml(target);
                    insertData(target, data);
                    $(target).find('#refresh').click(refresh);
                    $(target).find('#temp-switch').click(function () {
                        switchTemp(target);
                        data.temp = calcTemps(response.main.temp);
                        insertData(target,data);
                    });
                    $(target).find('.city').keyup(function (e) {
                        checkInput(e, this);
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

            var refresh = function () {
                getData().then(function (response) {
                    if (checkErrors(response)) {
                        var data = sortData(response);
                        insertData(target, data);
                    }
                })
                    .catch(function (error) {
                        console.log(error);
                        insertData(target, savedData);
                    });
            };


            var checkInput = function (e, elem) {
                if(e.keyCode == 13) {
                    options.city = $(elem).val();
                    refresh();
                }
            };

        });
    };
})(jQuery);
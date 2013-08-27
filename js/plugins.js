// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// // Place any jQuery/helper plugins in here.
// $(function(){
//     var myMap;

//     // Дождёмся загрузки API и готовности DOM.
//     ymaps.ready(init);

//     function init () {
//         // Создание экземпляра карты и его привязка к контейнеру с
//         // заданным id ("map").
//         myMap = new ymaps.Map('YMapsID', {
//             // При инициализации карты обязательно нужно указать
//             // её центр и коэффициент масштабирования.
//             center:[55.76, 37.64], // Москва
//             zoom:10
//         });
//     }
// })
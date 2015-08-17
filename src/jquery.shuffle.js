;(function ($, window, document) 
{
    
    var defaults = 
    {
        message: '',
        step: 16,
        fps: 12,
        onComplete: null
    };


    function Shuffle($elem, params)
    {
        defaults = $.extend({}, defaults, params);
        this.container = $elem;
        this.lowercase =  ("abcdefghijklmnopqrstuvwxyz").split('');
        this.uppercase =  ("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('');
        this.numbercase = ("0123456789").split('');
        this.symbolcase = (",.?/\\(^)![]{}*&^%$#'\"").split('');

        this.animated = false;
    };


    Shuffle.prototype = {


        show: function(params)
        {
            this._animate("show", params);
        },


        hide: function(params)
        {
            this._animate("hide", params);
        },


        _animate: function(state, params)
        {
            if (this.animated) return;
            else this.animated = true;
            
            var self = this,
                options = $.extend({}, defaults, params),
                step = options.step,
                fps = 1000 / options.fps,
                message = (options.message || this.container.text()).split(''),
                onComplete = options.onComplete,
                types = [],
                letters = [],
                i = 0, l = message.length, 
                ch;

            for (i; i < l; i++)
            {
                ch = message[i];

                if (ch == " ") {
                    types[i] = "space";
                    continue;
                }

                else if(/[a-z]/.test(ch)) types[i] = "lowercase";
                else if(/[A-Z]/.test(ch)) types[i] = "uppercase";
                else if(/[0-9]/.test(ch)) types[i] = "numbercase";
                else  types[i] = "symbolcase";
                
                letters.push(i);
            }

            state == "show" && self._clear();

            (function animate(start)
            {
                var i = Math.max(start, 0),
                    l = letters.length, 
                    m = message.slice(0);
                    n = state == "show" ? 1 : -1;

                    
                if (state == "show" && start > l || state == "hide" && start < -step) 
                {
                    self.animated = false;
                    onComplete && onComplete(this.container);
                    return;
                }
                
                
                for (i; i < l; i++)
                {
                    m[letters[i]] = (i < start + step) 
                    ? self._getRandomChar(types[letters[i]]) : "";
                }
                
                self.container.text(m.join(""));
                
                setTimeout(function() {
                    window.requestAnimationFrame(function() {
                        animate(start + n);
                    });
                }, fps);
                
            })(state == "hide" ? letters.length : -step);
        },


        _clear: function()
        {
            this.container.html('');
        },


        _getRandomChar: function(type)
        {
            var a = undefined;
                 if (type == "lowercase")  a = this.lowercase;
            else if (type == "uppercase")  a = this.uppercase;
            else if (type == "numbercase") a = this.numbercase;
            else if (type == "symbolcase") a = this.symbolcase;

            return a[Math.floor(Math.random() * a.length)];
        }


    };


    $.fn.shuffle = function (params) 
    {
        var self = this, l = self.length, i = 0;

        for (i; i < l; i++) 
        {
            var $elem = $(self[i]);
            var instance = $elem.data('shuffle');

            if (!instance) {
                if (typeof params === 'object' || !params) {
                    $elem.data('shuffle', new Shuffle($elem, params));
                }
            } else {    
                if (instance[params]) {
                    instance[params].apply(instance, Array.prototype.slice.call(arguments, 1));
                }
            }

            return this;
        }
    }


})(jQuery, window, document);




/**
 * requestAnimationFrame polyfill
 * https://gist.github.com/paulirish/1579671
 * by Erik Möller. fixes from Paul Irish and Tino Zijdel
 * MIT LICENSE
 */

;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        window.requestAnimationFrame = window[vendors[i]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i]+'CancelAnimationFrame'] 
                                   || window[vendors[i]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
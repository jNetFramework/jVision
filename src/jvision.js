if (typeof String.prototype.trim == 'undefined') {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

(function () {

    var jVObject = function (selector) {

        this.treeDom = [];

        this.push = function (newDom) {
            this.treeDom.push(newDom);
        };

        switch (typeof selector) {
            case 'string':
                this.treeDom = document.querySelectorAll(selector);
                break;
            case 'object':
                try {
                    switch (selector.toString()) {
                        case '[object NodeList]':
                            this.treeDom = selector;
                            break;
                        case '[object HTMLParagraphElement]':
                        default:
                            this.push(selector);
                    }
                }
                catch (e) {
                    this.push(selector);
                }
                break;
        }

        this.count = function () {
            return this.treeDom.length;
        };

        this.at = function (index) {
            if (typeof index != 'undefined' && this.count() > 0) {
                if (index >= 0) {
                    return this.treeDom[index];
                }
                else {
                    return this.treeDom[this.count() + index];
                }
            }
            return null;
        };

        this.eq = function (index) {
            return new jVObject(this.at(index));
        };

        this.first = function () {
            return new jVObject(this.at(0));
        };

        this.last = function () {
            return new jVObject(this.at(-1));
        };

        this.each = function (callback) {
            for (var i = 0; i < this.count(); ++i) {
                callback(this.at(i), i);
            }
        };

        this.text = function (text) {
            var type = typeof text;
            if (type != 'undefined') {
                if (type == 'function') {
                    this.each(function (node) {
                        node.innerText = text(new jVObject(node));
                    });
                }
                else {
                    this.each(function (node) {
                        node.innerText = text;
                    });
                }
                return this;
            }
            if (this.count() == 1) {
                return this.at(0).innerText;
            }
        };

        this.html = function (html) {
            var type = typeof html;
            if (type != 'undefined') {
                if (type == 'function') {
                    this.each(function (node) {
                        node.innerHTML = html(new jVObject(node));
                    });
                }
                else {
                    this.each(function (node) {
                        node.innerHTML = html;
                    });
                }
                return this;
            }
            if (this.count() == 1) {
                return this.at(0).innerHTML;
            }
            return null;
        };

        this.outerHtml = function () {
            if (this.count() == 1) {
                return this.at(0).outerHTML;
            }
            return null;
        };

        this.css = function (type, value) {
            this.each(function (node) {
                node.style[type] = value;
            });
            return this;
        };

        this.addClass = function (className) {
            this.each(function (node) {
                node.classList.add(className);
            });
            return this;
        };

        this.removeClass = function (className) {
            this.each(function (node) {
                node.classList.remove(className);
            });
            return this;
        };

        this.find = function (selector) {
            var newObject = new jVObject(this.treeDom);
            var list = [];
            newObject.each(function (node) {
                list.push(node.querySelectorAll(selector));
            });
            if (list.length == 1) {
                newObject.treeDom = list[0];
            }
            else {
                newObject.treeDom = list;
            }
            return newObject;
        };

    };

    var jVision = window.jVision = new (function () {

        this.major = 0;
        this.minor = 0;
        this.maintenance = 3;

        this.version = function () {
            return this.major + '.' + this.minor + '.' + this.maintenance;
        };

        this.ready = function (callback) {
            document.addEventListener("DOMContentLoaded", callback);
            return this;
        };

        this.loader = function (src) {
            var script = document.createElement("script");
            script.src = src;
            var doc = document.head || document.getElementsByTagName("head")[0];
            doc.appendChild(script);
            return this;
        };

        this.get = function (selector) {
            return new jVObject(selector);
        };

    });

})();
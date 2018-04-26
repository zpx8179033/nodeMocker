var Util = require('../util');
module.exports = (function () {
    let randomObject={};
    let util={
        // 把字符串的第一个字母转换为大写。
        capitalize: function(word) {
            return (word + '').charAt(0).toUpperCase() + (word + '').substr(1)
        },
        // 把字符串转换为大写。
        upper: function(str) {
            return (str + '').toUpperCase()
        },
        // 把字符串转换为小写。
        lower: function(str) {
            return (str + '').toLowerCase()
        },
        // 从数组中随机选取一个元素，并返回。
        pick: function pick(arr, min, max) {
            // pick( item1, item2 ... )
            if (!Array.isArray(arr)) {
                arr = [].slice.call(arguments)
                min = 1
                max = 1
            } else {
                // pick( [ item1, item2 ... ] )
                if (min === undefined) min = 1

                // pick( [ item1, item2 ... ], count )
                if (max === undefined) max = min
            }

            if (min === 1 && max === 1) return arr[this.natural(0, arr.length - 1)]

            // pick( [ item1, item2 ... ], min, max )
            return this.shuffle(arr, min, max)

            // 通过参数个数判断方法签名，扩展性太差！#90
            // switch (arguments.length) {
            // 	case 1:
            // 		// pick( [ item1, item2 ... ] )
            // 		return arr[this.natural(0, arr.length - 1)]
            // 	case 2:
            // 		// pick( [ item1, item2 ... ], count )
            // 		max = min
            // 			/* falls through */
            // 	case 3:
            // 		// pick( [ item1, item2 ... ], min, max )
            // 		return this.shuffle(arr, min, max)
            // }
        },
        /*
         打乱数组中元素的顺序，并返回。
         Given an array, scramble the order and return it.
         其他的实现思路：
         // https://code.google.com/p/jslibs/wiki/JavascriptTips
         result = result.sort(function() {
         return Math.random() - 0.5
         })
         */
        shuffle: function shuffle(arr, min, max) {
            arr = arr || []
            var old = arr.slice(0),
                result = [],
                index = 0,
                length = old.length;
            for (var i = 0; i < length; i++) {
                index = this.natural(0, old.length - 1)
                result.push(old[index])
                old.splice(index, 1)
            }
            switch (arguments.length) {
                case 0:
                case 1:
                    return result
                case 2:
                    max = min
                /* falls through */
                case 3:
                    min = parseInt(min, 10)
                    max = parseInt(max, 10)
                    return result.slice(0, this.natural(min, max))
            }
        },
        /*
         * Random.order(item, item)
         * Random.order([item, item ...])
         顺序获取数组中的元素
         [JSON导入数组支持数组数据录入](https://github.com/thx/RAP/issues/22)
         不支持单独调用！
         */
        order: function order(array) {
            order.cache = order.cache || {}

            if (arguments.length > 1) array = [].slice.call(arguments, 0)

            // options.context.path/templatePath
            var options = order.options
            var templatePath = options.context.templatePath.join('.')

            var cache = (
                order.cache[templatePath] = order.cache[templatePath] || {
                        index: 0,
                        array: array
                    }
            )

            return cache.array[cache.index++ % cache.array.length]
        }
    }
    /*
     ## Basics
     */
    let randomBaseTypeName = {
        // 返回一个随机的布尔值。
        boolean: function(min, max, cur) {
            if (cur !== undefined) {
                min = typeof min !== 'undefined' && !isNaN(min) ? parseInt(min, 10) : 1
                max = typeof max !== 'undefined' && !isNaN(max) ? parseInt(max, 10) : 1
                return Math.random() > 1.0 / (min + max) * min ? !cur : cur
            }

            return Math.random() >= 0.5
        },
        bool: function(min, max, cur) {
            return this.boolean(min, max, cur)
        },
        // 返回一个随机的自然数（大于等于 0 的整数）。
        natural: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : 0
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        // 返回一个随机的整数。
        integer: function(min, max) {
            min = typeof min !== 'undefined' ? parseInt(min, 10) : -9007199254740992
            max = typeof max !== 'undefined' ? parseInt(max, 10) : 9007199254740992 // 2^53
            return Math.round(Math.random() * (max - min)) + min
        },
        int: function(min, max) {
            return this.integer(min, max)
        },
        // 返回一个随机的浮点数。
        float: function(min, max, dmin, dmax) {
            dmin = dmin === undefined ? 0 : dmin
            dmin = Math.max(Math.min(dmin, 17), 0)
            dmax = dmax === undefined ? 17 : dmax
            dmax = Math.max(Math.min(dmax, 17), 0)
            var ret = this.integer(min, max) + '.';
            for (var i = 0, dcount = this.natural(dmin, dmax); i < dcount; i++) {
                ret += (
                    // 最后一位不能为 0：如果最后一位为 0，会被 JS 引擎忽略掉。
                    (i < dcount - 1) ? this.character('number') : this.character('123456789')
                )
            }
            return parseFloat(ret, 10)
        },
        // 返回一个随机字符。
        character: function(pool) {
            var pools = {
                lower: 'abcdefghijklmnopqrstuvwxyz',
                upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                number: '0123456789',
                symbol: '!@#$%^&*()[]'
            }
            pools.alpha = pools.lower + pools.upper
            pools['undefined'] = pools.lower + pools.upper + pools.number + pools.symbol

            pool = pools[('' + pool).toLowerCase()] || pool
            return pool.charAt(this.natural(0, pool.length - 1))
        },
        char: function(pool) {
            return this.character(pool)
        },
        // 返回一个随机字符串。
        string: function(pool, min, max) {
            var len
            switch (arguments.length) {
                case 0: // ()
                    len = this.natural(3, 7)
                    break
                case 1: // ( length )
                    len = pool
                    pool = undefined
                    break
                case 2:
                    // ( pool, length )
                    if (typeof arguments[0] === 'string') {
                        len = min
                    } else {
                        // ( min, max )
                        len = this.natural(pool, min)
                        pool = undefined
                    }
                    break
                case 3:
                    len = this.natural(min, max)
                    break
            }

            var text = ''
            for (var i = 0; i < len; i++) {
                text += this.character(pool)
            }

            return text
        },
        str: function( /*pool, min, max*/ ) {
            return this.string.apply(this, arguments)
        },
        // 返回一个整型数组。
        range: function(start, stop, step) {
            // range( stop )
            if (arguments.length <= 1) {
                stop = start || 0;
                start = 0;
            }
            // range( start, stop )
            step = arguments[2] || 1;

            start = +start
            stop = +stop
            step = +step

            var len = Math.max(Math.ceil((stop - start) / step), 0);
            var idx = 0;
            var range = new Array(len);

            while (idx < len) {
                range[idx++] = start;
                start += step;
            }

            return range;
        },
        dateTimestamp: function(min , max){
            let currentTime = (Date.now() / 1000).toFixed();
            return Number(currentTime);
        }
    }


    let randomName = {
        // 随机生成一个常见的英文名。
        first: function() {
            var names = [
                // male
                "James", "John", "Robert", "Michael", "William",
                "David", "Richard", "Charles", "Joseph", "Thomas",
                "Christopher", "Daniel", "Paul", "Mark", "Donald",
                "George", "Kenneth", "Steven", "Edward", "Brian",
                "Ronald", "Anthony", "Kevin", "Jason", "Matthew",
                "Gary", "Timothy", "Jose", "Larry", "Jeffrey",
                "Frank", "Scott", "Eric"
            ].concat([
                // female
                "Mary", "Patricia", "Linda", "Barbara", "Elizabeth",
                "Jennifer", "Maria", "Susan", "Margaret", "Dorothy",
                "Lisa", "Nancy", "Karen", "Betty", "Helen",
                "Sandra", "Donna", "Carol", "Ruth", "Sharon",
                "Michelle", "Laura", "Sarah", "Kimberly", "Deborah",
                "Jessica", "Shirley", "Cynthia", "Angela", "Melissa",
                "Brenda", "Amy", "Anna"
            ])
            return this.pick(names)
            // or this.capitalize(this.word())
        },
        // 随机生成一个常见的英文姓。
        last: function() {
            var names = [
                "Smith", "Johnson", "Williams", "Brown", "Jones",
                "Miller", "Davis", "Garcia", "Rodriguez", "Wilson",
                "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
                "Moore", "Martin", "Jackson", "Thompson", "White",
                "Lopez", "Lee", "Gonzalez", "Harris", "Clark",
                "Lewis", "Robinson", "Walker", "Perez", "Hall",
                "Young", "Allen"
            ]
            return this.pick(names)
            // or this.capitalize(this.word())
        },
        // 随机生成一个常见的英文姓名。
        name: function(middle) {
            return this.first() + ' ' +
                (middle ? this.first() + ' ' : '') +
                this.last()
        },
        /*
         随机生成一个常见的中文姓。
         [世界常用姓氏排行](http://baike.baidu.com/view/1719115.htm)
         [玄派网 - 网络小说创作辅助平台](http://xuanpai.sinaapp.com/)
         */
        cfirst: function() {
            var names = (
                '王 李 张 刘 陈 杨 赵 黄 周 吴 ' +
                '徐 孙 胡 朱 高 林 何 郭 马 罗 ' +
                '梁 宋 郑 谢 韩 唐 冯 于 董 萧 ' +
                '程 曹 袁 邓 许 傅 沈 曾 彭 吕 ' +
                '苏 卢 蒋 蔡 贾 丁 魏 薛 叶 阎 ' +
                '余 潘 杜 戴 夏 锺 汪 田 任 姜 ' +
                '范 方 石 姚 谭 廖 邹 熊 金 陆 ' +
                '郝 孔 白 崔 康 毛 邱 秦 江 史 ' +
                '顾 侯 邵 孟 龙 万 段 雷 钱 汤 ' +
                '尹 黎 易 常 武 乔 贺 赖 龚 文'
            ).split(' ')
            return this.pick(names)
        },
        /*
         随机生成一个常见的中文名。
         [中国最常见名字前50名_三九算命网](http://www.name999.net/xingming/xingshi/20131004/48.html)
         */
        clast: function() {
            var names = (
                '伟 芳 娜 秀英 敏 静 丽 强 磊 军 ' +
                '洋 勇 艳 杰 娟 涛 明 超 秀兰 霞 ' +
                '平 刚 桂英'
            ).split(' ')
            return this.pick(names)
        },
        // 随机生成一个常见的中文姓名。
        cname: function() {
            return this.cfirst() + this.clast()
        }
    }


    /*
     ## Date
     */
    let patternLetters = {
        yyyy: 'getFullYear',
        yy: function(date) {
            return ('' + date.getFullYear()).slice(2)
        },
        y: 'yy',

        MM: function(date) {
            var m = date.getMonth() + 1
            return m < 10 ? '0' + m : m
        },
        M: function(date) {
            return date.getMonth() + 1
        },

        dd: function(date) {
            var d = date.getDate()
            return d < 10 ? '0' + d : d
        },
        d: 'getDate',

        HH: function(date) {
            var h = date.getHours()
            return h < 10 ? '0' + h : h
        },
        H: 'getHours',
        hh: function(date) {
            var h = date.getHours() % 12
            return h < 10 ? '0' + h : h
        },
        h: function(date) {
            return date.getHours() % 12
        },

        mm: function(date) {
            var m = date.getMinutes()
            return m < 10 ? '0' + m : m
        },
        m: 'getMinutes',

        ss: function(date) {
            var s = date.getSeconds()
            return s < 10 ? '0' + s : s
        },
        s: 'getSeconds',

        SS: function(date) {
            var ms = date.getMilliseconds()
            return ms < 10 && '00' + ms || ms < 100 && '0' + ms || ms
        },
        S: 'getMilliseconds',

        A: function(date) {
            return date.getHours() < 12 ? 'AM' : 'PM'
        },
        a: function(date) {
            return date.getHours() < 12 ? 'am' : 'pm'
        },
        T: 'getTime'
    }
    let randomDate = {
        // 日期占位符集合。
        _patternLetters: patternLetters,
        // 日期占位符正则。
        _rformat: new RegExp((function() {
            var re = []
            for (var i in patternLetters) re.push(i)
            return '(' + re.join('|') + ')'
        })(), 'g'),
        // 格式化日期。
        _formatDate: function(date, format) {
            return format.replace(this._rformat, function creatNewSubString($0, flag) {
                return typeof patternLetters[flag] === 'function' ? patternLetters[flag](date) :
                    patternLetters[flag] in patternLetters ? creatNewSubString($0, patternLetters[flag]) :
                        date[patternLetters[flag]]()
            })
        },
        // 生成一个随机的 Date 对象。
        _randomDate: function(min, max) { // min, max
            min = min === undefined ? new Date(0) : min
            max = max === undefined ? new Date() : max
            return new Date(Math.random() * (max.getTime() - min.getTime()))
        },
        // 返回一个随机的日期字符串。
        date: function(format) {
            format = format || 'yyyy-MM-dd'
            return this._formatDate(this._randomDate(), format)
        },
        // 返回一个随机的时间字符串。
        time: function(format) {
            format = format || 'HH:mm:ss'
            return this._formatDate(this._randomDate(), format)
        },
        // 返回一个随机的日期和时间字符串。
        datetime: function(format) {
            format = format || 'yyyy-MM-dd HH:mm:ss'
            return this._formatDate(this._randomDate(), format)
        },
        // 返回当前的日期和时间字符串。
        now: function(unit, format) {
            // now(unit) now(format)
            if (arguments.length === 1) {
                // now(format)
                if (!/year|month|day|hour|minute|second|week/.test(unit)) {
                    format = unit
                    unit = ''
                }
            }
            unit = (unit || '').toLowerCase()
            format = format || 'yyyy-MM-dd HH:mm:ss'

            var date = new Date()

            /* jshint -W086 */
            // 参考自 http://momentjs.cn/docs/#/manipulating/start-of/
            switch (unit) {
                case 'year':
                    date.setMonth(0)
                case 'month':
                    date.setDate(1)
                case 'week':
                case 'day':
                    date.setHours(0)
                case 'hour':
                    date.setMinutes(0)
                case 'minute':
                    date.setSeconds(0)
                case 'second':
                    date.setMilliseconds(0)
            }
            switch (unit) {
                case 'week':
                    date.setDate(date.getDate() - date.getDay())
            }

            return this._formatDate(date, format)
        }
    }

    Object.assign(randomObject, util);
    Object.assign(randomObject, randomBaseTypeName);
    Object.assign(randomObject, randomName);
    Object.assign(randomObject, randomDate);
    return randomObject;
})();
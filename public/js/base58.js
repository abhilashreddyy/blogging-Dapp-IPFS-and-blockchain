/* based on https://github.com/jbenet/go-base58/blob/master/base58.go */

var base58 = {
    alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
    bigRadix: new BigInteger("58"),

    byte_array: function(s) {
        var arr = [];
        for (var i = 0; i < s.length; i++) {
            arr.push(s.charCodeAt(i));
        }
        return arr;
    },
    string: function(arr) {
        var s = '';
        for (var i = 0; i < arr.length; i++) {
            s += String.fromCharCode(arr[i]);
        }
        return s;
    },

    // take byte array as input, give string as output
    encode: function(plain) {
        // create a copy with an extra leading 0 byte so that BigInteger
        // doesn't treat "plain" as a two's-complement value
        var plain_with_leading_zero = plain.slice();
        plain_with_leading_zero.unshift(0);
        var x = new BigInteger(plain_with_leading_zero, 256);

        var answer = '';

        while (x.compareTo(BigInteger.ZERO) > 0) {
            var mod = new BigInteger();
            x.divRemTo(base58.bigRadix, x, mod);
            answer = base58.alphabet.charAt(Number(mod.toString())) + answer;
        }

        for (var i = 0; i < plain.length; i++) {
            if (plain[i] != 0)
                break;
            answer = base58.alphabet.charAt(0) + answer;
        }

        return answer;
    },
    // take string as input, give byte array as output
    decode: function(encoded) {
        if (encoded == '')
            return '';

        var answer = new BigInteger("0");
        var j = new BigInteger("1");

        for (var i = encoded.length-1; i >= 0; i--) {
            var tmp = base58.alphabet.indexOf(encoded.charAt(i));
            console.log(tmp);
            if (tmp == -1) {
                // TODO: throw error?
                return undefined;
            }
            var idx = new BigInteger("" + tmp);
            console.log("idx : ",idx);
            var tmp1 = new BigInteger(j.toString());
            tmp1.dMultiply(idx);
            console.log("mul : ",tmp1);
            answer = answer.add(tmp1);
            console.log("ans : ",answer);
            j.dMultiply(base58.bigRadix);
            console.log("j : ",j);
        }


        var ans = answer.toByteArray();
        while (ans[0] == 0)
            ans.shift();

        for (var i = 0; i < encoded.length; i++) {
            if (encoded.charAt(i) != base58.alphabet[0]) {
                break;
            }
            ans.unshift(0);
        }

        return ans;
    },
    to_hex : function(s) {
        var r = '';
        for (var i = 0; i < s.length; i++) {
            var v;
            if (s[i] < 0)
                s[i] += 256;
            v = s[i].toString(16);
            if (v.length == 1)
                v = '0' + v;
            r += v;
        }
        return r;
    },
    from_hex : function(s) {
        var r = [];

        // add a leading 0 if there are an odd number of nybbles (thanks Elias C)
        if (s.length % 2 != 0)
            s = '0' + s;

        for (var i = 0; i < s.length; i += 2)
            r.push(parseInt(s.substr(i, 2), 16));
        return r;
    },

    strip_invalid : function(val, alphabet) {
        var s = val;
        var r = '';
        for (var i = 0; i < s.length; i++) {
            if (alphabet.indexOf(s.charAt(i)) != -1)
                r += s.charAt(i);
        }
        return r;
    }

};

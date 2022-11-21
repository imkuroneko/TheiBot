// Internal things (no tocar) ==============================================================================================
var idx=256, hex=[], size=256, buf;
while (idx--) hex[idx] = (idx + 256).toString(16).substring(1);

// Module script ===========================================================================================================
module.exports = {
    uid: function(len) {
        var i = 0;
        var tmp = (len || 11);
        if(!buf || ((idx + tmp) > size*2)) {
            for(buf='',idx=0; i < size; i++) { buf += hex[Math.random() * 256 | 0]; }
        }
        return buf.substring(idx, idx++ + tmp);
    },

    validateHexColor: function(color) {
        var reg=/^([0-9a-f]{3}){1,2}$/i;
        return reg.test(color);
    },
};

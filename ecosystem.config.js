module.exports = {
    apps : [{
        name : "[NKT Discord] Thei",
        script : "./index.js",

        watch : true,
        max_restarts : 10,

        ignore_watch : [
            './logs/errors.log',
            './logs/out.log'
        ],

        log_date_format : 'YYYY-MM-DD HH:mm',
        error_file : './logs/errors.log',
        out_file   : './logs/out.log'
    }]
}

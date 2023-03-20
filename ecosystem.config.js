module.exports = {
    apps : [{
        name      : "TheiBot",
        version   : "3.0.0",

        script    : "./index.js",
        exec_mode : "fork",

        watch : true,
        max_restarts : 10,

        // Ficheros a ignorar (para evitar el bot se reinicie cuando estos ficheros sean modificados)
        ignore_watch : [
            './data/*',
            './logs/*',
        ],

        log_date_format : 'YYYY-MM-DD HH:mm',
        error_file : './logs/errors.log',
        out_file   : './logs/out.log'
    }]
}

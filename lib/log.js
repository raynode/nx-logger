"use strict";
exports.__esModule = true;
// Global LogConfig
var baseConfiguration = {
    enabled: true,
    namespace: [],
    transport: function () { return null; },
    tty: true
};
exports.configure = function (config) {
    Object.keys(config)
        .forEach(function (property) { return baseConfiguration[property] = config[property]; });
    return baseConfiguration;
};
var mergeConfigurations = function (base, extra) {
    var enabled = extra.hasOwnProperty('enabled') ? extra.enabled : base.enabled;
    var namespace = base.namespace.concat((extra.namespace || []));
    var transport = extra.transport || base.transport;
    var tty = extra.hasOwnProperty('tty') ? extra.tty : base.tty;
    return {
        enabled: enabled,
        namespace: namespace,
        transport: transport,
        tty: tty
    };
};
var write = function (configuration) { return function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    return configuration.transport(configuration, messages);
}; };
var logFactory = function (configuration) {
    var log = write(configuration);
    log.configuration = configuration;
    log.create = logFactoryCreator(configuration);
    return log;
};
var logFactoryCreator = function (configuration) {
    return function (config) {
        var configs = mergeConfigurations(configuration, typeof config === 'string' ? {
            namespace: [config]
        } : config);
        return logFactory(configs);
    };
};
exports.create = logFactory(baseConfiguration).create;

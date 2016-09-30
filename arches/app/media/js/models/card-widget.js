define(['underscore', 'knockout', 'models/abstract', 'widgets'], function (_, ko, AbstractModel, widgets) {
    return AbstractModel.extend({
        /**
        * A backbone model to manage cards_x_nodes_x_widgets records
        * @augments AbstractModel
        * @constructor
        * @name CardWidgetModel
        */
        constructor: function(attributes, options){
            var defaults = {
                'id': null,
                'node_id': '',
                'card_id': '',
                'widget_id': '',
                'config': {},
                'label': '',
                'sortorder': null,
                'functions': []
            };
            this.widgetLookup = widgets;
            options || (options = {});
            attributes || (attributes = {});
            options.parse = true;
            this.node = (options.node || null);
            this.card = (options.card || null);
            this.datatype = (options.datatype || null);
            this.icon = 'ion-ios-paper';
            if (this.datatype) {
                this.icon = this.datatype.iconclass;
            }
            if (this.datatype && this.datatype.defaultwidget_id) {
                defaults.widget_id = this.datatype.defaultwidget_id;
                defaults.config = widgets[defaults.widget_id].defaultconfig;
            }
            if (this.node) {
                defaults.node_id = this.node.nodeid;
                defaults.label = this.node.name();
            }
            if (this.card) {
                defaults.card_id = this.card.get('id');
            }

            attributes = _.defaults(attributes, defaults);

            AbstractModel.prototype.constructor.call(this, attributes, options);

            this.configJSON = ko.computed({
                read: function () {
                    var configJSON = {};
                    var config = this.get('config');
                    _.each(this.configKeys(), function(key) {
                        configJSON[key] = config[key]();
                    });
                    configJSON.label = this.get('label')();
                    return configJSON;
                },
                write: function (value) {
                    var config = this.get('config');
                    for (key in value) {
                        if (key === 'label') {
                            this.get('label')(value[key]);
                        }
                        if (config[key] && config[key]() !== value[key]) {
                            config[key](value[key]);
                        }
                    }
                },
                owner: this
            });

            return this;
        },

        /**
         * parse - parses the passed in attributes into a {@link CardWidgetModel}
         * @memberof CardWidgetModel.prototype
         * @param  {object} attributes - the properties to seed a {@link CardWidgetModel} with
         */
        parse: function(attributes){
            var self = this;

            _.each(attributes, function(value, key){
                if (key === 'config' && typeof value === 'string') {
                    value = JSON.parse(value);
                    var configKeys = [];
                    _.each(value, function(configVal, configKey) {
                        value[configKey] = ko.observable(configVal);
                        configKeys.push(configKey);
                    });
                    this.set(key, value);
                    this.configKeys = ko.observableArray(configKeys);
                } else if (key==='widget_id') {
                    var widgetId = ko.observable(value);
                    this.set(key, ko.computed({
                        read: function () {
                            return widgetId();
                        },
                        write: function (value) {
                            var defaultConfig = JSON.parse(widgets[value].defaultconfig);
                            for (key in defaultConfig) {
                                defaultConfig[key] = ko.observable(defaultConfig[key]);
                            }
                            var currentConfig = this.get('config');
                            this.set('config', _.defaults(currentConfig, defaultConfig));
                            for (key in defaultConfig) {
                                self.configKeys.push(key)
                            }
                            widgetId(value);
                        },
                        owner: this
                    }));
                } else if (key === 'functions') {
                    this.set(key, ko.observableArray(value));
                } else {
                    this.set(key, ko.observable(value));
                }
            }, this);
        },


        /**
         * toJSON - casts the model as a JSON object
         * @return {object} a JSON object representation of the model
         */
        toJSON: function () {
            var ret = {};
            for(key in this.attributes){
                if (key !== 'config') {
                    ret[key] = this.attributes[key]();
                } else {
                    ret[key] = JSON.stringify(this.configJSON())
                }
            }
            return ret;
        }
    });
});

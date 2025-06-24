(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'jvectormap'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'), require('jvectormap'));
    } else {
        factory(jQuery, jQuery.fn.vectorMap);
    }
}(function($, VectorMap) {
    VectorMap.maps['world_mill_en'] = {
        "width": 900,
        "height": 500,
        "paths": {
            "AF": {"name": "Afghanistan", "path": "M..."},
            "AL": {"name": "Albania", "path": "M..."},
            "DZ": {"name": "Algeria", "path": "M..."},
            // Add all country paths here
        }
    };
}));

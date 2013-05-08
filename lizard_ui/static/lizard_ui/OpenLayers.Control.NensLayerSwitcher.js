/* Copyright (c) 2006-2012 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the 2-clause BSD license.
 * See license.txt in the OpenLayers distribution or repository for the
 * full text of the license. */
/* Copyright(c) 2013 by Nelen en Schuurmans. GPL */

/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Lang.js
 * @requires OpenLayers/Console.js
 * @requires OpenLayers/Events/buttonclick.js
 * @required jquery.js
 * @required underscore.js
 */

/**
 * Class: OpenLayers.Control.NensLayerSwitcher
 * The NensLayerSwitcher control displays a table of contents for the map. This
 * allows the user interface to switch between BaseLasyers and to show or hide
 * Overlays. By default the switcher is shown minimized on the right edge of
 * the map, the user may expand it by clicking on the handle.
 * This is integrated with the action bar on lizard-map.
 *
 * To create the LayerSwitcher outside of the map, pass the Id of a html div
 * as the first argument to the constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Control>
 */
OpenLayers.Control.NensLayerSwitcher =
  OpenLayers.Class(OpenLayers.Control, {

      /**
     * Property: dropdownTemplate
     * {underscoreTemplate} The template that contains the dropdown elements.
     */

	  dropdownTemplate: _.template('' +
		  '<li role="presentation">' +
               '<a href="#"' +
		          'class="layer"'+
                  'data-layer-id="<%= layer_id %>">' +
                  '<% if (checked){ %> <i class="icon-ok"></i> <% }%>' +
   			      '<%= name %>' +
               '</a>' +
          '</li>'),


    /**
     * Property: layerStates
     * {Array(Object)} Basically a copy of the "state" of the map's layers
     *     the last time the control was drawn. We have this in order to avoid
     *     unnecessarily redrawing the control.
     */
    layerStates: null,


    // DOM Elements

    /**
     * Property: layersElement
     * {DOMElement}
     */
    layersElement: null,

	      /**
     * Property: baseLayersElement
     * {DOMElement}
     */
    baseLayersElement: null,


    /**
     * Property: baseLayersDiv
     * {DOMElement}
     */
    baseLayersDiv: null,

    /**
     * Property: baseLayers
     * {Array(Object)}
     */
    baseLayers: null,


    /**
     * Property: dataLbl
     * {DOMElement}
     */
    dataLbl: null,

    /**
     * Property: dataLayersDiv
     * {DOMElement}
     */
    dataLayersDiv: null,

    /**
     * Property: baseActionsLayers
     * {DOMElement}
     */
    baseActionLayers: null,

    /**
     * Property: actionLayers
     * {DOMElement}
     */
    actionLayers: null,


    /**
     * Property: dataLayers
     * {Array(Object)}
     */
    dataLayers: null,


    /**
     * APIProperty: ascending
     * {Boolean}
     */
    ascending: true,


    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters:
     * options - {Object}
     */
    initialize: function(options) {
		// ToDo:
		// check underscore and jquery,
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        this.layerStates = [];
    },

    /**
     * APIMethod: destroy
     */
    destroy: function() {
	},

    /**
     * Method: setMap
     *
     * Properties:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            addlayer: this.redraw,
            changelayer: this.redraw,
            removelayer: this.redraw,
            changebaselayer: this.redraw,
            scope: this
        });
    },

    /**
     * Method: draw
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the
     *     switcher tabs.
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // populate div with current info
        this.redraw();

        return this.div;
    },

    /**
     * Method: onButtonClick
     *
     * Parameters:
     * evt - {Event}
     */
    /**
     * Method: clearLayersArray
     * User specifies either "base" or "data". we then clear all the
     *     corresponding listeners, the div, and reinitialize a new array.
     *
     * Parameters:
     * layersType - {String}
     */
    clearLayersArray: function(layersType) {
		if (layersType==="base") {
			this.baseLayersElement.children().remove();
		}
		else {
			this.layersElement.children().remove();
		}
    },


    /**
     * Method: checkRedraw
     * Checks if the layer state has changed since the last redraw() call.
     *
     * Returns:
     * {Boolean} The layer state changed since the last redraw() call.
     */
    checkRedraw: function() {
        var redraw = false;
        if ( !this.layerStates.length ||
             (this.map.layers.length != this.layerStates.length) ) {
            redraw = true;
        } else {
            for (var i=0, len=this.layerStates.length; i<len; i++) {
                var layerState = this.layerStates[i];
                var layer = this.map.layers[i];
                if ( (layerState.name != layer.name) ||
                     (layerState.inRange != layer.inRange) ||
                     (layerState.id != layer.id) ||
                     (layerState.visibility != layer.visibility) ) {
                    redraw = true;
                    break;
                }
            }
        }
        return redraw;
    },

    /**
     * Method: redraw
     * Goes through and takes the current state of the Map and rebuilds the
     *     control to display that state. Groups base layers into a
     *     radio-button group and lists each data layer with a checkbox.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    redraw: function() {
        //if the state hasn't changed since last redraw, no need
        // to do anything. Just return the existing div.
        if (!this.checkRedraw()) {
            return this.div;
        }

		this.clearLayersArray("base");
		this.clearLayersArray("layers");
        var containsOverlays = false;
        var containsBaseLayers = false;

        // Save state -- for checking layer if the map state changed.
        // We save this before redrawing, because in the process of redrawing
        // we will trigger more visibility changes, and we want to not redraw
        // and enter an infinite loop.
        var len = this.map.layers.length;
        this.layerStates = new Array(len);
        for (var i=0; i <len; i++) {
            var layer = this.map.layers[i];
            this.layerStates[i] = {
                'name': layer.name,
                'visibility': layer.visibility,
                'inRange': layer.inRange,
                'id': layer.id
            };
        }

		var layers = this.map.layers.slice();
		for(var i=0, len=layers.length; i<len; i++) {
            var layer = layers[i];
            var baseLayer = layer.isBaseLayer;

            if (layer.displayInLayerSwitcher) {

                // only check a baselayer if it is *the* baselayer, check data
                //  layers if they are visible
                var checked = (baseLayer) ? (layer == this.map.baseLayer)
                    : layer.getVisibility();

				if (baseLayer) {
					// We only use base layers for now.
					this.baseLayersElement.append(
						this.dropdownTemplate({'name': layer.name,
											   'checked': checked,
											   'layer_id': layer.id}));
				}
				else {
					this.layersElement.append(
						this.dropdownTemplate({'name': layer.name,
											   'checked': checked,
											   'layer_id': layer.id}));
				}
			}
		};

        // Switch between base layers with a click.
		this.baseLayersElement.find('.layer').click(function(e){
			map.setBaseLayer(map.getLayer($(e.target).data('layer-id')));
			e.preventDefault();
			e.stopPropagation();
		});

		// Enable/disable the layers with a click.
		this.layersElement.find('.layer').click(function(e){
			var layer = map.getLayer($(e.target).data('layer-id'));
			layer.setVisibility(!layer.visibility);
			e.preventDefault();
			e.stopPropagation();
		});

		// Hide the action layers icon when there are no layers to display.
		if (this.actionLayers.find('.layer').length === 0){
			this.actionLayers.hide();
		} else {
			this.actionLayers.show();
		}

        return this.div;
    },

    /**
     * Method: updateMap
     * Cycles through the loaded data and base layer input arrays and makes
     *     the necessary calls to the Map object such that that the map's
     *     visual state corresponds to what the user has selected in
     *     the control.
     */
    updateMap: function() {
        // set the newly selected base layer
        for(var i=0, len=this.baseLayers.length; i<len; i++) {
            var layerEntry = this.baseLayers[i];
            if (layerEntry.inputElem.checked) {
                this.map.setBaseLayer(layerEntry.layer, false);
            }
        }

        // set the correct visibilities for the overlays
        for(var i=0, len=this.dataLayers.length; i<len; i++) {
            var layerEntry = this.dataLayers[i];
            layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
        }

    },


    /**
     * Method: loadContents
     * Set up the labels and divs for the control
     */
    loadContents: function() {

		// Enable the dropdowns.
		$('#action-layers .dropdown-toggle').attr('data-toggle', 'dropdown');
		$('#action-base-layers .dropdown-toggle').attr('data-toggle',
													   'dropdown');

		// Get the placeholders.
		this.actionLayers = $('#action-layers');
		this.baseActionLayers = $('#action-base-layers');
		this.actionLayers.addClass('dropdown');
		this.baseActionLayers.addClass('dropdown');

		// Build the dropdown scaffold.
		var layersUl = $('<ul>').attr('id', 'action-layers-ul'
							   ).attr('class', 'dropdown-menu'
							   ).attr('role', 'menu');

		var baseLayersUl = $('<ul>').attr('id', 'action-base-layers-ul'
								   ).attr('class', 'dropdown-menu'
								   ).attr('role', 'menu');

		// Put the scaffold in the placeholders.
		this.actionLayers.append(layersUl);
		this.baseActionLayers.append(baseLayersUl);

		// Get the references to the dropdowns.
		this.layersElement = $('#action-layers-ul');
		this.baseLayersElement = $('#action-base-layers-ul');
    },

    CLASS_NAME: "OpenLayers.Control.NensLayerSwitcher"
});

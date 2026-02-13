// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

// ADD THE HIGH-QUALITY LOCAL IMAGE LAYER.
// This works now because the full library was loaded first in index.html.
wwd.addLayer(new WorldWind.SurfaceImageLayer(WorldWind.Sector.FULL_SPHERE, "images/PathfinderMap.jpg"));

// Add other essential layers
wwd.addLayer(new WorldWind.CompassLayer());
wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

// Add a polygon
var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);
var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;
var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));
var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
polygonLayer.addRenderable(polygon);

// Add a COLLADA model
var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);
var position = new WorldWind.Position(10.0, -125.0, 800000.0);
var config = {dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/'};
var colladaLoader = new WorldWind.ColladaLoader(position, config);
colladaLoader.load("duck.dae", function (colladaModel) {
    colladaModel.scale = 9000;
    modelLayer.addRenderable(colladaModel);
});

// Add WMS imagery
var serviceAddress = "https://neo.gsfc.nasa.gov/wms/wms?version=1.3.0&service=WMS&request=GetCapabilities";
var layerName = "MOD_LSTD_CLIM_M";
var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};
var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
};
$.get(serviceAddress).done(createLayer).fail(logError);

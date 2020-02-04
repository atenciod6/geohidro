/* Declaras los módulos*/
var map;
require([
        "dojo/dom-construct",
        "esri/Map",
        "esri/views/MapView",
        "esri/widgets/Search",
        "esri/widgets/Locate",
        "esri/widgets/Home",
        "esri/widgets/LayerList",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Expand",
        "esri/widgets/Legend",
        "esri/widgets/ScaleBar",
        "esri/layers/MapImageLayer",
        "esri/layers/GeoRSSLayer",
        "esri/widgets/Print",
        "esri/widgets/CoordinateConversion",
        "dojo/domReady!"
      ],
      function(
        domConstruct, Map, MapView, Search, Locate, Home, LayerList, BasemapGallery, Expand, Legend, ScaleBar, MapImageLayer, GeoRSSLayer, Print, CoordinateConversion
      ) {
        /*****************************************************************
         * Create a MapImageLayer instance pointing to a Map Service
         * containing data about US Cities, Counties, States and Highways.
         * Define sublayers with visibility for each layer in Map Service.
         *****************************************************************/
        
        var layer1 = new MapImageLayer({
        url: "http://geosnirh.ana.gob.pe/arcgis/rest/services/SERV_AMBITOS_ADMINISTRATIVOS/MapServer",
        title:"Ámbitos Administrativos",
            sublayers:[{
              title:"Autoridad Administrativa del Agua",
              id:0,
              popupTemplate: {
                  title:"Autoridad Administrativa del Agua: {NAME_AAA}",
                  content:[{
                          type: "fields",
                          fieldInfos: [{
                              fieldName: "AREA_KM2",
                              label: "Área (km2)",
                              visible: true,
                                format: {
                                digitSeparator: false,
                                places: 0
                                }
                          }]
                  }]
              }
            }]
        });
  
        var layer2 = new MapImageLayer({
          url: "http://geo.ana.gob.pe/arcgis/rest/services/OAChirilu/SERV_CALIDAD_SUPERFICIAL_ICA/MapServer",
          title: "Calidad superficial"
        });
        layer2.opacity = 0.75;
        
        var layer3 = new MapImageLayer({
          url: "http://geo.ana.gob.pe/arcgis/rest/services/SERV_CARTOGRAFIA_BASE_UTM18S/MapServer",
          title: "Cartografía base"
        });
        
        var layer4 = new MapImageLayer({
            url: "http://geo.ana.gob.pe/arcgis/rest/services/GeoHidroV2/GESTION_RIESGO_DESASTRE/MapServer",
            title: "Gestión de Riesgo",
            sublayers: [{
                id: 32,
                title: "Fajas marginales",
                popupTemplate: {
                    title: "Faja Marginal: {DBAnaPublic.IDE.FajasMarginales.TIPCUE} {DBAnaPublic.IDE.FajasMarginales.NOMCUE}",
                    content: [{
                        type: "text",
                        text: "In this county, {UNEMPRT_CY}% of the labor force is unemployed. "
                            + " {expression/strength-arcade}% of the {POP_16UP} people ages 16+"
                            + " living here are {expression/predominance-arcade}."
            }, {
                type: "fields",
                fieldInfos: [{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.MARGEN",
                    label: "Margen"
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.RESAPROB",
                    label: "Resolución de aprobación"
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.FECAPROB",
                    label: "Fecha de aprobación",
                    format: {
                        dateFormat: "short-date-le"
                    }
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.ESTE",
                    label: "Este",
                    format: {
                        digitSeparator: false,
                        places: 2
                    }
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.NORTE",
                    label: "Norte",
                    format: {
                        digitSeparator: false,
                        places: 2
                    }
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.ZONAUTM",
                    label: "Zona UTM"
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.NOMDEP",
                    label: "Departamento"
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.NOMPROV",
                    label: "Provincia"
                },{
                    fieldName: "DBAnaPublic.IDE.FajasMarginales.NOMDIST",
                    label: "Distrito"
                }      
                ]},
                {
                type: "text",
                text: "<a href={DBAnaPublic.IDE.FajasLink.LINK}><b>Ver resolución de aprobación</b></a>"
                },{
                type: "media",
                mediaInfos: [{
                  title: "",
                  type: "image",
                  value: {
                    sourceURL: "http://ftp.ana.gob.pe/docs/images/ResolucionView.jpg"
                  }
                }]
                }
            ]
                }

            }]
        });
        
         // Point to the rss feed url
        var layer5 = new GeoRSSLayer({
          url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.atom",
          title: "Sismos 7 últimos días"
        });
               
        /*****************************************************************
         * Add the layer to a map
         *****************************************************************/
        map = new Map({
          basemap: "streets",
          layers: [layer5,layer1,layer2,layer4,layer3]
        });

        var view = new MapView({
          container: "viewDiv",
          map: map,
          zoom: 6,
          center: [-74, -9]
        });
        
        /* Add the layer to a map*/
        var logo = domConstruct.create("img", {
        src: "images/logo.png",
        style: "height:56px;",
        id: "logo",
        title: "logo"
        });
        view.ui.add(logo, "bottom-right");
        
        var searchWidget = new Search({
            view: view
        });

        // Add the search widget to the top right corner of the view
        view.ui.add(searchWidget, {
            position: "top-right"
        });
        
        var homeBtn = new Home({
            view: view
        });

        // Add the home button to the top left corner of the view
        view.ui.add(homeBtn, "top-left");
        
        var locateBtn = new Locate({
            view: view
        });

        // Add the locate widget to the top left corner of the view
        view.ui.add(locateBtn, {
            position: "top-left"
        });
        
        view.when(function() {
            var layerList = new LayerList({
                container: document.createElement("div"),
                view: view
            });
            
           layerListExpand = new Expand({
           expandIconClass: "esri-icon-layer-list",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
           // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
           view: view,
           content: layerList.domNode,
           group: "top-right"
           });
        // Add widget to the top right corner of the view
        view.ui.add(layerListExpand, "top-right");
        });
        
         var basemapGallery = new BasemapGallery({
            container: document.createElement("div"),
            view: view
         });

        basemapGalleryExpand = new Expand({
          expandIconClass: "esri-icon-basemap",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
          view: view,
          content: basemapGallery.domNode,
          group: "top-right"
        });

        // Add the widget to the top-right corner of the view
        //view.ui.add(basemapGalleryExpand, {
        //    position: "bottom-left"
        //});
        
        view.when(function() {
          var print = new Print({
            container: document.createElement("div"),
            view: view,
            // specify your own print service
            printServiceUrl: "http://geo.ana.gob.pe/arcgis/rest/services/Geoprocesos/ExportWebMap/GPServer/Export%20Web%20Map"
          });
          
        printExpand = new Expand({
          expandIconClass: "esri-icon-printer",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          view: view,
          content: print.domNode,
          group: "top-right"
        });

          // Add widget to the top right corner of the view
          view.ui.add(printExpand, "top-right");
        });
        
        var legend = new Legend({
            container: document.createElement("div"),
            view: view,
            layerInfos: [{
              layer: layer1,
              title: "Ámbitos administrativos"
            },{
              layer: layer2,
              title: "Calidad Superficial"
            },{
              layer: layer3,
              title: "Cartografía base"
            },{
              layer: layer4,
              title: "Gestión de Riesgo"
            }]
          });
          // Add widget to the bottom right corner of the view
          
        legendExpand = new Expand({
          expandIconClass: "esri-icon-table",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
          view: view,
          content: legend.domNode,
          group: "top-right"
        });
          
        view.ui.add([legendExpand,basemapGalleryExpand], "top-right");
        
        var scaleBar = new ScaleBar({
            view: view,
            unit: "dual", // The scale bar displays both metric and non-metric units.
            style: "ruler"
        });

        // Add the widget to the bottom left corner of the view
        view.ui.add(scaleBar, {
            position: "bottom-left"
        });
        
        var ccWidget = new CoordinateConversion({
  view: view
});

// Adds widget in the bottom left corner of the view
view.ui.add(ccWidget, "bottom-left");

      });



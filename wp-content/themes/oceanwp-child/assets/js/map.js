var nagoyaMap = (function () {
  var targetCountryCode;

  const borderLayerSettings = {
    opacity: 1,
    color: '#333',
    dashArray: '',
    lineCap: 'butt',
    lineJoin: 'miter',
    weight: 1.0,
    fill: true,
    fillOpacity: 1,
    fillColor: '#fff',
  };

  function createMap(layer) {
    const map = L.map('map', {
      zoomControl: true,
      maxZoom: 28,
      minZoom: 1
    }).fitBounds([
      [-60, 0],
      [90, 0]
    ]);

    return map.addLayer(layer);
  }

  function highlightFeature(e) {
    const highlightLayer = e.target;

    if (e.target.feature.geometry.type === 'LineString') {
      highlightLayer.setStyle({
        color: '#ffff00',
      });
    } else {
      highlightLayer.setStyle({
        fillColor: '#ffff00',
        fillOpacity: 1
      });
    }
  }

  function popup_TM_WORLD_BORDERS_SIMPL03_0(feature, layer) {
    layer.on({
      mouseout: function (e) {
        for (i in e.target._eventParents) {
          e.target._eventParents[i].resetStyle(e.target);
        }
      },
      mouseover: highlightFeature,
    });
    var popupContent = (feature.properties['NAME']);

    if(feature.status) {
      popupContent += '<br>' + feature.status;
    }
    layer.bindPopup(popupContent, {
      maxHeight: 400
    });
  }


  // ==================
  // target country map
  // ==================

  function setTargetCountryCode(code) {
	  targetCountryCode = code;
  }

  function centerLeafletMapOnCountry() {
    if(!document.querySelector('#map')) { return }

    const borderLayer = new L.geoJson(json_TM_WORLD_BORDERS_SIMPL03_0, {
      attribution: '',
      onEachFeature: popup_TM_WORLD_BORDERS_SIMPL03_0,
      style: styleTargetCountry,
    });
    const map = createMap(borderLayer);

    const country = json_TM_WORLD_BORDERS_SIMPL03_0.features
    .find(feature => feature.properties.ISO2 == targetCountryCode)

    var factor = (Math.sqrt(country.properties['AREA']) / 30) + 1;
    var latLng1 = [country.properties['LAT'] + factor, country.properties['LON'] + factor];
    var latLng2 = [country.properties['LAT'] - factor, country.properties['LON'] - factor];
    map.fitBounds(L.latLngBounds(latLng1, latLng2));
  }

  function getTargetCountryColor(countryCode) {
    return targetCountryCode === countryCode ? '#BD0026' : '#fff';
  }

  function styleTargetCountry(feature) {
    return { ...borderLayerSettings,
      fillColor: getTargetCountryColor(feature.properties['ISO2'])
    }
  }


  // ==================
  // country status map
  // ==================

  function addStatusToGeoJson() {
    return fetch('http://nagoya.local/wp-json/wp/v2/country/')
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      return json.map((country) => {
        let status = determineStatus (country);

        const geojsonCountry = json_TM_WORLD_BORDERS_SIMPL03_0.features
          .find(feature => feature.properties.ISO2 == country.country_code)

          if (geojsonCountry) {
          geojsonCountry.status = status
          return geojsonCountry;
        }
      }).filter(country => country)
    })
  }

  function determineStatus (country) {
    let status;
    const nullDate = '0000-00-00';

    if (country.party !== nullDate &&
      country.deposit !== nullDate &&
      (new Date(country.party) < new Date())) {
      status = 'party'
    } else if (country.party !== nullDate) {
      status = 'party, not ratified'
    } else {
      status = 'nonparty'
    }
    return status;
  }


  function displayCountriesByStatus () {
    if(!document.querySelector('#map')) { return }

    addStatusToGeoJson().then((data) => {
      const borderLayer = new L.geoJson(
        {...json_TM_WORLD_BORDERS_SIMPL03_0, features: data},
        {
          attribution: '',
          onEachFeature: popup_TM_WORLD_BORDERS_SIMPL03_0,
          style: styleCountryStatus,
        }
      );
      const map = createMap(borderLayer);
      const legend = createLegend();
      legend.addTo(map);

    })
  }

  function createLegend () {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'map-legend');
      div.innerHTML += `
      green: party<br>
      purple: party, not ratified<br>
      red: nonparty
      `

       return div;
    };

    return legend;
  }


  function getCountryStatusColor(country) {
    let color;
    if (country.status === 'party') {
      color = 'green'
    } else if (country.status === 'party, not ratified') {
      color = 'purple'
    } else {
      color = 'red'
    }

    return color
  }

  function styleCountryStatus(feature) {
    return { ...borderLayerSettings,
      fillColor: getCountryStatusColor(feature)
    }
  }

  return {
    centerLeafletMapOnCountry: centerLeafletMapOnCountry,
    setTargetCountryCode: setTargetCountryCode,
    displayCountriesByStatus: displayCountriesByStatus,
  }

})()

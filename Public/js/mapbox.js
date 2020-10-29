


export const displayMap = (locations) => {
 
mapboxgl.accessToken = 'pk.eyJ1IjoiYWJkZWxyYWhtYW45MCIsImEiOiJja2cxOWNtdjYwem15MnVvYnMzaGxneGRjIn0.6o8f9OkcuIxSSy9XtxafZA';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/abdelrahman90/ckg1yh30z07ko19ol5fz7l7pc',
scrollZoom:false,
});

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    // Add Element
    const el = document.createElement('div')
    el.className = 'marker'
    
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',

    }).setLngLat(loc.coordinates).addTo(map)

    new mapboxgl.Popup({
        offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}:${loc.description}</p>`).addTo(map)

    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        left: 100,
        right:100
    }
})

}
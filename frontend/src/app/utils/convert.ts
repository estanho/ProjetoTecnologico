import type { DirectionsResponseData } from '@googlemaps/google-maps-services-js';

export function convertDirectionsResponseToDirectionsResult(
  directionsResponseData?: DirectionsResponseData & { request: any },
): google.maps.DirectionsResult {
  const copy = { ...directionsResponseData };
  return {
    available_travel_modes:
      copy.available_travel_modes as google.maps.TravelMode[],
    geocoded_waypoints: copy.geocoded_waypoints,
    status: copy.status,
    request: copy.request,
    //@ts-expect-error
    routes: copy.routes?.map((route) => {
      const bounds = new google.maps.LatLngBounds(
        route.bounds.southwest,
        route.bounds.northeast,
      );
      return {
        bounds,
        overview_path: google.maps.geometry.encoding.decodePath(
          route.overview_polyline.points,
        ),
        overview_polyline: route.overview_polyline,
        warnings: route.warnings,
        copyrights: route.copyrights,
        summary: route.summary,
        waypoint_order: route.waypoint_order,
        fare: route.fare,
        legs: route.legs.map((leg) => ({
          ...leg,
          start_location: new google.maps.LatLng(
            leg.start_location.lat,
            leg.start_location.lng,
          ),
          end_location: new google.maps.LatLng(
            leg.end_location.lat,
            leg.end_location.lng,
          ),
          steps: leg.steps.map((step) => ({
            path: google.maps.geometry.encoding.decodePath(
              step.polyline.points,
            ),
            start_location: new google.maps.LatLng(
              step.start_location.lat,
              step.start_location.lng,
            ),
          })),
        })),
      };
    }),
  };
}

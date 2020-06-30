
const arePointsNear=(checkPoint, centerPoint, km)=> {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return {
     bool:   Math.sqrt(dx * dx + dy * dy) <= km,
      difference:  Math.sqrt(dx * dx + dy * dy)};
}
function compare( a, b ) {
    if ( a.difference > b.difference ){
      return b;
    }
    if ( a.difference < b.difference ){
      return a;
    }
    return a;
  }
  

export { arePointsNear,compare}
import Big from 'big.js';

export module Util {
  export function getDistance(a, b){

    a = {
      lat: new Big(a.lat),
      lng: new Big(a.lng)
    }
    b = {
      lat: new Big(b.lat),
      lng: new Big(b.lng)
    }

    let n = a.lat.minus(b.lat);
    let m = a.lng.minus(b.lng);
    n = n.pow(2);
    m = m.pow(2);
    let sum = n.plus(m);
    return +sum.sqrt();
  }

  /*function rad(x) {
    return x * Math.PI / 180;
  };

  export function getDistance(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };*/

}

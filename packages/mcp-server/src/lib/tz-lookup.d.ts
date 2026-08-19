// Minimal ambient declaration for the tz-lookup CommonJS package.
// The package ships without types and there is no @types/tz-lookup entry.
// Signature per README: tzlookup(lat, lng) -> 'IANA/Timezone_Name'.
declare module 'tz-lookup' {
  const tzLookup: (lat: number, lng: number) => string;
  export default tzLookup;
}

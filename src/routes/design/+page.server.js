export async function load({ params, url }) {
    let lat = url.searchParams.get('lat');
    let lng = url.searchParams.get('lng');
    return { lat, lng }
}

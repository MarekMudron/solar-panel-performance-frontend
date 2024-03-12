import { readable, writable } from 'svelte/store';
export const API_KEY = readable("ndlT4EteZJq8MLtDb8sFD02mRv1aqKrTYmItv5vGPaI");

export const currentLocation = writable([-1, -1]);

export const buildingComponents = writable([])



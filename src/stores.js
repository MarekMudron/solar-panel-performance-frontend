import { readable, writable } from 'svelte/store';

export const API_KEY = readable("ndlT4EteZJq8MLtDb8sFD02mRv1aqKrTYmItv5vGPaI");

export const currentLocation = writable({});

export const panelArray = writable([])

export const isTextureLoaded = writable(false)

export const isThreeJsSetup = writable(false)

export const currentStage = writable(0)



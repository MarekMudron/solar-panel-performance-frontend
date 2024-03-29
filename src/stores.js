import { readable, writable } from 'svelte/store';

export const API_KEY = readable("ndlT4EteZJq8MLtDb8sFD02mRv1aqKrTYmItv5vGPaI");

// {lat, lon, alt}
export const currentLocation = writable({});

export const didLocationChange = writable(false)

export const texture = writable()

export const stageInProgress = writable(0)

export const currentStage = writable(0)

export const siteStorage = writable()

export const stringsStorage = writable([])

export const keypoints2dStorage = writable();
export const keypoints3dStorage = writable();
export const panelTemplates = writable([]);
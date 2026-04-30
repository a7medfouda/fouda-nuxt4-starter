// Cache the GSAP imports to avoid re-importing on every call
let gsapCache: any = null;
let scrollTriggerCache: any = null;

export const useGsap = async () => {
  // Return cached versions if already loaded
  if (gsapCache && scrollTriggerCache) {
    return { gsap: gsapCache, ScrollTrigger: scrollTriggerCache };
  }

  // Dynamic import only happens once
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");

  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Cache for future use
  gsapCache = gsap;
  scrollTriggerCache = ScrollTrigger;

  return { gsap, ScrollTrigger };
};

// Optional: Separate composable if you only need core GSAP without ScrollTrigger
export const useGsapCore = async () => {
  if (gsapCache) {
    return { gsap: gsapCache };
  }

  const { gsap } = await import("gsap");
  gsapCache = gsap;

  return { gsap };
};

// Optional: For other GSAP plugins
export const useGsapPlugin = async (
  pluginName:
    | "Draggable"
    | "MotionPathPlugin"
    | "TextPlugin"
    | "MorphSVGPlugin",
) => {
  const { gsap } = await useGsapCore();

  let plugin;
  switch (pluginName) {
    case "Draggable":
      plugin = (await import("gsap/Draggable")).Draggable;
      break;
    case "MotionPathPlugin":
      plugin = (await import("gsap/MotionPathPlugin")).MotionPathPlugin;
      break;
    case "TextPlugin":
      plugin = (await import("gsap/TextPlugin")).TextPlugin;
      break;
    case "MorphSVGPlugin":
      plugin = (await import("gsap/MorphSVGPlugin")).MorphSVGPlugin;
      break;
  }

  if (import.meta.client && plugin) {
    gsap.registerPlugin(plugin);
  }

  return { gsap, plugin };
};

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">
          GSAP Animation Playground
        </h1>
        <p class="text-gray-300 text-lg">10 Different Animation Types</p>
        <button
          @click="replayAll"
          class="mt-6 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
        >
          Replay All Animations
        </button>
      </div>

      <!-- Animation Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- 1. Fade In Up -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">1. Fade In Up</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box1"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-pink-500 to-rose-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Fade Up</span>
            </div>
          </div>
        </div>

        <!-- 2. Scale & Rotate -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">
            2. Scale & Rotate
          </h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box2"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-blue-500 to-cyan-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Scale</span>
            </div>
          </div>
        </div>

        <!-- 3. Bounce -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">3. Bounce</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box3"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-green-500 to-emerald-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Bounce</span>
            </div>
          </div>
        </div>

        <!-- 4. Elastic -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">4. Elastic</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box4"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-yellow-500 to-orange-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Elastic</span>
            </div>
          </div>
        </div>

        <!-- 5. Flip -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">5. Flip 3D</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box5"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-purple-500 to-indigo-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Flip</span>
            </div>
          </div>
        </div>

        <!-- 6. Slide & Fade -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">6. Slide & Fade</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box6"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-red-500 to-pink-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Slide</span>
            </div>
          </div>
        </div>

        <!-- 7. Morph -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">7. Morph Shape</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box7"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-teal-500 to-cyan-500"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Morph</span>
            </div>
          </div>
        </div>

        <!-- 8. Stagger Text -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">8. Text Stagger</h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box8"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-violet-500 to-purple-500"
              style="perspective: 1000px"
            >
              <div class="flex gap-1">
                <span class="text-white font-bold text-3xl char">G</span>
                <span class="text-white font-bold text-3xl char">S</span>
                <span class="text-white font-bold text-3xl char">A</span>
                <span class="text-white font-bold text-3xl char">P</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. Magnetic -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">
            9. Magnetic (Hover)
          </h3>
          <div class="h-48 flex items-center justify-center relative">
            <div
              ref="box9"
              class="w-32 h-32 rounded-2xl shadow-2xl flex items-center justify-center relative bg-gradient-to-br from-amber-500 to-orange-500 cursor-pointer"
              style="perspective: 1000px"
            >
              <span class="text-white font-bold text-lg">Hover Me</span>
            </div>
          </div>
        </div>

        <!-- 10. Path Animation -->
        <div
          class="rounded-xl p-6 border backdrop-blur-sm bg-gray-800 border-gray-700"
          style="opacity: 0.95"
        >
          <h3 class="text-white text-lg font-semibold mb-4">10. Motion Path</h3>
          <div class="h-48 flex items-center justify-center relative">
            <svg
              class="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 200 200"
            >
              <path
                ref="path"
                d="M 20 100 Q 100 20, 180 100 T 20 100"
                fill="none"
                stroke="white"
                stroke-width="2"
              />
            </svg>
            <div
              ref="box10"
              class="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center absolute bg-gradient-to-br from-fuchsia-500 to-pink-500"
            >
              <span class="text-xs text-white">Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// Refs for all boxes
const box1 = ref(null);
const box2 = ref(null);
const box3 = ref(null);
const box4 = ref(null);
const box5 = ref(null);
const box6 = ref(null);
const box7 = ref(null);
const box8 = ref(null);
const box9 = ref(null);
const box10 = ref(null);
const path = ref(null);

let animations = [];

const initAnimations = async () => {
  // Lazy load GSAP
  const { gsap } = await import("gsap");
  const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");

  gsap.registerPlugin(MotionPathPlugin);

  // Clear previous animations
  animations.forEach((anim) => anim.kill());
  animations = [];

  // 1. Fade In Up
  animations.push(
    gsap.fromTo(
      box1.value,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 },
    ),
  );

  // 2. Scale & Rotate
  animations.push(
    gsap.fromTo(
      box2.value,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.4,
      },
    ),
  );

  // 3. Bounce
  animations.push(
    gsap.fromTo(
      box3.value,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "bounce.out", delay: 0.6 },
    ),
  );

  // 4. Elastic
  animations.push(
    gsap.fromTo(
      box4.value,
      { x: -100, rotation: -90 },
      {
        x: 0,
        rotation: 0,
        duration: 1.8,
        ease: "elastic.out(1, 0.5)",
        delay: 0.8,
      },
    ),
  );

  // 5. Flip 3D
  animations.push(
    gsap.fromTo(
      box5.value,
      { rotationY: -180, opacity: 0 },
      { rotationY: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 1 },
    ),
  );

  // 6. Slide & Fade
  animations.push(
    gsap.fromTo(
      box6.value,
      { x: 100, opacity: 0, skewX: 20 },
      {
        x: 0,
        opacity: 1,
        skewX: 0,
        duration: 1,
        ease: "power3.out",
        delay: 1.2,
      },
    ),
  );

  // 7. Morph Shape
  animations.push(
    gsap.fromTo(
      box7.value,
      { borderRadius: "50%", scale: 0.5, rotation: 0 },
      {
        borderRadius: "20px",
        scale: 1,
        rotation: 360,
        duration: 1.5,
        ease: "power2.inOut",
        delay: 1.4,
      },
    ),
  );

  // 8. Text Stagger
  const chars = box8.value.querySelectorAll(".char");
  animations.push(
    gsap.fromTo(
      chars,
      { opacity: 0, y: 30, rotation: -20 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(2)",
        delay: 1.6,
      },
    ),
  );

  // 9. Magnetic effect on hover
  box9.value.addEventListener("mouseenter", () => {
    gsap.to(box9.value, { scale: 1.1, duration: 0.3, ease: "power2.out" });
  });
  box9.value.addEventListener("mouseleave", () => {
    gsap.to(box9.value, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
  box9.value.addEventListener("mousemove", (e) => {
    const rect = box9.value.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(box9.value, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
  });

  animations.push(
    gsap.fromTo(
      box9.value,
      { scale: 0, rotation: 180 },
      { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)", delay: 1.8 },
    ),
  );

  // 10. Motion Path
  animations.push(
    gsap.fromTo(
      box10.value,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 3,
        delay: 2,
        ease: "none",
        motionPath: {
          path: path.value,
          align: path.value,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        repeat: -1,
        repeatDelay: 0.5,
      },
    ),
  );
};

const replayAll = () => {
  initAnimations();
};

onMounted(() => {
  initAnimations();
});
</script>

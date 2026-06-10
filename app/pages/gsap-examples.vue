<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#002240] via-[#0a3a6e] to-[#002240] py-20 overflow-hidden">
      <div class="absolute top-10 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl"></div>

      <SharedContainer class="relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium mb-8 border border-white/10">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            GSAP
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            GSAP Animation
            <span class="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Playground</span>
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            10 different animation types showcasing the power of GreenSock Animation Platform.
          </p>
          <button
            @click="replayAll"
            class="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 border border-white/20"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
            Replay All Animations
          </button>
        </div>
      </SharedContainer>
    </section>

    <!-- Animation Grid -->
    <section class="py-20 bg-gray-50">
      <SharedContainer>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- 1. Fade In Up -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">1. Fade In Up</h3>
            <p class="text-gray-400 text-xs mb-4">opacity + translateY</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box1" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500">
                <span class="text-white font-bold">Fade Up</span>
              </div>
            </div>
          </div>

          <!-- 2. Scale & Rotate -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">2. Scale & Rotate</h3>
            <p class="text-gray-400 text-xs mb-4">back.out easing</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box2" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <span class="text-white font-bold">Scale</span>
              </div>
            </div>
          </div>

          <!-- 3. Bounce -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">3. Bounce</h3>
            <p class="text-gray-400 text-xs mb-4">bounce.out easing</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box3" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                <span class="text-white font-bold">Bounce</span>
              </div>
            </div>
          </div>

          <!-- 4. Elastic -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">4. Elastic</h3>
            <p class="text-gray-400 text-xs mb-4">elastic.out easing</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box4" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-500">
                <span class="text-white font-bold">Elastic</span>
              </div>
            </div>
          </div>

          <!-- 5. Flip 3D -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">5. Flip 3D</h3>
            <p class="text-gray-400 text-xs mb-4">rotationY perspective</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50" style="perspective: 1000px">
              <div ref="box5" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500">
                <span class="text-white font-bold">Flip</span>
              </div>
            </div>
          </div>

          <!-- 6. Slide & Skew -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">6. Slide & Skew</h3>
            <p class="text-gray-400 text-xs mb-4">translateX + skewX</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box6" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
                <span class="text-white font-bold">Slide</span>
              </div>
            </div>
          </div>

          <!-- 7. Morph Shape -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">7. Morph Shape</h3>
            <p class="text-gray-400 text-xs mb-4">borderRadius + rotation</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box7" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-teal-500 to-cyan-500">
                <span class="text-white font-bold">Morph</span>
              </div>
            </div>
          </div>

          <!-- 8. Text Stagger -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">8. Text Stagger</h3>
            <p class="text-gray-400 text-xs mb-4">staggered character animation</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box8" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-500">
                <div class="flex gap-1">
                  <span class="text-white font-bold text-3xl char">G</span>
                  <span class="text-white font-bold text-3xl char">S</span>
                  <span class="text-white font-bold text-3xl char">A</span>
                  <span class="text-white font-bold text-3xl char">P</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 9. Magnetic Hover -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">9. Magnetic Hover</h3>
            <p class="text-gray-400 text-xs mb-4">mouse-follow effect</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50">
              <div ref="box9" class="w-28 h-28 rounded-2xl shadow-lg flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-500 cursor-pointer">
                <span class="text-white font-bold">Hover Me</span>
              </div>
            </div>
          </div>

          <!-- 10. Motion Path -->
          <div class="rounded-2xl p-6 bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 md:col-span-2 lg:col-span-3">
            <h3 class="text-gray-900 text-lg font-semibold mb-1">10. Motion Path</h3>
            <p class="text-gray-400 text-xs mb-4">SVG path-following animation</p>
            <div class="h-48 flex items-center justify-center rounded-xl bg-gray-50 relative">
              <svg class="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
                <path ref="motionPath" d="M 40 100 Q 200 20, 400 100 T 760 100" fill="none" stroke="#002240" stroke-width="2" />
              </svg>
              <div ref="box10" class="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center absolute bg-gradient-to-br from-fuchsia-500 to-pink-500">
                <UIcon name="i-heroicons-rocket-launch" class="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </SharedContainer>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

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
const motionPath = ref(null);

let animations = [];

const initAnimations = async () => {
  const { gsap } = await import("gsap");
  const { MotionPathPlugin } = await import("gsap/MotionPathPlugin");
  gsap.registerPlugin(MotionPathPlugin);

  animations.forEach((anim) => anim.kill());
  animations = [];

  // 1. Fade In Up
  animations.push(
    gsap.fromTo(box1.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 })
  );

  // 2. Scale & Rotate
  animations.push(
    gsap.fromTo(box2.value, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 1.2, ease: "back.out(1.7)", delay: 0.4 })
  );

  // 3. Bounce
  animations.push(
    gsap.fromTo(box3.value, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "bounce.out", delay: 0.6 })
  );

  // 4. Elastic
  animations.push(
    gsap.fromTo(box4.value, { x: -100, rotation: -90 }, { x: 0, rotation: 0, duration: 1.8, ease: "elastic.out(1, 0.5)", delay: 0.8 })
  );

  // 5. Flip 3D
  animations.push(
    gsap.fromTo(box5.value, { rotationY: -180, opacity: 0 }, { rotationY: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 1 })
  );

  // 6. Slide & Skew
  animations.push(
    gsap.fromTo(box6.value, { x: 100, opacity: 0, skewX: 20 }, { x: 0, opacity: 1, skewX: 0, duration: 1, ease: "power3.out", delay: 1.2 })
  );

  // 7. Morph Shape
  animations.push(
    gsap.fromTo(box7.value, { borderRadius: "50%", scale: 0.5, rotation: 0 }, { borderRadius: "16px", scale: 1, rotation: 360, duration: 1.5, ease: "power2.inOut", delay: 1.4 })
  );

  // 8. Text Stagger
  const chars = box8.value?.querySelectorAll(".char");
  if (chars) {
    animations.push(
      gsap.fromTo(chars, { opacity: 0, y: 30, rotation: -20 }, { opacity: 1, y: 0, rotation: 0, duration: 0.8, stagger: 0.1, ease: "back.out(2)", delay: 1.6 })
    );
  }

  // 9. Magnetic hover
  if (box9.value) {
    box9.value.addEventListener("mouseenter", () => {
      gsap.to(box9.value, { scale: 1.1, duration: 0.3, ease: "power2.out" });
    });
    box9.value.addEventListener("mouseleave", () => {
      gsap.to(box9.value, { scale: 1, x: 0, y: 0, duration: 0.3, ease: "power2.out" });
    });
    box9.value.addEventListener("mousemove", (e) => {
      const rect = box9.value.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(box9.value, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
    });

    animations.push(
      gsap.fromTo(box9.value, { scale: 0, rotation: 180 }, { scale: 1, rotation: 0, duration: 1, ease: "back.out(1.7)", delay: 1.8 })
    );
  }

  // 10. Motion Path
  if (box10.value && motionPath.value) {
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
            path: motionPath.value,
            align: motionPath.value,
            alignOrigin: [0.5, 0.5],
            autoRotate: true,
          },
          repeat: -1,
          repeatDelay: 0.5,
        }
      )
    );
  }
};

const replayAll = () => {
  initAnimations();
};

onMounted(() => {
  initAnimations();
});
</script>

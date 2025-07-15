<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import { supabase } from './lib/supabaseClient';

// console.log(supabase);
</script>

<template>
  <header class="bg-blue-600 text-white shadow-md">
    <div class="wrapper max-w-7xl mx-auto px-4 py-3">
      <nav class="text-xl flex justify-between items-center">
        <div class="font-bold text-2xl">
          <RouterLink
            to="/"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            My App
          </RouterLink>
        </div>
        <div class="space-x-4">
          <RouterLink
            to="/save_vector_post"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            Save Vector Post
          </RouterLink>
          <RouterLink
            to="/chat_bot"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            Chat Bot
          </RouterLink>
          <RouterLink
            to="/image_analyzer"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            Image Analyzer
          </RouterLink>
          <RouterLink
            to="/pdf_reader"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            PDF Reader
          </RouterLink>
          <!-- <RouterLink
            to="/login"
            class="hover:text-blue-200 transition-colors duration-200"
          >
            Login
          </RouterLink> -->
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>

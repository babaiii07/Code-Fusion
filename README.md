---
title: CodeFusion
emoji: 🐳
colorFrom: blue
colorTo: blue
sdk: docker
pinned: true
app_port: 5173
license: mit
short_description: Generate any application with DeepSeek
models:
  - deepseek-ai/DeepSeek-V3-0324
---

# CodeFusion 🐳
CodeFusion is a coding platform powered by generative AI, designed to make coding smarter and more efficient. Tailored for developers, data scientists, and AI engineers, it integrates generative AI into your coding projects to enhance creativity.

## How to use it locally
Follow [this discussion](https://huggingface.co/spaces/enzostvs/codefusion/discussions/74)

## Deployment

### Deploy to Vercel
1. [Sign up](https://vercel.com/signup) or log in to Vercel.
2. Click 'New Project' and import your CodeFusion repository.
3. Set the build command to `npm run build` and the output directory to `dist`.
4. Click 'Deploy'.

### Deploy to Netlify
1. [Sign up](https://app.netlify.com/signup) or log in to Netlify.
2. Click 'Add new site' > 'Import an existing project'.
3. Connect your repository and set the build command to `npm run build` and publish directory to `dist`.
4. Click 'Deploy site'.

### Deploy on Your Own Server
1. Run `npm run build` to generate the production build in the `dist` folder.
2. Serve the `dist` folder using a static server like [serve](https://www.npmjs.com/package/serve):
   ```sh
   npx serve dist
   ```
3. Or configure your own Nginx/Apache server to serve the `dist` directory.
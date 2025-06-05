export const defaultHTML = `<!DOCTYPE html>
<html>
  <head>
    <title>My app</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta charset="utf-8">
    <style>
      body {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        height: 100dvh;
        font-family: "Arial", sans-serif;
        text-align: center;
      }
      h1 {
        font-size: 50px;
      }
      h1 span {
        color: #acacac;
        font-size: 32px;
      }
      .github-link {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: #4D6BFE;
        font-size: 1.05rem;
        font-weight: 500;
        text-decoration: none;
        margin-bottom: 10px;
        transition: color 0.2s;
      }
      .github-link:hover {
        color: #222;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>
        <span>I'm ready to work,</span><br />
        Ask me anything.
      </h1>
      <a href="https://github.com/babaiii07" class="github-link" target="_blank" rel="noopener">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.289-1.553 3.295-1.23 3.295-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.217.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
        GitHub
      </a>
    </div>
    <script></script>
  </body>
</html>
`;

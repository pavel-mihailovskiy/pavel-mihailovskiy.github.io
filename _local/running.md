# Run locally

Personal notes — not published on the site (this `_local/` folder is ignored by Jekyll).

This is a Jekyll site. You need Ruby and Bundler installed.

## 1. Install dependencies

```bash
bundle install
```

## 2. Start the local server

```bash
bundle exec jekyll serve
```

## 3. Open in the browser

Go to [http://localhost:4000](http://localhost:4000)

## Useful options

```bash
# Live reload when files change
bundle exec jekyll serve --livereload

# Bind to all interfaces (access from other devices on your network)
bundle exec jekyll serve --host 0.0.0.0
```

Stop the server with `Ctrl+C`.

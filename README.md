# Guided Meditation

The missile knows where it is at all times. It knows this, because it has a debug guide!

> "We have an [Expert System](https://en.wikipedia.org/wiki/Expert_system) at home!"  
> The expert system in question:

## Folders

- `content/` - the knowledge base of the system
- [`gitbook/` - GitBook integration](#gitbook-integration)
- [`web/` - the main implementation](#web)

## Deployment

> TODO: A guide + separate the content yaml from the code

You're more than welcome to fork this project for your own use.
This repository is setup to be automatically deployed to GitHub Pages for every change made on the main branch.

## Development

This project uses `pnpm`, run `pnpm i` to install dependencies for all sub-projects.

### GitBook Integration

It's only purpose at the moment is to embed the web implementation 
on GitBook.  
Everything here is pre-configured to work with Red Modding Gitbook,
one just has to auth to work on it (`pnpm gitbook auth`).

#### Dev mode

Run `pnpm dev` and GitBook will do some magic that will sync the project with the released version.
Refreshing the browser seems to be manual though.

#### Releasing

To release the integration to the org:

1. run `pnpm run publish` (**NOT** ~~`pnpm publish`~~)

### Web

Web.

#### Dev mode

Run `pnpm dev`.

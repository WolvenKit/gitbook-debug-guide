# gitbook-debug-guide
A guiding system as an Integration in Gitbook.


## Development

Run `pnpm dev` and GitBook will do some magic that will sync the project with the released version.
Refreshing the browser seems to be manual though.

## Releasing

To release the integration to the org:
0. make sure you're authed (`pnpm gitbook auth`)
1. run `pnpm run publish` (**NOT** ~~`pnpm publish`~~)

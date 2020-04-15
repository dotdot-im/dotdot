![Img](https://github.com/dotdot-im/dotdot-assets/raw/master/transparent/main-black@3x.png)

![Deploy](https://github.com/aurbano/dotdot/workflows/Deploy/badge.svg)

## Development

### Using Icons

We have access to the FontAwesome free icons library. But we only import the ones we need to keep bundle size down.

To add a new icon:

1. Go to `src/lib/icons.ts`
1. Import it at the top, and add it to the list of exports at the bottom

To use icons:

```jsx
<FontAwesomeIcon icon="icon name" />
```

> Icons are typesafe, so if you use the wrong name in the FontAwesomeIcon component it'll warn you.

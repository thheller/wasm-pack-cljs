# Using .wasm in CLJS

Using WebAssembly code in a CLJS project isn't something many people do yet but it is something I have been following for quite some time now and it hasn't been exactly smooth to do this in the past. It isn't smooth yet either but it is getting better.

The main issue is pretty much only the generated JavaScript glue-code these tools generate. They are often very specific and either rather unfriendly towards bundlers or written specifically for a single bundler (ie. webpack).

Mostly this is because of unfinished specs in that area so I hope things continue to improve over time. Of course a lot of work needs to be done in `shadow-cljs` as well but I'm not going to touch that until its all relatively stable and standardized.


## Status Report May 2020

Every few months I take a rather simple example and try to get it working in a CLJS project. This time I tried `wasm-pack` from Rust and the result is almost close to usable. I have yet to try more complex examples but the really simple one worked.

**You can find the compiled version [here](https://code.thheller.com/demos/wasm-pack-cljs/index.html).** It is entirely boring though.

I took the code from the [wasm-pack examples/without-a-bundler](https://github.com/rustwasm/wasm-bindgen/tree/d896446edcbf96246d5af76463de7b8c37d9bebc/examples/without-a-bundler) repo and did a few modifications to get it to work and survive the Closure Compiler `:advanced` optimzations.

For the WASM related code I first ran

```bash
$ cd without-a-bundler
# cargo and wasm-pack I already had installed
# can't remember how to do that anymore though
$ sh build.sh
$ cp pkg/without_a_bundler.js ../src/gen/demo
$ cp pkg/without_a_bundler_bg.wasm ../public/wasm
```
I then made the changes described below in the `src/gen/demo/without_a_bundler.js`.


After taking those steps you can compile the CLJS code via `shadow-cljs`.

```bash
$ npm install
# leave this running
$ npx shadow-cljs server

# then run separately
$ npx shadow-cljs watch app
# or for a release/minified build
$ npx shadow-cljs release app

# open the page, check the browser console
$ open http://localhost:8060
```

## Code Adjustments

### import.meta

import.meta cannot be transpiled away so this needs to go. We'll just pass in the URL into the `init` fn instead.

```js
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
```

### `:advanced` renaming issues

The generated `imports` object that will be passed into the WASM Module is created using regular properties. This is fine but breaks in `:advanced` compilation unless we add externs. In this example I opted to just rewrite to use `["prop"]` notation instead. After `:advanced` the code will actually just use dot notation again but Closure won't rename anything.

```js
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_instanceof_Window_17fdb5cd280d476d = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
```
becomes
```js
    const imports = {};
    imports["wbg"] = {};
    imports["wbg"]["__wbindgen_object_drop_ref"] = function(arg0) {
        takeObject(arg0);
    };
    imports["wbg"]["__wbg_instanceof_Window_17fdb5cd280d476d"] = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
```
after `:advanced` this looks something like (not pretty-printed of course)
```js
        const c = {
            wbg: {}
        };
        c.wbg.__wbindgen_object_drop_ref = function(e) {
            T(e)
        };
        c.wbg.__wbg_instanceof_Window_17fdb5cd280d476d = function(e) {
            return R[e]instanceof Window
        };
```
This also applies to the exports from the WASM module, so need to do this for every `wasm` use as well.

```js
export function add(a, b) {
    var ret = wasm.add(a, b);
    return ret >>> 0;
}
```

becomes

```js
export function add(a, b) {
    var ret = wasm["add"](a, b);
    return ret >>> 0;
}
```

Of course that is much too tedious to do by hand each time but could be done trivially by `wasm-pack` directly. Would also be much easier for us if `wasm-pack` just generated a `.json` file to so with that information. The generated `.d.ts` is lacking vital information (eg. the names for the `imports` object) so that is not enough.

At one point the wasm could even be optimized to use shorter names by letting Closure shorten everything first and then rewriting the names in the `.wasm` directly as well.

I'll probably revisit this in a couple of months to see where things are then.
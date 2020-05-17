# Without a Bundler

Code copied from

https://github.com/rustwasm/wasm-bindgen/tree/d896446edcbf96246d5af76463de7b8c37d9bebc/examples/without-a-bundler

[View documentation for this example online][dox]

[dox]: https://rustwasm.github.io/docs/wasm-bindgen/examples/without-a-bundler.html

You can build the example locally with:

```
$ wasm-pack build --target web
```

Then serve this directory in your favourite webserver and navigate to `host:port`
to open the index.html in your browser:

```
# static server from https://crates.io/crates/https
http

# or use python
python2 -m SimpleHTTPServer
python3 -m http.server
```

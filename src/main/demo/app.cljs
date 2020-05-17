(ns demo.app
  ;; actually bundled but too lazy to change the name
  (:require ["./without_a_bundler.js" :as wasm :default wasm-init]))

(defn wasm-ready []
  (js/console.log "wasm/add" (wasm/add 1 2)))

(defn start []
   (-> (wasm-init "wasm/without_a_bundler_bg.wasm")
       (.then wasm-ready)))

(defn init []
  (js/console.log "hello from cljs")
  (start))


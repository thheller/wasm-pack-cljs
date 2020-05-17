let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
*/
export function main() {
    wasm["main"]();
}

/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add(a, b) {
    var ret = wasm["add"](a, b);
    return ret >>> 0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm["__wbindgen_exn_store"](addHeapObject(e));
        }
    };
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    const imports = {};
    imports["wbg"] = {};
    imports["wbg"]["__wbindgen_object_drop_ref"] = function(arg0) {
        takeObject(arg0);
    };
    imports["wbg"]["__wbg_instanceof_Window_17fdb5cd280d476d"] = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports["wbg"]["__wbg_document_c26d0f423c143e0c"] = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports["wbg"]["__wbg_body_be181e812b4c9a18"] = function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports["wbg"]["__wbg_createElement_44ab59c4ad367831"] = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbg_setinnerHTML_3eadb06031bae824"] = function(arg0, arg1, arg2) {
        getObject(arg0).innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports["wbg"]["__wbg_appendChild_3d4ec7dbf3472d31"] = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbg_call_1f85aaa5836dfb23"] = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbindgen_object_clone_ref"] = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports["wbg"]["__wbg_newnoargs_8aad4a6554f38345"] = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports["wbg"]["__wbg_self_c0d3a5923e013647"] = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbg_window_7ee6c8be3432927d"] = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbg_globalThis_c6de1d938e089cf0"] = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbg_global_c9a01ce4680907f8"] = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports["wbg"]["__wbindgen_is_undefined"] = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports["wbg"]["__wbindgen_throw"] = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports["wbg"]["__wbindgen_rethrow"] = function(arg0) {
        throw takeObject(arg0);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm["__wbindgen_start"]();
    return wasm;
}

export default init;


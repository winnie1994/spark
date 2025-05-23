# forge-internal-rs

Rust WebAssembly functions for forge-internal.

## Installing build tools

First, we need to install Rust. Though it is possible to install it using Homebrew, we recommend installing `rustup` using the approach on the Rust homepage:

https://www.rust-lang.org/tools/install

It will most likely involve simply running:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Once you have `rustup` and Rust, we need to install dependencies for building Rust Wasm.
```
rustup target add wasm32-unknown-unknown
cargo install wasm-pack
```

## Building

Run the following script inside `forge-internal/rust`:
```
./build_rust_wasm.sh
```

You can also build it manually by running these commands:
```
cd forge-internal-rs
wasm-pack build --target web
```

The generated files will be in the `pkg/` subdirectory, which is already symlinked in `forge-internal/package.json`.

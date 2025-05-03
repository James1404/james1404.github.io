---
title: "Rama programming language"
---

[Github link](https://github.com/James1404/rama-lang)

Rama is a WIP programming language designed to be a low level language with high level semantics.\
The compiler is being written in rust and currently it can compile some basic code.

Compiler pipeline:

-   Source code
-   Token
-   AST
-   Typed AST
-   Intermediate Language
-   LLVM IR
-   Machine Code

#### Factorial

```rust
fn factorial(n: i32) i32 {
   if n == 0 {
      1
   } else {
      factorial(n - 1)
   }
}

fn main() void {
   factorial(25);
}
```

#### Generics

```rust
type Vec2<T> = struct {
     x: T;
     y: T;
};

fn main() void {
   var pos = Vec2 { x: 0, y: 25 };
}
```

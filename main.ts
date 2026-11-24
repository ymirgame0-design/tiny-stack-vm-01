// tiny-stack-vm-01 — minimal 4 KB stack VM for make.fun bounty
// Opcodes: PUSH, ADD, SUB, MUL, DIV, LOAD, STORE, PRINT, HALT

const OP = {
  PUSH: 0x01, ADD: 0x02, SUB: 0x03, MUL: 0x04, DIV: 0x05,
  LOAD: 0x06, STORE: 0x07, PRINT: 0x08, HALT: 0x09,
};

class VM {
  stack = [];
  mem = new Map();
  pc = 0;
  halt = false;

  run(code) {
    while (!this.halt && this.pc < code.length) {
      const op = code[this.pc++];
      switch (op) {
        case OP.PUSH: this.stack.push(code[this.pc++]); break;
        case OP.ADD: { const b = this.pop(), a = this.pop(); this.stack.push(a + b); break; }
        case OP.SUB: { const b = this.pop(), a = this.pop(); this.stack.push(a - b); break; }
        case OP.MUL: { const b = this.pop(), a = this.pop(); this.stack.push(a * b); break; }
        case OP.DIV: { const b = this.pop(), a = this.pop(); this.stack.push(Math.floor(a / b)); break; }
        case OP.LOAD: { const addr = code[this.pc++]; this.stack.push(this.mem.get(addr) ?? 0); break; }
        case OP.STORE: { const addr = code[this.pc++]; this.mem.set(addr, this.pop()); break; }
        case OP.PRINT: console.log(this.pop()); break;
        case OP.HALT: this.halt = true; break;
        default: throw new Error(`bad opcode ${op}`);
      }
    }
  }

  pop() { return this.stack.pop(); }
}

// (3 + 4) * 2 = 14, then store to mem[0] and reload
const prog = [
  OP.PUSH,3, OP.PUSH,4, OP.ADD, OP.PUSH,2, OP.MUL,
  OP.PRINT,
  OP.STORE, 0,
  OP.PUSH, 99, OP.STORE, 1,
  OP.LOAD, 0, OP.PRINT,
  OP.HALT,
];
new VM().run(prog);
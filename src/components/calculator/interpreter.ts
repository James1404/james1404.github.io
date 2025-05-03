import { exec } from "child_process";

type Identifier = {
    type: "Identifier";
    value: string;
};

type BaseToken = {
    line: number;
    loc: number;
};

type IdentifierToken = BaseToken & {
    type: "identifier";
    id: string;
};

type StringToken = BaseToken & {
    type: "string";
    value: string;
};

type NumberToken = BaseToken & {
    type: "number";
    value: number;
};

const validCharacters = [
    "(",
    ")",
    "-",
    "+",
    "/",
    "*",
    "^",
    "<",
    ">",
    "!",
    "=",
    "%",
    ",",
    ".",
    ":",
    ";",
] as const;
type CharacterToken = BaseToken & {
    type: (typeof validCharacters)[number];
};

const validKeywords = [
    "fn",
    "if",
    "for",
    "while",
    "break",
    "continue",
    "let",
] as const;
type KeywordToken = BaseToken & {
    type: (typeof validKeywords)[number];
};

type EndToken = BaseToken & {
    type: "End";
};

type Token =
    | EndToken
    | CharacterToken
    | KeywordToken
    | IdentifierToken
    | NumberToken
    | StringToken;

const TokenToString = (t: Token): string => {
    switch (t.type) {
        case "string":
            return `String '${t.value}'`;
        case "number":
            return `Number '${t.value}'`;
        case "identifier":
            return `Identifier '${t.id}'`;
        default:
            return t.type;
    }
};

type Lexer = {
    source: string;
    idx: number;
    line: number;
    tokens: Token[];
};

function makeLexer(source: string): Lexer {
    return {
        source: source,
        idx: 0,
        line: 0,
        tokens: [],
    };
}

function isNumber(c: string): boolean {
    return c.length === 1 && c >= "0" && c <= "9";
}

function isLetter(c: string): boolean {
    return (
        c.length === 1 &&
        ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c == "_")
    );
}

function runLexer(lexer: Lexer) {
    const safe = () => lexer.idx < lexer.source.length;
    const current = () => (safe() ? lexer.source[lexer.idx] : "");
    const advance = () => lexer.idx++;
    const make = (t: Token) => lexer.tokens.push(t);

    while (safe()) {
        let c = current();
        const start = lexer.idx;
        advance();

        switch (c) {
            case " ":
            case "\n":
            case "\t":
            case "\r": // skip whitespace
                break;
            case "/":
                if (current() == "/") {
                    // skip comment
                    while (current() != "\n") advance();
                    break;
                }
            default:
                if (validCharacters.includes(c as CharacterToken["type"])) {
                    make({
                        type: c as CharacterToken["type"],
                        line: lexer.line,
                        loc: lexer.idx,
                    });
                    break;
                }

                if (isLetter(c)) {
                    while (isLetter(current())) advance();

                    let id = lexer.source.slice(start, lexer.idx);

                    if (validKeywords.includes(id as KeywordToken["type"])) {
                        make({
                            type: id as KeywordToken["type"],
                            line: lexer.line,
                            loc: lexer.idx,
                        });
                    } else {
                        make({
                            type: "identifier",
                            line: lexer.line,
                            loc: lexer.idx,
                            id,
                        });
                    }

                    break;
                }

                if (isNumber(c)) {
                    while (isNumber(current()) || current() == ".") {
                        advance();
                    }

                    let value = Number(lexer.source.slice(start, lexer.idx));
                    make({
                        type: "number",
                        line: lexer.line,
                        loc: lexer.idx,
                        value,
                    });
                    break;
                }

                // invalid character
                errors.push({ msg: `'${c}' is an invalid character` });
                break;
        }
    }

    make({ type: "End", line: lexer.line, loc: lexer.idx });
}

export type KiltError = {
    msg: string;
};

const errors: KiltError[] = [];

export type KiltValue = number;

type BinaryNode = {
    type: "BinaryNode";
    lhs: Node;
    op: Token;
    rhs: Node;
};

type UnaryNode = {
    type: "UnaryNode";
    op: Token;
    node: Node;
};

type ValueNode = {
    type: "ValueNode";
    value: KiltValue;
};

type FunctionCallNode = {
    type: "FunctionCallNode";
    fn: string;
    args: Node[];
};

type InvalidNode = {
    type: "InvalidNode";
};

type Node = BinaryNode | UnaryNode | ValueNode | InvalidNode | FunctionCallNode;

type Parser = {
    tree?: Node;
    tokens: Token[];
    idx: number;
};

const OperatorPrecedence: Record<string, number> = {
    "+": 1,
    "-": 1,

    "*": 2,
    "/": 2,

    "^": 3,
};

const GetOperatorPrecedence = (t: Token) => {
    return OperatorPrecedence[t.type] ?? -1;
};

const makeParser = (lexer: Lexer): Parser => ({ tokens: lexer.tokens, idx: 0 });

function runParser(parser: Parser) {
    const safe = () => parser.idx < parser.tokens.length;
    const advance = () => (safe() ? parser.idx++ : parser.idx);
    const current = () => parser.tokens[parser.idx];
    const advance_if = (type: string): void => {
        if (current().type == type) advance();
    };

    function value(): Node {
        let c = current();
        advance();
        switch (c.type) {
            case "number":
                return {
                    type: "ValueNode",
                    value: c.value,
                };
            case "-":
                const v = value();
                return {
                    type: "UnaryNode",
                    op: c,
                    node: v,
                };
            case "(":
                const inner = expression(value(), 0);

                if (current().type == ")") {
                    advance();
                    return inner;
                }

                errors.push({
                    msg: `Expected a closing parenthesis`,
                });

                return { type: "InvalidNode" };
            case "identifier":
                if (current().type == "(") {
                    advance();
                    const args: Node[] = [];
                    let hanging_separator = false;
                    while (current().type != ")") {
                        const val = expression(value(), 0);

                        if (val.type != "InvalidNode") {
                            args.push(val);
                        }

                        if (current().type == ",") {
                            hanging_separator = true;
                            advance();
                        }
                    }
                    advance();

                    if (hanging_separator) {
                        errors.push({ msg: `hanging_separator` }); // TODO: Improve error message
                        break;
                    }

                    return {
                        type: "FunctionCallNode",
                        fn: c.id,
                        args,
                    };
                }
                break;
        }

        return { type: "InvalidNode" };
    }

    function expression(lhs: Node, min: number): Node {
        let lookahead = current();
        let lookahed_prec = GetOperatorPrecedence(lookahead);

        while (lookahed_prec >= min) {
            const op = lookahead;
            advance();
            let rhs = value();
            lookahead = current();
            lookahed_prec = GetOperatorPrecedence(lookahead);

            if (!lookahed_prec) {
                errors.push({
                    msg: `'${TokenToString(lookahead)}' is an invalid operator`,
                });
                return { type: "InvalidNode" };
            }

            while (lookahed_prec > GetOperatorPrecedence(op)) {
                rhs = expression(rhs, GetOperatorPrecedence(op) + 1);
                lookahead = current();
                lookahed_prec = GetOperatorPrecedence(lookahead);

                if (!lookahed_prec) {
                    errors.push({
                        msg: `'${TokenToString(
                            lookahead
                        )}' is an invalid operator`,
                    });
                    return { type: "InvalidNode" };
                }
            }

            lhs = {
                type: "BinaryNode",
                lhs,
                op,
                rhs,
            };
        }

        return lhs;
    }

    parser.tree = expression(value(), 0);
}

const intrinsics: Record<string, (args: KiltValue[]) => KiltValue> = {
    sqrt: args => Math.sqrt(args[0]),
    sin: args => Math.sin(args[0]),
    tan: args => Math.tan(args[0]),
    cos: args => Math.cos(args[0]),
};

function execNode(node?: Node): KiltValue {
    if (!node) return 0;

    switch (node.type) {
        case "BinaryNode":
            const lhs = execNode(node.lhs);
            const rhs = execNode(node.rhs);

            switch (node.op.type) {
                case "+":
                    return lhs + rhs;
                case "-":
                    return lhs - rhs;
                case "*":
                    return lhs * rhs;
                case "/":
                    return lhs / rhs;
                case "^":
                    return Math.pow(lhs, rhs);
                default:
                    errors.push({
                        msg: `'${node.op.type}' is an invalid binary operator`,
                    });
            }
            break;
        case "UnaryNode":
            let val = execNode(node.node);
            return -val;
        case "ValueNode":
            return node.value;
        case "FunctionCallNode":
            if (node.fn in intrinsics) {
                const args: KiltValue[] = node.args.map(n => execNode(n));
                return intrinsics[node.fn](args);
            } else {
                errors.push({ msg: `Function '${node.fn}' does not exist` });
            }
            break;
        case "InvalidNode":
            errors.push({ msg: "Invalid Node" });
            break;
    }

    return 0;
}

export function GetErrors(): KiltError[] | undefined {
    if (errors.length === 0) {
        return;
    }

    return errors;
}

export function runInterpreter(source: string): KiltValue {
    while (errors.length > 0) errors.pop();

    const lexer = makeLexer(source);
    runLexer(lexer);

    if (errors.length > 0) return 0;

    const parser = makeParser(lexer);
    runParser(parser);

    if (errors.length > 0) return 0;

    const result = execNode(parser.tree);
    return result;
}

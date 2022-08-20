import { Token, tt, lookupIndent } from "../token/token";

function isLetter(ch: string | number): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || ch === "_";
}

function isNumber(ch: string | number): boolean {
  return ch >= "0" && ch <= "9";
}

function isWhiteSpace(ch: string | number): boolean {
  return ch === " " || ch === "\t" || ch === "\n" || ch === "\r";
}

export class Lexer {
  // 需要分词的文本
  input: string;
  // 当前字符所在的位置
  position: number;
  // 当前字符下一个位置
  readPosition: number;
  // 当前字符
  ch: string | number;

  constructor(i: string) {
    this.input = i;
    this.readPosition = 0;
    this.readChar();
  }

  /**
   * 读取字符
   */
  readChar(): void {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input.charAt(this.readPosition);
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  /**
   * 获取下一个 token
   * @returns { Token } token
   */
  nextToken(): Token {
    let tok: Token;

    this.skipWhiteSpace();
    switch (this.ch) {
      case "=":
        tok = new Token(tt.ASSIGN, this.ch);
        break;
      case "!":
        tok = new Token(tt.BANG, this.ch);
        break;
      case "+":
        tok = new Token(tt.PLUS, this.ch);
        break;
      case "-":
        tok = new Token(tt.MINUS, this.ch);
        break;
      case "*":
        tok = new Token(tt.ASTERISK, this.ch);
        break;
      case "/":
        tok = new Token(tt.SLASH, this.ch);
        break;
      case ",":
        tok = new Token(tt.COMMA, this.ch);
        break;
      case ";":
        tok = new Token(tt.SEMICOLON, this.ch);
        break;
      case "(":
        tok = new Token(tt.LPAREN, this.ch);
        break;
      case ")":
        tok = new Token(tt.RPAREN, this.ch);
        break;
      case "{":
        tok = new Token(tt.LBRACE, this.ch);
        break;
      case "}":
        tok = new Token(tt.RBRACE, this.ch);
        break;
      case "<":
        tok = new Token(tt.LT, this.ch);
        break;
      case ">":
        tok = new Token(tt.GT, this.ch);
        break;
      case 0:
        tok = new Token(tt.EOF, "");
        break;
      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          let type = lookupIndent(literal);
          tok = new Token(type, literal);
          return tok;
        } else if (isNumber(this.ch)) {
          let literal = this.readNumber();
          tok = new Token(tt.INT, literal);
          return tok;
        } else {
          tok = new Token(tt.ILLEGAL, this.ch as string);
        }
        break;
    }
    this.readChar();
    return tok;
  }

  /**
   * 读取标识符或关键字
   * @returns
   */
  readIdentifier(): string {
    let position = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  /**
   * 读取数字
   * @returns
   */
  readNumber(): string {
    let position = this.position;
    while (isNumber(this.ch)) {
      this.readChar();
    }
    return this.input.substring(position, this.position);
  }

  /**
   * 跳过空白字符
   */
  skipWhiteSpace(): void {
    while (isWhiteSpace(this.ch)) {
      this.readChar();
    }
  }
}

import { Token, tt } from "../token/token";

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

    switch (this.ch) {
      case "=":
        tok = new Token(tt.ASSIGN, this.ch);
        break;
      case "+":
        tok = new Token(tt.PLUS, this.ch);
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
      case 0:
        tok = new Token(tt.EOF, "");
        break;
      default:
        break;
    }
    
    this.readChar()
    return tok;
  }
}

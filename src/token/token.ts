export type TokenType = string;

export class Token {
  /** token 类型 */
  type: TokenType;
  /** token 文本内容 */
  literal: string;

  constructor(type: TokenType, literal: string) {
    this.type = type;
    this.literal = literal;
  }
}

export type InternalTokenTypes = {
  [name: string]: TokenType;
};

// token 分类
export const tt: InternalTokenTypes = {
  ILLEGAL: "ILLEGAL", // 非法字符
  EOF: "EOF", // 文本结束标记

  // Identifiers + literals
  IDENT: "IDENT", // 标识符 add, foobar, x, y, ...
  INT: "INT", // 整形数字

  // Operators
  ASSIGN: "=", // 赋值
  PLUS: "+", // 赋值

  // 分隔符
  COMMA: ",", // 逗号
  SEMICOLON: ";", // 分号

  LPAREN: "(", // 左小括号
  RPAREN: ")", // 右小括号
  LBRACE: "{", // 左大括号
  RBRACE: "}", // 右大括号

  // 关键字
  FUNCTION: "FUNCTION",
  LET: "LET",
};

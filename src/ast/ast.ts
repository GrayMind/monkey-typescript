import { Token } from "../token/token";

export interface Node {
  tokenLiteral(): string;
}

// 语句
export interface Statement extends Node {
  statementNode(): void;
}

// 表达式
export interface Expression extends Node {
  expressionNode(): void;
}

// 程序入口
export class Program implements Node {
  statements: Statement[];

  tokenLiteral(): string {
    if (this.statements && this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }
}

// TODO: Identifier 为什么是一个表达式
export class Identifier implements Expression {
  token: Token;
  value: string;

  constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  expressionNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}

/**
 * let 表达式
 * let <identifier> = <expression>;
 */
export class LetStatement implements Statement {
  token: Token;
  name: Identifier;
  value: Expression;

  statementNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}

/**
 * return 表达式
 * return <expression>;
 */
export class ReturnStatement implements Statement {
  token: Token;
  returnValue: Expression;

  statementNode(): void {}

  tokenLiteral(): string {
    return this.token.literal;
  }
}
